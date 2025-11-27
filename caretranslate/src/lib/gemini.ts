// src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export interface MedicalTranslationOptions {
  complexityLevel: number;
}

export interface CulturalTranslationOptions {
  culturalBackground: string;
}

export interface KidsTranslationOptions {
  childAge: string;
}

// Cultural knowledge base for more specific prompts
const culturalContexts: Record<string, any> = {
  'East Asian': {
    healthConcepts: ['qi/chi energy', 'yin-yang balance', 'hot-cold food theory', 'meridian system'],
    familyDynamics: 'hierarchical family decision-making, elder consultation important',
    communicationStyle: 'indirect, respectful questioning, face-saving important',
    traditionalPractices: ['Traditional Chinese Medicine (TCM)', 'acupuncture', 'herbal medicine', 'cupping'],
    commonBarriers: 'language barriers, hesitation to question authority, shame about mental health'
  },
  'South Asian': {
    healthConcepts: ['Ayurvedic doshas (vata, pitta, kapha)', 'karma and health', 'mind-body-spirit connection'],
    familyDynamics: 'joint family decisions, gender roles in health decisions, elder respect',
    communicationStyle: 'relationship-building first, detailed explanations valued',
    traditionalPractices: ['Ayurveda', 'yoga therapy', 'meditation', 'dietary restrictions', 'oil treatments'],
    commonBarriers: 'stigma around mental health, gender-specific health discussions'
  },
  'Middle Eastern': {
    healthConcepts: ['Islamic medicine principles', 'body as sacred trust', 'balance of physical/spiritual'],
    familyDynamics: 'family honor considerations, gender-appropriate care important',
    communicationStyle: 'respectful but thorough, religious considerations important',
    traditionalPractices: ['Islamic medicine', 'black seed (nigella)', 'honey therapy', 'hijama (cupping)', 'olive oil'],
    commonBarriers: 'modesty concerns, Ramadan fasting considerations, halal requirements'
  },
  'African': {
    healthConcepts: ['ubuntu (interconnectedness)', 'spiritual causes of illness', 'community healing'],
    familyDynamics: 'extended family involvement, elder wisdom, community support',
    communicationStyle: 'storytelling, metaphors, respect for age and experience',
    traditionalPractices: ['traditional healing', 'plant medicine', 'spiritual cleansing', 'community rituals'],
    commonBarriers: 'historical medical mistrust, spiritual vs medical explanations'
  },
  'Latin American': {
    healthConcepts: ['susto (soul loss)', 'hot-cold illness theory', 'mal de ojo (evil eye)', 'family illness'],
    familyDynamics: 'strong family support system, maternal health authority, machismo considerations',
    communicationStyle: 'personalismo (personal relationships), respeto (respect), family involvement',
    traditionalPractices: ['curanderismo', 'sobadoras (massage healers)', 'herbal remedies', 'religious healing'],
    commonBarriers: 'undocumented status fears, language barriers, folk illness vs medical diagnosis'
  },
  'Indigenous': {
    healthConcepts: ['sacred circle of life', 'four directions health model', 'connection to nature'],
    familyDynamics: 'tribal decision-making, elder guidance, generational healing',
    communicationStyle: 'circular communication, silence respected, storytelling important',
    traditionalPractices: ['traditional plant medicine', 'smudging ceremonies', 'healing circles', 'seasonal ceremonies'],
    commonBarriers: 'historical trauma, distrust of Western medicine, sacred vs secular healing'
  }
};

export const generateMedicalTranslation = async (
  prompt: string,
  options: MedicalTranslationOptions
): Promise<string> => {
  try {

    const systemPrompt = `You are a medical translator that converts complex medical terminology into plain English. 
    Complexity level: ${options.complexityLevel}/5 (1=very simple, 5=very detailed).
    
    Always provide:
    1. The simplified term or phrase
    2. Clear explanation in everyday language
    3. An analogy when helpful
    4. What the patient should know (symptoms, treatment options, next steps)
    5. When to seek medical attention
    
    Format your response with clear headings and bullet points when appropriate.
    Be encouraging and reduce medical anxiety while being accurate.`;
    
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-lite-latest',
      systemInstruction: systemPrompt,
      generationConfig: {
        // Set a token limit (e.g., 500 tokens is ~375 words)
        maxOutputTokens: 600
      }
    });
    const result = await model.generateContent(prompt);

    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate medical translation');
  }
};

