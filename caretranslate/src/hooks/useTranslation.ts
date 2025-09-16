// src/hooks/useTranslation.ts
'use client';
import { useState, useEffect } from 'react';

export interface MedicalTranslationOptions {
  complexityLevel: number;
}

export interface CulturalTranslationOptions {
  culturalBackground: string;
}

export interface KidsTranslationOptions {
  childAge: string;
}

export interface LanguageTranslationOptions {
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface DictionaryEntry {
  id: string;
  term: string;
  translation: string;
  category: string;
  saved: string;
  complexity?: number;
}

export const useTranslation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateMedical = async (
    prompt: string, 
    options: MedicalTranslationOptions
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/medical', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, ...options })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.result;
      
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const translateCultural = async (
    prompt: string,
    options: CulturalTranslationOptions
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cultural', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, ...options })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.result;
      
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const translateKids = async (
    prompt: string,
    options: KidsTranslationOptions
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/kids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, ...options })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.result;
      
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const translateLanguage = async (
    text: string,
    options: LanguageTranslationOptions
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/language-translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, ...options })
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return {
        translatedText: data.translatedText,
        detectedSourceLanguage: data.detectedSourceLanguage,
        confidence: data.confidence
      };
      
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    translateMedical,
    translateCultural, 
    translateKids,
    translateLanguage,
    isLoading, 
    error 
  };
};

export const useDictionary = () => {
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load dictionary from localStorage on mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('caretranslate_dictionary');
      if (stored) {
        try {
          setDictionary(JSON.parse(stored));
        } catch (error) {
          console.error('Error loading dictionary:', error);
        }
      }
    }
  }, []);

  const saveToDictionary = (
    term: string,
    translation: string,
    category: string = 'medical',
    complexity?: number
  ) => {
    const newEntry: DictionaryEntry = {
      id: Date.now().toString(),
      term,
      translation,
      category,
      complexity,
      saved: new Date().toLocaleDateString()
    };

    const updatedDictionary = [newEntry, ...dictionary];
    setDictionary(updatedDictionary);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('caretranslate_dictionary', JSON.stringify(updatedDictionary));
    }
  };

  const removeFromDictionary = (id: string) => {
    const updatedDictionary = dictionary.filter(entry => entry.id !== id);
    setDictionary(updatedDictionary);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('caretranslate_dictionary', JSON.stringify(updatedDictionary));
    }
  };

  const searchDictionary = (query: string) => {
    return dictionary.filter(entry => 
      entry.term.toLowerCase().includes(query.toLowerCase()) ||
      entry.translation.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    dictionary,
    saveToDictionary,
    removeFromDictionary,
    searchDictionary,
    isLoading
  };
};