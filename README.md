# AI Study Assistant

A focused study tool built to parse reading materials, lecture notes, and documents into structured review modules. It processes source material through an LLM backend to automatically construct chapter breakdowns, interactive flashcards, and self-assessment quizzes.

---

### Core Capabilities

- **Structured Notes Breakdown**: Condenses technical text into clear hierarchical notes, key definitions, and revision points.
- **Active Recall Cards**: 3D animated flashcard components designed for rapid concept testing.
- **Automated Knowledge Checks**: Generates multiple-choice questions with answer validation and explanation logic.
- **Document Ingestion**: Backend file-handling pipeline supporting both raw text inputs and `.pdf` document parsing.
- **Custom Design System**: Cohesive editorial interface utilizing an earthy, low-contrast palette with Newsreader serif headings and Plus Jakarta Sans body type.

---

### Architecture & Tools

- **Client**: React, Vite, Tailwind CSS, Lucide React
- **Server**: Node.js, Express, Multer
- **Language Model**: Google GenAI API (Gemini 2.5 Flash)

---

### Local Setup

#### Prerequisites
- Node.js (v18 or higher)
- A Gemini API key (via Google AI Studio)

#### 1. Clone & Configure
```bash
git clone [https://github.com/Gargii03/ai-study-assistant.git](https://github.com/Gargii03/ai-study-assistant.git)
cd ai-study-assistant
