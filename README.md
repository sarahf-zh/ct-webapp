## CareTranslate
<div align="center">
  <img src="/images/applogo.png" alt="CareTranslate Logo" width="120">
  <br>
  <h3><b>Breaking down healthcare communication barriers</b></h3>
  <p><b>Leverage AI to bridge communication gaps and make healthcare truly accessible.</b></p>
  <p>
    <a href="#-youtube-demo">Watch Demo</a> • 
    <a href="#tech-stack">Tech Stack</a> • 
    <a href="#features">Features</a> • 
  </p>
</div>
---
### 📖 Overview
**CareTranslate** is an innovative web platform that uses Generative AI to act as a crucial communication bridge in healthcare. My core mission is to establish a new depth of understanding between patients and providers, rather than just developing a new drug. The app utilizes **Google's Gemini AI** for deep contextual understanding and the **Google Translate API** for precise language translation. The technology dynamically adjusts its output persona based on the specific audience—whether that audience is a patient, a provider, or a child.

<div align="center">
  <img src="/images/Main_UI1.png" alt="CareTranslate Main UI" width="400">
</div>

### 💡 The Inspiration & The Problem
I realized that a healthcare system cannot genuinely care for its patients if it cannot communicate clearly with them. Communication gaps in medicine are not just inconveniences; they are systemic failures.
* **Financial Impact:** **$1.7B in Malpractice Costs** are attributed to communication failures.
* **Human Cost:** Nearly **2,000 preventable deaths** occur due to these gaps.
* **Error Rate:** **70% of Serious Medical Errors** (including medical jargon and misunderstandings) stem from communication failure.

CareTranslate was designed to solve four specific "Points of Failure": the **Complex Term Gap**, the **Cultural Gap**, the **Age Gap**, and the **Language Gap**.

### ✨ Key Features
The platform offers four major functionalities plus accessibility tools in one seamless interface:
#### 1. Medical Terms Simplification (The Complex Term Gap)
Converts dense medical jargon (e.g., "Myocardial infarction") into plain, straightforward English.
* **Dynamic Complexity Control:** Includes a **complexity slider** that allows users to adjust the explanation level to their specific needs.

#### 2. Cultural Context Bridge (The Cultural Gap)
Provides AI-driven guidance for handling sensitive cross-cultural conversations.
* **Real-world Application:** Helps providers navigate nuance, such as understanding how to respectfully discuss mental health within an East Asian context.

#### 3. Kids' Explanation (The Age Gap)
Adapts complex health facts into non-threatening narratives to reduce childhood fear.
* **Analogy Engine:** Explains scary concepts using comforting analogies—for example, describing a vaccine to a 6-year-old as "giving your body a super strong army of tiny knights."

#### 4. Real-time Translation (The Language Gap)
Specialize in high-accuracy translation of vital medical instructions into **20+ major global languages** to prevent medication errors.

#### 5. Accessibility & Tools
* **Speech-to-Text:** Facilitates interaction for visually impaired users via direct voice input.
* **Save to Dictionary:** Allows users to save, search, and review their translated terms offline.

### ⚙️ Technical Challenges & Architecture
Building CareTranslate required architecting a system capable of complex, context-aware Natural Language Processing (NLP) while maintaining high speed.
<div align="center">
  <img src="/images/TechStack.png" alt="Technical Architecture" width="350">
</div>

#### The Challenge: Context-Aware Persona Switching
Unlike a standard dictionary, this system had to understand nuanced intent. I had to engineer the backend to dynamically switch functions:
1. **Simplification:** Converting terms to plain English.
2. **Cultural Guidance:** Generating respectful, actionable advice based on cultural norms.
3. **Age-Appropriate Analogy:** Generating friendly narratives for children.

#### The Solution: Robust Prompt Engineering
* **Backend:** I utilized **Next.js API Routes** to build a secure serverless backend. This required meticulous prompt engineering to ensure the Gemini model received clear instructions regarding target audience, tone, and output format.
* **Verification:** I utilized auxiliary Generative AI tools (ChatGPT) to verify the accuracy of cultural advice and contextual responses during development.

#### Tech Stack
* **Frontend:** **Next.js 14** and **TypeScript** for state management and a fast, responsive UI.
* **Styling:** **Tailwind CSS**.
* **AI Core 1:** **Google Gemini API** (Contextual Explanations, Analogies, Cultural Guidance).
* **AI Core 2:** **Google Translate API** (High-Accuracy Real-time Translation).

### 📺 YouTube Demo
Watch a 3-minute video walkthrough of the app in action:
**[https://youtu.be/QdNo4heb6e8](https://youtu.be/QdNo4heb6e8)**

