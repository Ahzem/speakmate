# 🗣️ SpeakMate

> **Practice English naturally with your private AI conversation partner.**  
> Built as an open-source Hacktoberfest 2026 project.

SpeakMate is a friendly, distraction-free AI English conversation partner designed for learners who want to practice conversational English without pressure. SpeakMate engages in natural dialog while gently offering clear grammar and wording corrections with simple explanations.

Best of all, **SpeakMate runs 100% locally on your machine** using Ollama and Gemma 3 1B. **No OpenAI, Gemini, or Claude API keys required. No cloud subscriptions. Zero telemetry. Complete privacy.**

---

## 💡 Why SpeakMate Was Built

Practicing a new language with a native speaker can sometimes feel intimidating or stressful. Traditional grammar check tools are rigid and feel like spellcheckers, while cloud LLMs can be costly, require API keys, and send personal conversations to third-party servers.

SpeakMate was built to solve this:
1. **Low-Stress Environment**: A supportive, friendly AI partner that never criticizes or shames your English.
2. **Actionable Feedback**: When mistakes happen, SpeakMate shows:
   - **Correction**: The natural phrasing.
   - **Why**: A short, simple explanation of the grammar rule.
   - **Continue**: A single follow-up question to keep the conversation flowing.
3. **No Fake Corrections**: If your English is already correct, SpeakMate responds naturally without making up mistakes.
4. **Complete Privacy & Offline Capability**: Powered entirely by local Gemma 3 1B on Ollama.

---

## 🏗️ Architecture

```
┌─────────────────┐       HTTP POST /api/chat       ┌──────────────────────┐
│     Browser     │ ──────────────────────────────> │ Next.js (App Router) │
│ (React + State) │ <────────────────────────────── │   Backend Handler    │
└─────────────────┘       Clean JSON Response       └──────────┬───────────┘
                                                               │
                                         HTTP POST /api/chat   │  Localhost (11434)
                                         (stream: false)       ▼
                                                    ┌──────────────────────┐
                                                    │     Local Ollama     │
                                                    │   (Gemma 3 1B LLM)   │
                                                    └──────────────────────┘
```

- **Browser**: Single-page chat interface that maintains session history in React state.
- **Next.js `/api/chat` Route**: Validates messages, enforces the SpeakMate system prompt, and forwards requests to Ollama.
- **Ollama**: Local model runner serving Gemma 3 1B at `http://localhost:11434`.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Local AI Engine**: [Ollama](https://ollama.com/)
- **AI Model**: [Google Gemma 3 1B](https://ollama.com/library/gemma3:1b) (`gemma3:1b`)

---

## 🚀 Quick Start Guide

### Prerequisites

1. **Node.js** (v20 or newer recommended)
2. **pnpm** (`npm install -g pnpm`)
3. **Ollama** installed on your machine

---

### Step 1: Install & Set Up Ollama

1. Download and install Ollama from [ollama.com/download](https://ollama.com/download).
2. Pull the **Gemma 3 1B** model:
   ```bash
   ollama pull gemma3:1b
   ```
3. Ensure Ollama is running:
   ```bash
   ollama serve
   ```
   *(On macOS/Windows with the Ollama desktop app, Ollama usually starts in the background automatically).*

4. Verify Ollama is ready:
   ```bash
   curl http://localhost:11434/api/tags
   ```

---

### Step 2: Install SpeakMate Dependencies

In the root of the project:

```bash
pnpm install
```

---

### Step 3: Run the Application

Start the Next.js development server:

```bash
pnpm dev
```

Open your browser and navigate to:

👉 **[http://localhost:3000](http://localhost:3000)**

---

## 💬 Example Conversation Flow

```
User:
"Yesterday I go to office and I meet my friend."

SpeakMate:
Correction: Yesterday I went to the office and met my friend.

Why: Use 'went' and 'met' because you are talking about the past.

Continue: What did you and your friend do?
```

If the user's sentence is already correct:

```
User:
"I love drinking a cup of warm coffee every morning."

SpeakMate:
"A warm cup of coffee is the best way to start the day! How do you take your coffee?"
```

---

## ⚙️ Configuration & Environment Variables

No `.env` file is required out of the box! Default settings point to your local Ollama instance:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `OLLAMA_HOST` | `http://127.0.0.1:11434` | The URL of your local Ollama server |
| `OLLAMA_MODEL` | `gemma3:1b` | The model name loaded in Ollama |

If your Ollama server is hosted on a different port or machine, you can create a `.env.local` file:

```env
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=gemma3:1b
```

---

## 🧪 Testing & Verification

Run the TypeScript typecheck and lint suite:

```bash
# Check TypeScript and build
pnpm build

# Run ESLint
pnpm lint
```

---

## 🔒 Privacy & Local Execution Notice

SpeakMate does **NOT** communicate with OpenAI, Google Gemini API, Anthropic Claude, or any other cloud provider. All conversational inferences are processed entirely on your local CPU/GPU through Ollama. Your chats never leave your machine.

---

## 📜 License

Created with ❤️ for **Hacktoberfest 2026**. Open source under the [MIT License](LICENSE).
