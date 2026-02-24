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
    Ensure your respponse adapts to a complexity level: ${options.complexityLevel}/5 (1=very simple, 5=very detailed).  
    
    INSTRUCTION: 
    Be encouraging and reduce medical anxiety while being accurate. 
    Your response needs to strictly follow the requirements below:
      
    **Simplified Term**
    The simplified term or phrase
    

    **Everyday Language Explanation**
    Clear explanation in everyday language
    

    **Helpful Analogy**
    Give an analogy that is helpful to grasp the explanation

    **What You Should Know**
    What the patient should know (symptoms, treatment options, next steps)
    

    **When to Seek Medical Attention**
    When to seek medical attention
    

    STYLING: 
    Format your response with bullets when appropriate. Always use the asterisk (*) to start bullets.
    Use Markdown bolding for headers. No introductory "AI chatter" or concluding remarks. Start immediately with the first header.`;
    

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-lite-latest',
      systemInstruction: systemPrompt,
      generationConfig: {
        // Set a token limit (e.g., 500 tokens is ~375 words)
        maxOutputTokens: 750,
        temperature: 0.4
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
    
    // UPDATED: High-density, constraint-focused system prompt
    const systemPrompt = `You are a cross-cultural healthcare specialist for ${options.culturalBackground} culture.
    
    CONTEXT DATA:
    - Concepts: ${culturalContext.healthConcepts.join(', ')}
    - Family: ${culturalContext.familyDynamics}
    - Style: ${culturalContext.communicationStyle}
    - Practices: ${culturalContext.traditionalPractices.join(', ')}
    - Barriers: ${culturalContext.commonBarriers}

    INSTRUCTION: 
    Help a user navitage a given health topic using a cultural-aware lens. Use a respectufl and understanding tone.
    Be specific to ${options.culturalBackground} culture - use actual cultural terms, reference real practices, and provide concrete examples.
    
    To ensure the full response fits, your response needs to follow these length constraints strictly:
   
    **Cultural Understanding** 
    (3 sentences) How is this health topic traditionally viewed in ${options.culturalBackground} culture? Reference specific cultural health concepts.

    **Family Integration** 
    (3-4 sentences) How to navigate ${options.culturalBackground} family dynamics and decision-making processes in healthcare settings.

    **Traditional + Modern Integration** 
    (3-4 sentences) How to respectfully discuss ${options.culturalBackground} traditional practices alongside modern medical treatment.

    **Cultural Advocacy** 
    (3-4 sentences) Specific ways to advocate for culturally appropriate care while respecting medical expertise.

    **Common Misunderstandings** 
    (3 sentences) Address typical misunderstandings between ${options.culturalBackground} patients and Western providers.

    
    STYLING: 
    Format your response with bullets when appropriate. Always use the asterisk (*) to start bullets.
    Use Markdown bolding for headers. No introductory "AI chatter" or concluding remarks. Start immediately with the first header`;


    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-lite-latest',
      systemInstruction: systemPrompt,
      generationConfig: {
        // Set a token limit (e.g., 500 tokens is ~375 words)
        maxOutputTokens: 750,
        temperature: 0.4
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

    const systemPrompt = `You are a pediatric communication specialist for children aged ${options.childAge} years.

    INSTRUCTION: provide an age-approporate response explaining medical concepts, applying a friendly and reassuring 
    tone, using emojis and simple analogies. Use shorter sentences for age 8 and lower.

    Your response needs to strictly follow the requirements below:
    
    **Feeling About This Word**
    Acknowledge feelings about the topic.

    **What It Is**
    Explain using a toy or game analogy.

    **Why It Happens**
    Explain the cause simply.

    **What To Expect**
    Describe what they will see, hear, or feel.

    **How Helpers Help**
    Explain what the doctors and nurses are doing.

    **You Are Brave**
    Validation and a high-five.

    **Questions Are Okay**
    An invitation to ask more.

    STYLING: Use Markdown bolding for headers. 
    No introductory "AI chatter" or concluding remarks. Start immediately with the first header.`;

    

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-flash-lite-latest',
      systemInstruction: systemPrompt,
      generationConfig: {
        // Set a token limit (e.g., 500 tokens is ~375 words)
        maxOutputTokens: 600,
        temperature: 0.4
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