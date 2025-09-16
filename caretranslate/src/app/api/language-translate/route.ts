// src/app/api/language-translate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/googleTranslate';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage } = await request.json();
    
    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    const result = await translateText(text, targetLanguage, sourceLanguage);
    
    return NextResponse.json({ 
      success: true, 
      ...result,
      originalText: text,
      targetLanguage,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Language translation error:', error);
    return NextResponse.json(
      { error: error.message || 'Language translation failed' },
      { status: 500 }
    );
  }
}