// src/hooks/useDictionary.ts
'use client';
import { useState, useEffect } from 'react';

export interface DictionaryEntry {
  id: string;
  term: string;
  translation: string;
  category: string;
  saved: string;
  complexity?: number;
}

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
          // Initialize with empty array if parsing fails
          setDictionary([]);
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
      term: term.trim(),
      translation: translation.trim(),
      category,
      complexity,
      saved: new Date().toLocaleDateString()
    };

    const updatedDictionary = [newEntry, ...dictionary];
    setDictionary(updatedDictionary);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('caretranslate_dictionary', JSON.stringify(updatedDictionary));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  };

  const removeFromDictionary = (id: string) => {
    const updatedDictionary = dictionary.filter(entry => entry.id !== id);
    setDictionary(updatedDictionary);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('caretranslate_dictionary', JSON.stringify(updatedDictionary));
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    }
  };

  const searchDictionary = (query: string): DictionaryEntry[] => {
    if (!query.trim()) {
      return dictionary;
    }
    
    const searchTerm = query.toLowerCase().trim();
    return dictionary.filter(entry => 
      entry.term.toLowerCase().includes(searchTerm) ||
      entry.translation.toLowerCase().includes(searchTerm) ||
      entry.category.toLowerCase().includes(searchTerm)
    );
  };

  const clearDictionary = () => {
    setDictionary([]);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('caretranslate_dictionary');
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    }
  };

  const exportDictionary = (): string => {
    try {
      return JSON.stringify(dictionary, null, 2);
    } catch (error) {
      console.error('Error exporting dictionary:', error);
      return '';
    }
  };

  const importDictionary = (jsonData: string): boolean => {
    try {
      const importedData = JSON.parse(jsonData);
      if (Array.isArray(importedData)) {
        // Validate that each entry has required fields
        const validEntries = importedData.filter(entry => 
          entry && 
          typeof entry.id === 'string' && 
          typeof entry.term === 'string' && 
          typeof entry.translation === 'string'
        );
        
        setDictionary(validEntries);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('caretranslate_dictionary', JSON.stringify(validEntries));
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing dictionary:', error);
      return false;
    }
  };

  const getDictionaryStats = () => {
    return {
      totalEntries: dictionary.length,
      categories: [...new Set(dictionary.map(entry => entry.category))],
      averageComplexity: dictionary
        .filter(entry => entry.complexity)
        .reduce((sum, entry) => sum + (entry.complexity || 0), 0) / 
        dictionary.filter(entry => entry.complexity).length || 0,
      recentEntries: dictionary
        .filter(entry => {
          const entryDate = new Date(entry.saved);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return entryDate > weekAgo;
        }).length
    };
  };

  return {
    dictionary,
    saveToDictionary,
    removeFromDictionary,
    searchDictionary,
    clearDictionary,
    exportDictionary,
    importDictionary,
    getDictionaryStats,
    isLoading
  };
};