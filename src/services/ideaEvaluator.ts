// ideaEvaluator.ts

export interface EvaluationResult {
    passed: boolean;
    score: number;
    feedback: string;
    recommendations: string[];
  }
  export interface EvaluationDetailsResult {
    successProbability: number;
    riskLevel: 'Low' | 'Medium' | 'High';
    expectedROI: string;
    innovationScore: number;
    marketPotential: number;
    executionComplexity: number;
  }

  export const evaluateIdea = async (idea: {
    title: string;
    description: string;
    metadata: Record<string, any>;
  }): Promise<EvaluationResult> => {
    const endpoint = import.meta.env.VITE_AI_ENDPOINT;
    const apiKey = import.meta.env.VITE_AI_API_KEY;
  
    const systemPrompt = `Eres un evaluador experto de ideas de negocio. Analiza la siguiente propuesta considerando todos sus aspectos: título, descripción, categoría, problema que resuelve, solución propuesta, mercado objetivo, costos de ejecución, riesgos potenciales y detalles sobre tokenización o regalías.
  
  Proporciona una evaluación detallada en el siguiente formato JSON:
  
  {
    "passed": boolean,
    "score": number,
    "feedback": string,
    "recommendations": string[]
  }
  
  No incluyas ningún texto adicional fuera del bloque JSON.`;
  
    const userPrompt = `
  Título: ${idea.title}
  Descripción: ${idea.description}
  Categoría: ${idea.metadata.category}
  Problema: ${idea.metadata.problemStatement}
  Solución: ${idea.metadata.proposedSolution}
  Mercado Objetivo: ${idea.metadata.targetMarket}
  Costo de Ejecución: ${idea.metadata.executionCost}
  Riesgos Potenciales: ${idea.metadata.potentialRisks}
  Ofrece Regalías: ${idea.metadata.offerRoyalties ? 'Sí' : 'No'}
  Porcentaje de Regalías: ${idea.metadata.royaltyPercentage}
  Términos de Regalías: ${idea.metadata.royaltyTerms}
  Tokeniza la Idea: ${idea.metadata.tokenizeIdea ? 'Sí' : 'No'}
  Cantidad de Tokens: ${idea.metadata.tokenCount}
  Símbolo del Token: ${idea.metadata.tokenSymbol}
  Tipo de Venta de Token: ${idea.metadata.tokenSaleType}
  `;
  
    try {
      const response = await fetch(`${endpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: userPrompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 1024
          }
        })
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta de la IA:', errorText);
        throw new Error(`La solicitud a la API falló con el estado ${response.status}`);
      }
  
      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text.trim();
      console.log('🔍 Respuesta completa de la IA:', aiResponse); // 👈 Aquí verás el JSON (o bloque Markdown)
  
      // Función para limpiar el bloque de código Markdown
      const cleanJsonResponse = (text: string): string => {
        return text.replace(/^```json\s*|```$/g, '').trim();
      };
  
      try {
        const cleanedResponse = cleanJsonResponse(aiResponse);
        const parsed = JSON.parse(cleanedResponse);
        return {
          passed: parsed.passed,
          score: parsed.score,
          feedback: parsed.feedback,
          recommendations: parsed.recommendations
        };
      } catch (parseError) {
        console.error('Error al parsear la respuesta de la IA:', parseError);
        throw new Error('La respuesta de la IA no está en el formato JSON esperado.');
      }
    } catch (error) {
      console.error('Error al evaluar la idea:', error);
      throw new Error('No se pudo evaluar la idea. Por favor, inténtalo de nuevo.');
    }
  };
  

  //details idea page:


export const evaluateIdeaDetailsWithAI = async (ideaData: any): Promise<EvaluationDetailsResult> => {
  console.log('🚀 Iniciando evaluateIdeaDetailsWithAI con ideaData:', JSON.stringify(ideaData, null, 2));

  const endpoint = import.meta.env.VITE_AI_ENDPOINT;
  const apiKey = import.meta.env.VITE_AI_API_KEY;

  if (!endpoint || !apiKey) {
    console.error('❌ Error: Endpoint o clave de API no configurados', { endpoint, apiKey });
    throw new Error('El endpoint de IA o la clave de API no están configurados.');
  }

  if (!ideaData || !ideaData.title || !ideaData.description) {
    console.error('❌ Error: Datos de idea inválidos', { ideaData });
    throw new Error('Datos de idea inválidos: se requieren título y descripción.');
  }

  console.log('🔧 Configuración válida. Endpoint:', endpoint, 'Clave de API:', apiKey.slice(0, 5) + '...');

  const systemPrompt = `Eres un evaluador experto de ideas de negocio. Analiza la siguiente propuesta considerando todos sus aspectos: título, descripción, categoría, problema que resuelve, solución propuesta, mercado objetivo, costos de ejecución, riesgos potenciales y detalles sobre tokenización o regalías.

Proporciona una evaluación detallada en el siguiente formato JSON:

{
  "successProbability": number,
  "riskLevel": "Low" | "Medium" | "High",
  "expectedROI": string,
  "innovationScore": number,
  "marketPotential": number,
  "executionComplexity": number
}

No incluyas ningún texto adicional fuera del bloque JSON.`;

  const userPrompt = `
Título: ${ideaData.title}
Descripción: ${ideaData.description}
Categoría: ${ideaData.metadata?.category || 'N/A'}
Problema: ${ideaData.metadata?.problemStatement || 'N/A'}
Solución: ${ideaData.metadata?.proposedSolution || 'N/A'}
Mercado Objetivo: ${ideaData.metadata?.targetMarket || 'N/A'}
Costo de Ejecución: ${ideaData.metadata?.executionCost || 'N/A'}
Riesgos Potenciales: ${ideaData.metadata?.potentialRisks || 'N/A'}
Ofrece Regalías: ${ideaData.metadata?.offerRoyalties ? 'Sí' : 'No'}
Porcentaje de Regalías: ${ideaData.metadata?.royaltyPercentage || 'N/A'}
Términos de Regalías: ${ideaData.metadata?.royaltyTerms || 'N/A'}
Tokeniza la Idea: ${ideaData.metadata?.tokenizeIdea ? 'Sí' : 'No'}
Cantidad de Tokens: ${ideaData.metadata?.tokenCount || 'N/A'}
Símbolo del Token: ${ideaData.metadata?.tokenSymbol || 'N/A'}
Tipo de Venta de Token: ${ideaData.metadata?.tokenSaleType || 'N/A'}
`;

  console.log('📝 Prompt enviado a la IA:', { systemPrompt, userPrompt });

  return fetchAIValidationForIdea(endpoint, apiKey, systemPrompt, userPrompt);
};

const fetchAIValidationForIdea = async (
  endpoint: string,
  apiKey: string,
  systemPrompt: string,
  userPrompt: string,
  retries: number = 3,
  initialDelay: number = 1000
): Promise<EvaluationDetailsResult> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`🔄 Intento ${attempt} de ${retries} para fetchAIValidationForIdea`);

    try {
      console.log('🌐 Enviando solicitud a la API:', endpoint);
      const response = await fetch(`${endpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                { text: userPrompt },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en la respuesta de la API:', { status: response.status, errorText });
        if (response.status === 429 && attempt < retries) {
          const delay = initialDelay * Math.pow(2, attempt - 1); // Backoff exponencial
          console.log(`⏳ Error 429: Esperando ${delay}ms antes de reintentar...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new Error(`La solicitud a la API falló con el estado ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta de la API recibida:', JSON.stringify(data, null, 2));

      const aiResponse = data.candidates[0].content.parts[0].text.trim();
      console.log('📄 Respuesta cruda de la IA:', aiResponse);

      const cleanJsonResponse = (text: string): string => {
        return text.replace(/^```json\s*|```$/g, '').trim();
      };

      try {
        const cleanedResponse = cleanJsonResponse(aiResponse);
        console.log('🧹 Respuesta limpia:', cleanedResponse);
        const parsed = JSON.parse(cleanedResponse);
        console.log('🎯 Respuesta parseada:', parsed);

        // Validar que la respuesta tenga todos los campos esperados
        if (
          typeof parsed.successProbability !== 'number' ||
          !['Low', 'Medium', 'High'].includes(parsed.riskLevel) ||
          typeof parsed.expectedROI !== 'string' ||
          typeof parsed.innovationScore !== 'number' ||
          typeof parsed.marketPotential !== 'number' ||
          typeof parsed.executionComplexity !== 'number'
        ) {
          console.error('❌ Error: Formato de respuesta inválido', parsed);
          throw new Error('La respuesta de la IA no contiene los campos esperados.');
        }

        return {
          successProbability: parsed.successProbability,
          riskLevel: parsed.riskLevel,
          expectedROI: parsed.expectedROI,
          innovationScore: parsed.innovationScore,
          marketPotential: parsed.marketPotential,
          executionComplexity: parsed.executionComplexity,
        };
      } catch (parseError) {
        console.error('❌ Error al parsear la respuesta de la IA:', parseError, { aiResponse });
        throw new Error('La respuesta de la IA no está en el formato JSON esperado.');
      }
    } catch (error) {
      console.error('❌ Error en fetchAIValidationForIdea (intento ${attempt}):', error);
      if (attempt === retries) {
        throw new Error('No se pudo obtener la validación de la idea tras múltiples intentos: ' + (error instanceof Error ? error.message : 'Error desconocido'));
      }
    }
  }
  throw new Error('No se pudo obtener la validación de la idea tras múltiples intentos.');
};
