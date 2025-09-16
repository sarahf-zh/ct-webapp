// src/app/api/cultural/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateCulturalTranslation } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { prompt, culturalBackground } = await request.json();
    
    if (!prompt || !culturalBackground) {
      return NextResponse.json(
        { error: 'Prompt and cultural background are required' },
        { status: 400 }
      );
    }

    const result = await generateCulturalTranslation(prompt, {
      culturalBackground
    });
    
    return NextResponse.json({ 
      success: true, 
      result,
      culturalBackground,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Cultural translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Cultural translation failed' },
      { status: 500 }
    );
  }
}