# 🏥 CareTranslate - Healthcare Communication Bridge

[![Next.js](https://img.shields.io/badge/Next.js-13+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)

> Breaking down healthcare communication barriers with AI-powered translation and cultural sensitivity

**CareTranslate** is a comprehensive healthcare communication platform that bridges the gap between complex medical terminology and patient understanding. Using AI-powered translation, cultural sensitivity guidance, and child-friendly explanations, we make healthcare accessible to everyone.

## 🌟 Features

### 🔬 **Medical Terms Translation**
- Convert complex medical jargon into plain English
- Adjustable complexity levels (1-5)
- Powered by Google Gemini AI
- Save translations to personal dictionary

### 🌍 **Cultural Bridge**
- Culturally-sensitive healthcare communication guidance
- Support for 6+ cultural backgrounds
- Traditional + modern medicine integration advice
- Family dynamics and communication strategies

### 👶 **Kids Explanation**
- Age-appropriate medical explanations (3-16 years)
- Fun analogies and child-friendly language
- Reduces medical anxiety for children
- Interactive and encouraging tone

### 🗣️ **Real-time Translation**
- Translate medical instructions into 20+ languages
- Powered by Google Translate API
- Medical terminology specialized
- Support for major world languages

### 📚 **Personal Dictionary**
- Save and organize medical terms
- Search and filter functionality
- Export capabilities
- Offline access to saved terms

### 🎤 **Voice Input**
- Speech-to-text for hands-free operation
- Multiple language support
- Accessibility-focused design

## 🚀 Live Demo

🌐 **[Try CareTranslate Live](https://caretranslate.vercel.app)** *(Replace with your actual URL)*

## 📸 Screenshots
<div align="center">
  <img src="/images/Main_UI1.png" alt="CareTranlate Main UI" width="350">
</div>


## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Lucide React Icons
- **AI/ML**: Google Gemini Pro, Google Translate API
- **State Management**: React Hooks, Local Storage
- **Deployment**: Vercel, Netlify (compatible)
- **Voice**: Web Speech API
- **Build Tools**: Next.js, PostCSS, ESLint

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key ([Get here](https://aistudio.google.com/app/apikey))
- Google Translate API key (optional, [Get here](https://console.cloud.google.com/))

### Initialization

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/caretranslate.git
cd caretranslate
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_TRANSLATE_API_KEY=your_translate_api_key_here
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Getting API Keys

### Google Gemini API Key (Required)
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key
4. Add to `.env.local` as `GOOGLE_GEMINI_API_KEY`

### Google Translate API Key (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the "Cloud Translation API"
4. Create credentials → API Key
5. Add to `.env.local` as `GOOGLE_TRANSLATE_API_KEY`

## 🏗️ Project Structure

```
caretranslate/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── medical/
│   │   │   ├── cultural/
│   │   │   ├── kids/
│   │   │   └── language-translate/
│   │   ├── page.tsx       # Main application
│   │   └── layout.tsx     # Root layout
│   ├── lib/
│   │   ├── gemini.ts      # Gemini AI service
│   │   └── googleTranslate.ts # Translation service
│   └── hooks/
│       └── useTranslation.ts  # Custom hooks
├── public/                # Static assets
├── .env.example          # Environment template
└── package.json          # Dependencies
```

## 🚀 Deployment

### Deploy to Vercel

#### Method 1: With GitHub
1. Push your code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

## 📖 Usage Examples

### Medical Translation
```
Input: "Myocardial infarction"
Output: "Heart attack - when blood flow to your heart muscle gets blocked, usually by fatty deposits..."
```

### Cultural Bridge
```
Cultural Background: South Asian
Input: "I'm embarrassed to discuss mental health"
Output: "In South Asian cultures, mental health discussions require sensitivity to family honor and traditional healing approaches..."
```

### Kids Explanation
```
Age: 6-8 years
Input: "Getting a blood test"
Output: "Hey there! A blood test is like when doctors need to check if your body is working perfectly, just like checking if a car engine is running well..."
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini team for powerful AI capabilities
- Healthcare professionals who provided cultural insights
- Open source community for amazing tools and libraries
- Beta testers and early adopters

## ⭐ Show Your Support

Give a ⭐️ if this project helped you improve healthcare communication!

---

<div align="center">

**[Website](https://caretranslate.vercel.app)** • 
**[Documentation](https://your-docs-url.com)** • 
**[Report Bug](https://github.com/yourusername/caretranslate/issues)** • 
**[Request Feature](https://github.com/yourusername/caretranslate/issues)**

Made with ❤️ for better healthcare communication

</div>
