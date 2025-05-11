import { useState } from 'react';
import { AI_CONFIG, isApiConfigured } from '../services/aiConfig';
import { fetchAIInvestorAnalysisForIdea, InvestorAnalysisResult } from '../services/ideaEvaluator';

// Interfaz para el resultado del análisis de inversores
// Caché en memoria para resultados de análisis
const validationCache = new Map<string, InvestorAnalysisResult>();

// Hook para análisis de inversores
export const useInvestorAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InvestorAnalysisResult | null>(null);

  const analyzeIdea = async (ideaData: any) => {
    if (!ideaData?.id) {
      console.error('❌ useInvestorAnalysis: ID de idea inválido', { ideaData });
      setError('Datos de idea inválidos: se requiere ID para el caché.');
      return null;
    }

    // Verificar caché primero
    const cacheKey = ideaData.id;
    if (validationCache.has(cacheKey)) {
      console.log(`✅ Acierto de caché para ID de idea: ${cacheKey}`);
      const cachedResult = validationCache.get(cacheKey)!;
      setResult(cachedResult);
      return cachedResult;
    }

    console.log(`❌ Fallo de caché para ID de idea: ${cacheKey}, llamando a la API de IA...`);
    setIsLoading(true);
    setError(null);

    try {
      if (!isApiConfigured()) {
        console.error('❌ useInvestorAnalysis: API no configurada');
        throw new Error('API no configurada para análisis de inversores.');
      }

      console.log('🌟 Iniciando análisis de IA para idea:', ideaData.id);
      const endpoint = import.meta.env.VITE_AI_ENDPOINT;
      const apiKey = import.meta.env.VITE_AI_API_KEY;

      if (!endpoint || !apiKey) {
        console.error('❌ Error: Endpoint o clave de API no configurados', { endpoint, apiKey });
        throw new Error('El endpoint de IA o la clave de API no están configurados.');
      }

      if (!ideaData.title || !ideaData.description) {
        console.error('❌ Error: Datos de idea inválidos', { ideaData });
        throw new Error('Datos de idea inválidos: se requieren título y descripción.');
      }

      const systemPrompt = `Eres un evaluador experto de ideas de negocio para inversores. Analiza la siguiente propuesta desde la perspectiva de un inversor, considerando su viabilidad financiera, técnica y de mercado, así como la fortaleza del equipo y la ventaja competitiva. Proporciona una evaluación detallada en el siguiente formato JSON:

{
  "successProbability": number,
  "expectedROI": string,
  "riskLevel": "Low" | "Medium" | "High",
  "technicalFeasibility": "Low" | "Medium" | "High",
  "marketReadiness": string,
  "competitiveAdvantage": number,
  "teamAssessment": string
}

- successProbability: Probabilidad de éxito (0 a 1).
- expectedROI: Retorno esperado de la inversión (por ejemplo, "20-30%").
- riskLevel: Nivel de riesgo ("Low", "Medium", "High").
- technicalFeasibility: Viabilidad técnica ("Low", "Medium", "High").
- marketReadiness: Estado de preparación para el mercado (por ejemplo, "Ready for deployment", "Further validation needed").
- competitiveAdvantage: Ventaja competitiva (0 a 10).
- teamAssessment: Evaluación del equipo (por ejemplo, "Strong potential", "Needs strengthening").

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

      const analysisResult = await fetchAIInvestorAnalysisForIdea(endpoint, apiKey, systemPrompt, userPrompt);
      console.log('🎉 Resultado de análisis de IA:', analysisResult);

      validationCache.set(cacheKey, analysisResult);
      setResult(analysisResult);
      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido';
      console.error('❌ Error en useInvestorAnalysis:', errorMessage, { err });
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeIdea, isLoading, error, result };
};
