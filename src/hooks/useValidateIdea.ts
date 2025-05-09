import { useState } from 'react';
import { AI_CONFIG, isApiConfigured } from '../services/aiConfig';
import { evaluateIdeaDetailsWithAI, EvaluationDetailsResult } from '../services/ideaEvaluator';

// Caché en memoria para resultados de validación
const validationCache = new Map<string, EvaluationDetailsResult>();

export interface IdeaValidationResult {
  successProbability: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  expectedROI: string;
  innovationScore: number;
  marketPotential: number;
  executionComplexity: number;
}

export const useValidateIdea = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IdeaValidationResult | null>(null);

  const validateIdea = async (ideaData: any) => {
    if (!ideaData?.id) {
      console.error('❌ useValidateIdea: ID de idea inválido', { ideaData });
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

    console.log(`❌ Fallo de caché para ID de idea: ${cacheKey}, llamando a evaluateIdeaDetailsWithAI...`);
    setIsLoading(true);
    setError(null);

    try {
      if (!isApiConfigured()) {
        console.error('❌ useValidateIdea: API no configurada');
        throw new Error('API no configurada para validación de IA.');
      }

      console.log('🌟 Iniciando evaluación de IA para idea:', ideaData.id);
      const validationResult = await evaluateIdeaDetailsWithAI(ideaData);
      console.log('🎉 Resultado de evaluación de IA:', validationResult);
      validationCache.set(cacheKey, validationResult); // Guardar en caché
      setResult(validationResult);
      return validationResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido';
      console.error('❌ Error en useValidateIdea:', errorMessage, { err });
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Renombramos fetchAndSetAIValidation para mantener consistencia
  const fetchAndSetAIValidation = validateIdea;

  return { validateIdea, fetchAndSetAIValidation, isLoading, error, result };
};
