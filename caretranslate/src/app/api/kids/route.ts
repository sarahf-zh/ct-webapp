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
    return NextResponse.json(
      { error: 'Kids translation failed' },
      { status: 500 }
    );
  }
}