export const generateCulturalTranslation = async (
  prompt: string,
  options: CulturalTranslationOptions
): Promise<string> => {
  try {    
    const culturalContext = culturalContexts[options.culturalBackground];
    
    if (!culturalContext) {
      throw new Error('Cultural background not supported');
    }
    
    const systemPrompt = `You are an expert cross-cultural healthcare communication specialist with deep knowledge of ${options.culturalBackground} culture, traditions, and healthcare practices.

CULTURAL BACKGROUND: ${options.culturalBackground}
HEALTH CONCEPTS: ${culturalContext.healthConcepts.join(', ')}
FAMILY DYNAMICS: ${culturalContext.familyDynamics}
COMMUNICATION STYLE: ${culturalContext.communicationStyle}
TRADITIONAL PRACTICES: ${culturalContext.traditionalPractices.join(', ')}
COMMON BARRIERS: ${culturalContext.commonBarriers}

Please provide a comprehensive, culturally-specific response that includes:

1. **Cultural Understanding**: How is this health concern traditionally viewed in ${options.culturalBackground} culture? Reference specific cultural health concepts.

2. **Communication Bridge**: Specific phrases and approaches a ${options.culturalBackground} patient can use when speaking with Western healthcare providers.

3. **Family Integration**: How to navigate ${options.culturalBackground} family dynamics and decision-making processes in healthcare settings.

4. **Traditional + Modern Integration**: How to respectfully discuss ${options.culturalBackground} traditional practices alongside modern medical treatment.

5. **Cultural Advocacy**: Specific ways to advocate for culturally appropriate care while respecting medical expertise.

6. **Common Misunderstandings**: Address typical misunderstandings between ${options.culturalBackground} patients and Western providers.

Be specific to ${options.culturalBackground} culture - use actual cultural terms, reference real practices, and provide concrete examples.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-lite-latest',
      systemInstruction: systemPrompt,
      generationConfig: {
        // Set a token limit (e.g., 500 tokens is ~375 words)
        maxOutputTokens: 650
      }
    });
    const result = await model.generateContent(prompt);

    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Cultural Gemini API Error:', error);
    // Check the type of error
    if (error instanceof Error) {
      throw new Error(`Failed to generate culturally-aware response: ${error.message}`);
    }
    
    // Handle cases where error is not an Error object
    throw new Error(`Failed to generate culturally-aware response: Unknown error`);
  }
};

export const generateKidsTranslation = async (
  prompt: string,
  options: KidsTranslationOptions
): Promise<string> => {
  try {

    const systemPrompt = `You are a pediatric communication specialist explaining medical concepts to children aged ${options.childAge} years.

Use:
- Simple, friendly language appropriate for ${options.childAge} year olds
- Analogies children understand (toys, games, animals, everyday objects)
- Reassuring and positive tone
- Emojis when appropriate to make it fun
- Acknowledge their feelings and validate them
- Short sentences and simple words

Structure:
0. **Kids explanation**: Acknowledge this response is tailored for kids' understanding
1. **What it is**: Simple explanation using analogies
2. **Why it happens**: Age-appropriate reason
3. **What to expect**: What they might feel or see
4. **How helpers (doctors/nurses) help**: What the medical team does
5. **You're brave**: Encouragement and validation
6. **Questions are okay**: Encourage them to ask questions

Make it educational but not scary. Focus on the helpers (doctors, nurses) and how they keep people healthy and safe.`;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-lite-latest',
      systemInstruction: systemPrompt,
      generationConfig: {
        // Set a token limit (e.g., 500 tokens is ~375 words)
        maxOutputTokens: 600
      }
    });
    const result = await model.generateContent(prompt);

    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error('Kids Gemini API Error:', error);
    throw new Error('Failed to generate kid-friendly explanation');
  }
};