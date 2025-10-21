'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  Mic,
  MicOff,
  Send,
  BookOpen,
  BookMarked,
  Globe,
  Globe2,
  Baby,
  Home,
  Save,
  Trash2,
  Search,
  User,
  X,
  CheckCircle,
  AlertTriangle,
  Users,
  MessageSquare,
  Lightbulb,
  HeartPulse,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useDictionary } from '@/hooks/useDictionary';
import { commonMedicalLanguages } from '@/lib/googleTranslate';

// Interface for Dictionary Item
interface DictionaryItem {
  id: string;
  term: string;
  explanation?: string; // Made optional for fallback
  translation?: string; // Added old field for fallback
  saved: string;
  complexity?: number;
  category: string;
}

const MemoizedTextarea = memo(
  ({
    value,
    onChange,
    placeholder,
    rows = 3,
    className,
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
  ),
);
MemoizedTextarea.displayName = 'MemoizedTextarea';

const MemoizedSelect = memo(
  ({
    value,
    onChange,
    children,
    className,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
    className: string;
  }) => (
    <select className={className} value={value} onChange={onChange}>
      {children}
    </select>
  ),
);
MemoizedSelect.displayName = 'MemoizedSelect';

const MemoizedInput = memo(
  ({
    value,
    onChange,
    placeholder,
    className,
    type = 'text',
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
  ),
);
MemoizedInput.displayName = 'MemoizedInput';

const ModeCard = ({
  mode,
  icon: Icon,
  title,
  description,
  isActive,
  onClick,
}: {
  mode: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div
    className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white transform scale-105 shadow-lg'
        : 'bg-white hover:bg-gray-50 border border-gray-200 hover:shadow-md'
    }`}
    onClick={onClick}
  >
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
        isActive ? 'bg-white bg-opacity-20' : 'bg-blue-100'
      }`}
    >
      <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-blue-600'}`} />
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className={`text-sm ${isActive ? 'text-blue-100' : 'text-gray-600'}`}>
      {description}
    </p>
  </div>
);

// NEW: Header icon mapping
const headerIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'simplified term': BookOpen,
  'everyday language explanation': MessageSquare,
  analogy: Lightbulb,
  'what you should know': CheckCircle,
  'when to seek medical attention': AlertTriangle,
  'cultural understanding': Globe2,
  'communication bridge': MessageSquare,
  'family integration': Users,
  'traditional + modern integration': HeartPulse,
  'cultural advocacy': Users,
  'common misunderstandings': Lightbulb,
};

