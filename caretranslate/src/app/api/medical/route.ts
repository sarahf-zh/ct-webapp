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
    
    // Default error message
    let errorMessage = 'Medical translation failed';

    // Check if it's an Error object
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage }, // Use the safe error message
      { status: 500 }
    );
  }
}