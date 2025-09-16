// src/app/api/medical/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateMedicalTranslation } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { prompt, complexityLevel } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const result = await generateMedicalTranslation(prompt, {
      complexityLevel: complexityLevel || 3
    });
    
    return NextResponse.json({ 
      success: true, 
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Medical translation error:', error);
    return NextResponse.json(
      { error: 'Medical translation failed' },
      { status: 500 }
    );
  }
}