// NEW: Component to render HTML result with icons
const HtmlResultRenderer = memo(
  ({ result, activeMode }: { result: string; activeMode: string }) => {
    // Only apply special formatting for medical and cultural modes
    if (activeMode !== 'medical' && activeMode !== 'cultural') {
      // Use original rendering for other modes (like kids)
      return (
        <div className="prose prose-sm max-w-none whitespace-pre-line text-gray-800">
          {result}
        </div>
      );
    }

    const lines = result.split('\n');

    return (
      <div className="space-y-2">
        {lines.map((line, index) => {
          // 1. Check for Headers
          // Clean line: remove markdown (**, ##) and trim
          const cleanedLine = line
            .replace(/^(##\s*|\*\*\s*)/, '')
            .replace(/\s*\*\*$/, '')
            .trim();

          // Find icon (case-insensitive, trim space, remove colon)
          const Icon =
            headerIcons[cleanedLine.toLowerCase().replace(/:$/, '').trim()];

          if (Icon) {
            return (
              <div key={index} className="flex items-start space-x-2 pt-4">
                <Icon
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  //style={{ marginTop: '0.125rem' }}
                />
                <h3 className="text-lg font-bold text-gray-900">
                  {cleanedLine}
                </h3>
              </div>
            );
          }

          // 2. Check for Empty Lines
          if (line.trim() === '') {
            return null;
          }

          // 3. Process Paragraphs/Bullets
          let processedLine = line;
          let isBullet = false;

          // Check for bullet
          if (processedLine.trim().startsWith('* ')) {
            isBullet = true;
            processedLine = processedLine.trim().substring(2).trim(); // Remove '* '
          } else {
            // Remove any other list-like markers if not a bullet
            processedLine = processedLine
              .replace(/^(##\s*|\*\*\s*)/, '')
              .replace(/\s*\*\*$/, '')
              .trim();
          }

          // Process **bold** and _italic_
          // Use dangerouslySetInnerHTML for this
          processedLine = processedLine
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<em>$1</em>');

          if (isBullet) {
            return (
              <div key={index} className="flex items-start space-x-2 ml-4">
                <span
                  className="text-blue-600 flex-shrink-0"
                  style={{ marginTop: '0.375rem' }}
                >
                  &bull;
                </span>
                <p
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: processedLine }}
                />
              </div>
            );
          }

          // 4. Render as regular paragraph
          return (
            <p
              key={index}
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: processedLine }}
            />
          );
        })}
      </div>
    );
  },
);
HtmlResultRenderer.displayName = 'HtmlResultRenderer';

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
  error,
}: {
  activeMode: string;
  setActiveMode: (mode: string) => void;
  culturalBackground: string;
  handleCulturalBackgroundChange: (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
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
  <>
    {/* Mode Selection */}
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <ModeCard
        mode="medical"
        icon={BookOpen}
        title="Medical Terms"
        description="Translate complex medical jargon into plain, understandable language"
        isActive={activeMode === 'medical'}
        onClick={() => setActiveMode('medical')}
      />
      <ModeCard
        mode="cultural"
        icon={Globe2}
        title="Cultural Bridge"
        description="Navigate cultural differences in healthcare communication"
        isActive={activeMode === 'cultural'}
        onClick={() => setActiveMode('cultural')}
      />
      <ModeCard
        mode="kids"
        icon={Baby}
        title="Kids Explanation"
        description="Make medical information child-friendly and less scary"
        isActive={activeMode === 'kids'}
        onClick={() => setActiveMode('kids')}
      />
    </div>

    {/* Input Section */}
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
      <div className="space-y-4">
        {activeMode === 'cultural' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your cultural background:
            </label>
            <MemoizedSelect
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={culturalBackground}
              onChange={handleCulturalBackgroundChange}
            >
              <option value="">Select your background</option>
              <option value="East Asian">
                East Asian (Chinese, Japanese, Korean)
              </option>
              <option value="South Asian">
                South Asian (Indian, Pakistani, Bangladeshi)
              </option>
              <option value="Middle Eastern">
                Middle Eastern (Arab, Persian, Turkish)
              </option>
              <option value="African">African (Various traditions)</option>
              <option value="Latin American">
                Latin American (Hispanic/Latino)
              </option>
              <option value="Indigenous">
                Indigenous (Native American, Aboriginal)
              </option>
            </MemoizedSelect>
          </div>
        )}

        {activeMode === 'kids' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Child's age:
            </label>
            <MemoizedSelect
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            {activeMode === 'medical'
              ? 'Medical term or description:'
              : activeMode === 'cultural'
                ? 'Your health concern:'
                : 'Medical procedure or condition:'}
          </label>
          <div className="relative">
            <MemoizedTextarea
              className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder={placeholder}
              value={input}
              onChange={handleInputChange}
            />
            <button
              className={`absolute right-3 top-3 p-1 rounded-full transition-colors ${
                isListening
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              onClick={toggleVoiceRecording}
              type="button"
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
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
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>
                {activeMode === 'medical'
                  ? 'Explain In Plain English'
                  : activeMode === 'cultural'
                    ? 'Get Cultural Context'
                    : 'Create Kid-Friendly Explanation'}
              </span>
            </>
          )}
        </button>
      </div>
    </div>

    {/* Result Section */}
    {result && (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-l-4 border-green-400 mb-20">
        {/* UPDATED: Renders the result using the new component */}
        <HtmlResultRenderer result={result} activeMode={activeMode} />

        <div className="mt-4 flex space-x-2">
            <button
              onClick={handleSaveToDictionary}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center space-x-1"
            >
              <Save className="w-4 h-4" />
              <span>Save to Dictionary</span>
            </button>
          
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm hover:bg-gray-50 border">
            Share
          </button>
        </div>
      </div>
    )}

    {error && (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4 mb-20">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    )}
  </>
);

const DictionaryView = ({
  searchQuery,
  handleSearchQueryChange,
  dictionary,
  searchDictionary,
  removeFromDictionary,
  handleShowDetails,
}: {
  searchQuery: string;
  handleSearchQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dictionary: DictionaryItem[];
  searchDictionary: (query: string) => DictionaryItem[];
  removeFromDictionary: (id: string) => void;
  handleShowDetails: (item: DictionaryItem) => void;
}) => {
  const filteredDictionary = searchQuery
    ? searchDictionary(searchQuery)
    : dictionary;

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
          <BookMarked className="w-6 h-6" />
          <span>Your Personal Medical Dictionary</span>
        </h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <MemoizedInput
            type="text"
            placeholder="Search your dictionary..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </div>

        <div className="space-y-4">
          {filteredDictionary.length > 0 ? (
            filteredDictionary.map((item) => (
              <div
                key={item.id}
                className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleShowDetails(item)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {item.term}
                    </h3>
                    {/* UPDATED: Use fallback */}
                    <p className="text-gray-600 mt-1 leading-relaxed line-clamp-2">
                      {item.explanation || item.translation}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Saved {item.saved}</span>
                      {item.complexity && item.category === 'medical' && (
                        <span>Complexity: {item.complexity}/5</span>
                      )}
                      <span className="capitalize">{item.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromDictionary(item.id);
                    }}
                    className="ml-4 p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8 italic">
              {searchQuery
                ? 'No matching terms found.'
                : 'No saved terms yet. Start translating medical terms to build your dictionary!'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const TranslateView = ({
  targetLanguage,
  handleTargetLanguageChange,
  input,
  handleInputChange,
  handleLanguageTranslate,
  isLoading,
  result,
  error,
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
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="e.g., Take this medication twice daily with food, You need to come back for a follow-up in two weeks"
            value={input}
            onChange={handleInputChange}
          />
        </div>

        <button
          className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
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
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border-l-4 border-green-400 mt-6">
          <h3 className="font-semibold text-green-800 mb-3">
            Translation Result:
          </h3>
          <div className="whitespace-pre-line text-gray-800 leading-relaxed">
            {result}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  </div>
);

// NEW: DictionaryDetailModal component
const DictionaryDetailModal = ({
  item,
  onClose,
}: {
  item: DictionaryItem;
  onClose: () => void;
}) => {
  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Panel */}
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">{item.term}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
            <span>Saved {item.saved}</span>
            {item.complexity && item.category === 'medical' && (
              <span>Complexity: {item.complexity}/5</span>
            )}
            <span className="capitalize">{item.category}</span>
          </div>
          
          {/*
            Replaced the simple <div> with HtmlResultRenderer.
            We pass item.category (which is 'medical') as the 'activeMode' prop
            to ensure the correct formatting is applied.
          */}
          <HtmlResultRenderer
            result={item.explanation || item.translation || ''}
            activeMode={item.category}
          />
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
DictionaryDetailModal.displayName = 'DictionaryDetailModal';

// Main CareTranslateApp component
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
  const [selectedDictionaryItem, setSelectedDictionaryItem] =
    useState<DictionaryItem | null>(null);

  const {
    translateMedical,
    translateCultural,
    translateKids,
    translateLanguage,
    isLoading,
    error,
  } = useTranslation();

  const {
    dictionary,
    saveToDictionary,
    removeFromDictionary,
    searchDictionary,
  } = useDictionary();

  // Stable event handlers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    [],
  );

  const handleCulturalBackgroundChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCulturalBackground(e.target.value);
    },
    [],
  );

  const handleChildAgeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setChildAge(e.target.value);
    },
    [],
  );

  const handleComplexityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setComplexityLevel(Number(e.target.value));
    },
    [],
  );

  const handleTargetLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTargetLanguage(e.target.value);
    },
    [],
  );

  const handleSearchQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    [],
  );

  const handleShowDetails = useCallback((item: DictionaryItem) => {
    setSelectedDictionaryItem(item);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedDictionaryItem(null);
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
          setResult("Please select the child's age first.");
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
      setResult(
        `Original: ${input}\n\nTranslated: ${
          response.translatedText
        }\n\nDetected source language: ${
          response.detectedSourceLanguage || 'Unknown'
        }`,
      );
    } catch (err)
    {
      console.error('Language translation error:', err);
      setResult('Sorry, translation failed. Please try again.');
    }
  };

  const handleSaveToDictionary = () => {
    //if (input && result && activeMode === 'medical') {
      // The `saveToDictionary` hook will receive 'result' as the explanation
      saveToDictionary(input, result, activeMode, complexityLevel);
      alert('Saved to your personal dictionary!');
    //}
  };

  const toggleVoiceRecording = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + ' ' + transcript);
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
  const placeholders = useMemo(
    () => ({
      medical: 'e.g., Myocardial infarction, Gastroenteritis',
      cultural: 'Describe your symptoms or questions...',
      kids: 'e.g., Getting a vaccine shot',
    }),
    [],
  );

  const placeholder =
    placeholders[activeMode as keyof typeof placeholders] ||
    placeholders.medical;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CareTranslate
              </h1>
              <p className="text-gray-600 text-sm">
                Breaking down healthcare communication barriers
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
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
            handleShowDetails={handleShowDetails}
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-around py-3">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'dictionary', icon: BookMarked, label: 'Dictionary' },
              { id: 'translate', icon: Globe, label: 'Translate' },
            ].map((item) => (
              <div
                key={item.id}
                className={`flex flex-col items-center space-y-1 cursor-pointer px-4 py-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Render modal conditionally */}
      {selectedDictionaryItem && (
        <DictionaryDetailModal
          item={selectedDictionaryItem}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}