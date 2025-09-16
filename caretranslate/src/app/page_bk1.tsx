'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  BookOpen, 
  Globe, 
  Baby, 
  Home, 
  Save,
  Trash2,
  Search,
  User
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useDictionary } from '@/hooks/useDictionary';
import { commonMedicalLanguages } from '@/lib/googleTranslate';

// ✅ Memoized input components at module level
const MemoizedTextarea = memo(({ 
  value, 
  onChange, 
  placeholder, 
  rows = 3,
  className 
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  className: string;
}) => (
  <textarea
    className={className}
    rows={rows}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
));

const MemoizedSelect = memo(({ 
  value, 
  onChange, 
  children,
  className 
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className: string;
}) => (
  <select 
    className={className}
    value={value}
    onChange={onChange}
  >
    {children}
  </select>
));

const MemoizedInput = memo(({ 
  value, 
  onChange, 
  placeholder,
  className,
  type = "text"
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className: string;
  type?: string;
}) => (
  <input
    type={type}
    className={className}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
));

// ✅ Updated ModeCard component to match the design
const ModeCard = ({ mode, icon: Icon, title, description, isActive, onClick }: {
  mode: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div 
    className={`p-6 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
      isActive 
        ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
        : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
    }`}
    onClick={onClick}
  >
    <div className="flex flex-col items-center text-center space-y-3">
      <div className={`p-3 rounded-lg ${
        isActive ? 'bg-white bg-opacity-20' : 'bg-blue-50'
      }`}>
        <Icon className={`w-8 h-8 ${isActive ? 'text-white' : 'text-blue-600'}`} />
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className={`text-sm leading-relaxed ${isActive ? 'text-blue-100' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </div>
  </div>
);

// ✅ Updated HomeView component
const HomeView = ({
  activeMode,
  setActiveMode,
  culturalBackground,
  handleCulturalBackgroundChange,
  childAge,
  handleChildAgeChange,
  input,
  handleInputChange,
  placeholder,
  isListening,
  toggleVoiceRecording,
  complexityLevel,
  handleComplexityChange,
  handleSubmit,
  isLoading,
  result,
  handleSaveToDictionary,
  error
}: {
  activeMode: string;
  setActiveMode: (mode: string) => void;
  culturalBackground: string;
  handleCulturalBackgroundChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  childAge: string;
  handleChildAgeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  isListening: boolean;
  toggleVoiceRecording: () => void;
  complexityLevel: number;
  handleComplexityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  isLoading: boolean;
  result: string;
  handleSaveToDictionary: () => void;
  error: string | null;
}) => (
  <div className="space-y-6">
    {/* Mode Selection */}
    <div className="grid md:grid-cols-3 gap-4">
      <ModeCard
        mode="medical"
        icon={BookOpen}
        title="Medical Terms"
        description="Translate medical jargon into plain English"
        isActive={activeMode === 'medical'}
        onClick={() => setActiveMode('medical')}
      />
      <ModeCard
        mode="cultural"
        icon={Globe}
        title="Cultural Bridge"
        description="Navigate cultural differences in healthcare"
        isActive={activeMode === 'cultural'}
        onClick={() => setActiveMode('cultural')}
      />
      <ModeCard
        mode="kids"
        icon={Baby}
        title="Kids Explanation"
        description="Make medical info child-friendly"
        isActive={activeMode === 'kids'}
        onClick={() => setActiveMode('kids')}
      />
    </div>

    {/* Input Section */}
    <div className="space-y-4">
      {activeMode === 'cultural' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your cultural background:
          </label>
          <MemoizedSelect
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            value={culturalBackground}
            onChange={handleCulturalBackgroundChange}
          >
            <option value="">Select your background</option>
            <option value="East Asian">East Asian (Chinese, Japanese, Korean)</option>
            <option value="South Asian">South Asian (Indian, Pakistani, Bangladeshi)</option>
            <option value="Middle Eastern">Middle Eastern (Arab, Persian, Turkish)</option>
            <option value="African">African (Various traditions)</option>
            <option value="Latin American">Latin American (Hispanic/Latino)</option>
            <option value="Indigenous">Indigenous (Native American, Aboriginal)</option>
          </MemoizedSelect>
        </div>
      )}

      {activeMode === 'kids' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Child's age:
          </label>
          <MemoizedSelect
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            value={childAge}
            onChange={handleChildAgeChange}
          >
            <option value="">Select age range</option>
            <option value="3-5">3-5 years</option>
            <option value="6-8">6-8 years</option>
            <option value="9-12">9-12 years</option>
            <option value="13-16">13-16 years</option>
          </MemoizedSelect>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {activeMode === 'medical' ? 'Medical term or description:' :
           activeMode === 'cultural' ? 'Your health concern:' :
           'Medical procedure or condition:'}
        </label>
        <div className="relative">
          <MemoizedTextarea
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white"
            rows={4}
            placeholder={placeholder}
            value={input}
            onChange={handleInputChange}
          />
          <button
            className={`absolute right-3 top-3 p-1 rounded-full transition-colors ${
              isListening ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            onClick={toggleVoiceRecording}
            type="button"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {activeMode === 'medical' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Explanation complexity: {complexityLevel}/5
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={complexityLevel}
            onChange={handleComplexityChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Very Simple</span>
            <span>Very Detailed</span>
          </div>
        </div>
      )}

      <button
        className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-500 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <span>
            {activeMode === 'medical' ? 'Translate to Plain English' :
             activeMode === 'cultural' ? 'Get Cultural Context' :
             'Create Kid-Friendly Explanation'}
          </span>
        )}
      </button>
    </div>

    {/* Result Section */}
    {result && (
      <div className="bg-white rounded-lg p-6 border border-gray-200 mb-20">
        <div className="whitespace-pre-line text-gray-800 leading-relaxed">
          {result}
        </div>
        <div className="mt-4 flex space-x-2">
          {activeMode === 'medical' && (
            <button 
              onClick={handleSaveToDictionary}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center space-x-1 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save to Dictionary</span>
            </button>
          )}
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm hover:bg-gray-50 border border-gray-300 transition-colors">
            Share
          </button>
        </div>
      </div>
    )}

    {error && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 mb-20">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )}
  </div>
);

// ✅ Updated DictionaryView component
const DictionaryView = ({
  searchQuery,
  handleSearchQueryChange,
  dictionary,
  searchDictionary,
  removeFromDictionary
}: {
  searchQuery: string;
  handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dictionary: any[];
  searchDictionary: (query: string) => any[];
  removeFromDictionary: (id: string) => void;
}) => {
  const filteredDictionary = searchQuery ? searchDictionary(searchQuery) : dictionary;
  
  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <BookOpen className="w-6 h-6" />
          <span>Your Personal Medical Dictionary</span>
        </h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <MemoizedInput
            type="text"
            placeholder="Search your dictionary..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </div>

        <div className="space-y-4">
          {filteredDictionary.length > 0 ? (
            filteredDictionary.map((item) => (
              <div key={item.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{item.term}</h3>
                    <p className="text-gray-600 mt-1 leading-relaxed">{item.translation}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Saved {item.saved}</span>
                      {item.complexity && <span>Complexity: {item.complexity}/5</span>}
                      <span className="capitalize">{item.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromDictionary(item.id)}
                    className="ml-4 p-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8 italic">
              {searchQuery ? 'No matching terms found.' : 'No saved terms yet. Start translating medical terms to build your dictionary!'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ✅ Updated TranslateView component
const TranslateView = ({
  targetLanguage,
  handleTargetLanguageChange,
  input,
  handleInputChange,
  handleLanguageTranslate,
  isLoading,
  result,
  error
}: {
  targetLanguage: string;
  handleTargetLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleLanguageTranslate: () => void;
  isLoading: boolean;
  result: string;
  error: string | null;
}) => (
  <div className="space-y-6 pb-20">
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
        <Globe className="w-6 h-6" />
        <span>Real-time Medical Translation</span>
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Translate to:
          </label>
          <MemoizedSelect
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            value={targetLanguage}
            onChange={handleTargetLanguageChange}
          >
            {commonMedicalLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </MemoizedSelect>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medical text to translate:
          </label>
          <MemoizedTextarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white"
            rows={4}
            placeholder="e.g., Take this medication twice daily with food, You need to come back for a follow-up in two weeks"
            value={input}
            onChange={handleInputChange}
          />
        </div>

        <button
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          onClick={handleLanguageTranslate}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Globe className="w-4 h-4" />
              <span>Translate Medical Text</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-green-50 rounded-lg p-6 border border-green-200 mt-6">
          <h3 className="font-semibold text-green-800 mb-3">Translation Result:</h3>
          <div className="whitespace-pre-line text-gray-800 leading-relaxed">
            {result}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  </div>
);

// ✅ Main CareTranslateApp component with updated design
export default function CareTranslateApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeMode, setActiveMode] = useState('medical');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [complexityLevel, setComplexityLevel] = useState(3);
  const [culturalBackground, setCulturalBackground] = useState('');
  const [childAge, setChildAge] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [searchQuery, setSearchQuery] = useState('');

  const { 
    translateMedical, 
    translateCultural, 
    translateKids, 
    translateLanguage, 
    isLoading, 
    error 
  } = useTranslation();

  const { 
    dictionary, 
    saveToDictionary, 
    removeFromDictionary, 
    searchDictionary 
  } = useDictionary();

  // Stable event handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const handleCulturalBackgroundChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCulturalBackground(e.target.value);
  }, []);

  const handleChildAgeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setChildAge(e.target.value);
  }, []);

  const handleComplexityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComplexityLevel(Number(e.target.value));
  }, []);

  const handleTargetLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetLanguage(e.target.value);
  }, []);

  const handleSearchQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    try {
      let response = '';
      
      if (activeMode === 'medical') {
        response = await translateMedical(input, { complexityLevel });
      } else if (activeMode === 'cultural') {
        if (!culturalBackground) {
          setResult('Please select your cultural background first.');
          return;
        }
        response = await translateCultural(input, { culturalBackground });
      } else if (activeMode === 'kids') {
        if (!childAge) {
          setResult('Please select the child\'s age first.');
          return;
        }
        response = await translateKids(input, { childAge });
      }
      
      setResult(response);
    } catch (err) {
      console.error('Translation error:', err);
      setResult('Sorry, translation failed. Please try again.');
    }
  };

  const handleLanguageTranslate = async () => {
    if (!input.trim()) return;
    
    try {
      const response = await translateLanguage(input, { targetLanguage });
      setResult(`Original: ${input}\n\nTranslated: ${response.translatedText}\n\nDetected source language: ${response.detectedSourceLanguage || 'Unknown'}`);
    } catch (err) {
      console.error('Language translation error:', err);
      setResult('Sorry, translation failed. Please try again.');
    }
  };

  const handleSaveToDictionary = () => {
    if (input && result && activeMode === 'medical') {
      saveToDictionary(
        input,
        result.split('\n')[0] || result.substring(0, 100) + '...',
        'medical',
        complexityLevel
      );
      alert('Saved to your personal dictionary!');
    }
  };

  const toggleVoiceRecording = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      if (!isListening) {
        recognition.start();
      } else {
        recognition.stop();
      }
    } else {
      alert('Speech recognition not supported in this browser');
    }
    setIsListening(!isListening);
  }, [isListening]);

  // Stable placeholder values
  const placeholders = useMemo(() => ({
    medical: 'e.g., Myocardial infarction, Hypertension, Diabetes',
    cultural: 'Describe your symptoms or questions...',
    kids: 'e.g., Getting a vaccine shot'
  }), []);

  const placeholder = placeholders[activeMode as keyof typeof placeholders] || placeholders.medical;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">
              Translating Care
            </h1>
            <p className="text-gray-600 text-base">Breaking down healthcare communication barriers</p>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex space-x-0">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'dictionary', icon: BookOpen, label: 'Dictionary' },
              { id: 'translate', icon: Globe, label: 'Translate' }
            ].map((item) => (
              <button
                key={item.id}
                className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === item.id 
                    ? 'border-blue-600 text-blue-600 bg-blue-50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {activeTab === 'home' && (
          <HomeView
            activeMode={activeMode}
            setActiveMode={setActiveMode}
            culturalBackground={culturalBackground}
            handleCulturalBackgroundChange={handleCulturalBackgroundChange}
            childAge={childAge}
            handleChildAgeChange={handleChildAgeChange}
            input={input}
            handleInputChange={handleInputChange}
            placeholder={placeholder}
            isListening={isListening}
            toggleVoiceRecording={toggleVoiceRecording}
            complexityLevel={complexityLevel}
            handleComplexityChange={handleComplexityChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            result={result}
            handleSaveToDictionary={handleSaveToDictionary}
            error={error}
          />
        )}
        {activeTab === 'dictionary' && (
          <DictionaryView
            searchQuery={searchQuery}
            handleSearchQueryChange={handleSearchQueryChange}
            dictionary={dictionary}
            searchDictionary={searchDictionary}
            removeFromDictionary={removeFromDictionary}
          />
        )}
        {activeTab === 'translate' && (
          <TranslateView
            targetLanguage={targetLanguage}
            handleTargetLanguageChange={handleTargetLanguageChange}
            input={input}
            handleInputChange={handleInputChange}
            handleLanguageTranslate={handleLanguageTranslate}
            isLoading={isLoading}
            result={result}
            error={error}
          />
        )}
      </main>
    </div>
  );
}