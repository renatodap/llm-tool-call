# LLM Error Classifier Frontend

Modern, glassmorphic UI for demonstrating LLM tool-use error classification using a fine-tuned Llama-3.2-3B model.

## Features

- **Single-page demo** with real-time classification
- **Glassmorphic dark theme** with gradient accents
- **Color-coded error categories** (8 types)
- **Confidence visualization** using animated bar charts
- **Pre-loaded examples** for quick testing
- **Smooth animations** with Framer Motion
- **Fully responsive** design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Charts**: Recharts
- **Animations**: Framer Motion

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure API URL** (optional):
   Create/edit `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx           # Main demo page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   └── ui/                # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       └── badge.tsx
├── lib/
│   ├── api.ts             # API client
│   ├── colors.ts          # Color mappings
│   ├── examples.ts        # Example data
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## Error Categories

The classifier detects 8 types of tool-use errors:

1. **Correct** - Properly formed tool call
2. **No_Tool_Available** - No matching tool exists
3. **Incorrect_Function_Name** - Wrong function name
4. **Incorrect_Argument_Name** - Invalid argument name
5. **Incorrect_Argument_Value** - Invalid argument value
6. **Incorrect_Argument_Type** - Wrong argument type
7. **Wrong_Tool** - Wrong tool selected
8. **Wrong_Syntax** - Malformed syntax

Each category has a unique color for easy visual identification.

## Usage

1. **Input**: Enter or paste your tool call JSON in the left panel
2. **Examples**: Click any example card to load pre-configured test cases
3. **Classify**: Click the "Classify" button to analyze the tool call
4. **Results**: View the prediction with confidence scores and distribution chart

## Backend Requirement

This frontend requires the FastAPI backend to be running. See `../api/README.md` for setup instructions.

## Development

- **Hot Reload**: Changes to code automatically reload the browser
- **Type Safety**: Full TypeScript support with strict mode
- **Linting**: ESLint configured for Next.js
- **Formatting**: Prettier recommended (optional)

## License

Academic project for CSSE/MA416 Deep Learning - Rose-Hulman Institute of Technology
