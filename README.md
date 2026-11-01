# Resume Analyser & Mock Interviewer

An AI-powered ATS resume analyzer and technical interview question generator built with React, TypeScript, and Vite.

## Features

- **ATS Resume Parsing & Metrics**: Evaluates keyword density, formatting, and structural health.
- **Tech Stack Inspector**: Automatically identifies verified technical skills from the uploaded resume.
- **AI-Powered Grilling Questions**: Multi-tier cascade generating 30+ resume-specific interview questions with model answers.
- **Offline Heuristics Engine**: Built-in fallback engine when API keys are not provided.
- **Multi-Provider Support**: Compatible with Google Gemini and Groq Cloud.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Keys (Optional)
The application can run in offline mode using its built-in heuristics engine, or you can supply API keys for Google Gemini / Groq.

Copy `.env.example` to `.env.local` and add your keys:
```bash
cp .env.example .env.local
```

Inside `.env.local`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```

*Note: You can also configure or change API keys at any time directly in the application UI.*

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```
