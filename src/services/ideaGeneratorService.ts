
import { AI_CONFIG, isApiConfigured } from './aiConfig';

/**
 * Generates a business idea based on a prompt using configured AI provider
 * 
 * @param prompt - The user input describing the kind of idea they want
 * @returns A promise that resolves to the generated idea text
 */
export const generateIdea = async (prompt: string): Promise<string> => {
  const endpoint = import.meta.env.VITE_AI_ENDPOINT;
  const apiKey = import.meta.env.VITE_AI_API_KEY;
  const model = import.meta.env.VITE_AI_MODEL;

  const systemPrompt = "Eres un generador creativo de ideas de negocio. Cuando se te proporciona un prompt, genera una idea de negocio detallada, innovadora y práctica. Incluye un nombre llamativo, descripción, mercado objetivo, posibles fuentes de ingresos y pasos iniciales para comenzar. Sé específico, creativo y enfócate en ideas accionables.";

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
              { text: prompt }
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
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Error al generar la idea:', error);
    throw new Error('No se pudo generar la idea. Por favor, inténtalo de nuevo.');
  }
};

// Mock function to simulate AI response during development
// const mockGenerateIdea = async (prompt: string): Promise<string> => {
//   // Simulate network delay
//   await new Promise(resolve => setTimeout(resolve, 1500));
  
//   // Generate a pseudo-random number for variety in responses
//   const randomSeed = Math.floor(Math.random() * 3);
  
//   // Some example templates based on the prompt
//   const templates = [
//     `# EcoHarvest

// **Business Concept**: A subscription service that delivers DIY indoor gardening kits that are seasonal, themed, and designed for small spaces.

// **Target Market**: Urban dwellers, busy professionals, and sustainable lifestyle enthusiasts who want to grow their own food but lack space or knowledge.

// **Value Proposition**: 
// - Each month subscribers receive all materials needed to grow herbs, vegetables, or edible flowers
// - Smart monitoring system connects to an app that guides users through the growing process
// - Community feature allows users to share progress and tips

// **Revenue Streams**:
// - Monthly subscription packages (Basic: $29.99, Premium: $49.99)
// - Add-on specialty seeds and equipment
// - Mobile app premium features ($4.99/month)

// **First Steps to Launch**:
// 1. Develop prototype kits for 3 difficulty levels
// 2. Create basic version of the companion app
// 3. Launch beta test with 100 subscribers
// 4. Establish partnerships with local seed suppliers
// 5. Develop marketing campaign focusing on sustainability and wellness`,

//     `# TechTrader

// **Business Concept**: An AI-powered platform that helps consumers trade in their used tech devices at optimal times before value depreciation.

// **Target Market**: Tech-savvy consumers who frequently upgrade devices, small businesses managing tech assets, and environmentally conscious users.

// **Value Proposition**:
// - Predictive algorithm tells users the optimal time to sell their device
// - Instant price quotes with guaranteed lock-in periods
// - Seamless home pickup or mail-in service
// - Certified data wiping included

// **Revenue Streams**:
// - Commission on each successful trade (8-12%)
// - Premium membership ($7.99/month) for priority service and extended price guarantees
// - B2B services for small business fleet management
// - Refurbished device resale marketplace

// **First Steps to Launch**:
// 1. Develop pricing algorithm using historical pricing data
// 2. Create mobile app with device scanning capabilities
// 3. Establish logistics partnerships for device collection
// 4. Set up refurbishing operation or partner with existing one
// 5. Launch marketing campaign targeting early tech adopters`,

//     `# MealMemory

// **Business Concept**: An app that uses AI to document and recreate family recipes by analyzing photos and videos of home cooking.

// **Target Market**: Food enthusiasts, families wanting to preserve heritage recipes, and amateur cooks looking to improve their skills.

// **Value Proposition**:
// - Users can record videos of family members cooking
// - AI analyzes the footage to extract precise ingredients, measurements, and steps
// - Creates beautifully formatted, shareable digital cookbooks
// - Suggests modifications for dietary restrictions or available ingredients

// **Revenue Streams**:
// - Freemium model with basic features free, premium at $5.99/month
// - Physical printed cookbook creation ($39.99 per book)
// - Ingredient delivery partnerships with local grocers
// - Cooking equipment affiliate program

// **First Steps to Launch**:
// 1. Develop core AI algorithm for recipe extraction
// 2. Create intuitive mobile app interface
// 3. Beta test with 50 diverse family recipes
// 4. Establish printing partnership for physical cookbooks
// 5. Launch social features for recipe sharing and community building`
//   ];
  
//   // Return a template based on the random seed
//   // In a real implementation, this would be generated by the AI model based on the prompt
//   return templates[randomSeed];
// };
