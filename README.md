# Dad.AI 🍼🧢
> **Your parenting co-pilot** — an AI companion built specifically for expecting fathers and new dads.

Dad.AI provides reassuring, factual, and judgment-free guidance for dads navigating pregnancy, newborn care, postpartum partner support, and dad life.

---

## 🌟 What the App Does

- **Judgment-Free Advice:** Instant answers to common parenting questions (diaper changes, soothing techniques, sleep regressions, cluster feeding).
- **Partner Support Guidance:** Actionable tips on how dads can practically and emotionally support their partner before and after birth.
- **Tailored Dad Persona:** Combines medically mindful advice with empathetic encouragement and a touch of lighthearted dad humor.
- **Real-Time Streaming Chat:** Instant, low-latency token streaming designed for quick, late-night queries with one hand while holding a baby.
- **Quick-Start Prompts:** Built-in starter questions to jump right into essential topics (hospital bag packing, burping techniques, etc.).

---

## 🏗️ Architecture & Technical Design

The app is built on a modern **Next.js App Router** architecture with **LangChain** orchestrating Google Gemini inference over native Web Streams.

```
┌────────────────────────────────────────────────────────┐
│                   User Client / Mobile                 │
│         (React 19 UI, Tailwind CSS v4, Web Fetch)      │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP POST /api/chat
                           ▼
┌────────────────────────────────────────────────────────┐
│               Next.js Route Handler                    │
│             (src/app/api/chat/route.ts)                │
│                                                        │
│  1. Injects Dad.AI System Prompt & Persona             │
│  2. Formats conversation history                       │
│  3. Invokes LangChain ChatGoogleGenerativeAI           │
│  4. Pipes chunks directly to native ReadableStream     │
└──────────────────────────┬─────────────────────────────┘
                           │ Secure HTTPS SSE Stream
                           ▼
┌────────────────────────────────────────────────────────┐
│             Google Gemini API Cloud                    │
│               (gemini-3.8-flash)                       │
└────────────────────────────────────────────────────────┘
```

### Why this architecture?
1. **Stateless & I/O-Bound Proxy:** The Next.js server does not run the AI model; it simply pipes tokens from Google's cloud to the user. A single modest 1 vCPU / 1 GB instance can easily handle hundreds of simultaneous streaming sockets without bottlenecking.
2. **Native Web Streams:** By leveraging standard Web `ReadableStream` instead of fragile wrapper adapters, the frontend and backend remain robust and resilient to external library breaking changes.
3. **LangChain Abstraction:** Allows swapping the underlying LLM provider (e.g., switching between Google Gemini, Anthropic Claude, or OpenAI) by modifying only the model initialization in the route handler.

---

## 📁 Project Structure

```
dad-ai/
├── src/
│   └── app/
│       ├── api/
│       │   └── chat/
│       │       └── route.ts      # LangChain backend route (Gemini 3.8 Flash + streaming)
│       ├── layout.tsx            # Root layout with responsive metadata
│       ├── page.tsx              # Mobile-first streaming chat interface
│       └── globals.css           # Tailwind CSS v4 styling
├── .env.local                    # Environment configuration (API Keys)
├── next.config.ts                # Next.js configuration
├── postcss.config.mjs            # PostCSS configuration for Tailwind v4
└── package.json                  # Dependencies and scripts (configured for port 3001)
```

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Orchestration:** [LangChain.js](https://js.langchain.com/) (`@langchain/core`, `@langchain/google-genai`)
- **LLM Model:** [Google Gemini 3.8 Flash](https://aistudio.google.com/)
- **Package Manager:** `pnpm`

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v18.18+ or v20+
- **pnpm:** Installed globally (`npm install -g pnpm`)
- **Google AI Studio API Key:** Free key available from [aistudio.google.com](https://aistudio.google.com/)

### 2. Setup Environment Variables
Create or edit `.env.local` in the project root:

```bash
GOOGLE_GENAI_API_KEY="your_gemini_api_key_here"
```

### 3. Run the Development Server
```bash
pnpm dev
```

The application will start on **http://localhost:3001**.

---

## 🔮 Roadmap

- [ ] **Persistent Memory & Profiles:** Store baby's due date / birth date in Firestore or PostgreSQL to dynamically calculate milestones.
- [ ] **Pediatric RAG (Retrieval-Augmented Generation):** Index verified pediatric health guidelines (e.g., AAP/WHO) with vector search to ground answers in verified literature.
- [ ] **Multi-Channel Delivery:** Add a Twilio webhook route to enable messaging the bot via WhatsApp or SMS.
