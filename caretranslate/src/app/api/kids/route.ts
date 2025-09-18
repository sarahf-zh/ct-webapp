// src/app/api/kids/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateKidsTranslation } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { prompt, childAge } = await request.json();
    
    if (!prompt || !childAge) {
      return NextResponse.json(
        { error: 'Prompt and child age are required' },
        { status: 400 }
      );
    }

    const result = await generateKidsTranslation(prompt, {
      childAge
    });
    
    return NextResponse.json({ 
      success: true, 
      result,
      childAge,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Kids translation error:', error);
    
    // Default error message
    let errorMessage = 'Kids translation failed';

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