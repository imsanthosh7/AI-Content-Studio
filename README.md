# GrammarKey - AI Content Studio

A powerful AI-powered content generation application built with React, Express, and Google AI (Gemini). Generate, edit, and optimize content for various social media platforms with intelligent AI assistance.

## Features

- 🤖 **AI-Powered Content Generation** - Powered by Google Gemini AI
- 📱 **Multi-Platform Support** - LinkedIn, Instagram, Twitter, Reddit
- ✍️ **Grammar Correction** - AI-powered text improvement
- 🎨 **Modern UI/UX** - Built with React, Tailwind CSS, and Radix UI
- 🚀 **Real-time Processing** - Fast content generation and editing
- 🔒 **Secure** - Environment-based API key management

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, Node.js, TypeScript
- **AI**: Google Gemini AI API
- **Build Tools**: Vite, ESBuild
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google AI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/imsanthosh7/AI-Content-Studio.git
cd AI-Content-Studio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_google_ai_api_key_here
PORT=3003
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3003`

## Deployment on Vercel

### Automatic Deployment

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration and deploy
3. Set the following environment variables in Vercel:
   - `GEMINI_API_KEY`: Your Google AI API key
   - `NODE_ENV`: `production`

### Manual Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Build the project:
```bash
npm run build:vercel
```

3. Deploy:
```bash
vercel --prod
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google AI API key | Yes |
| `PORT` | Server port | No (default: 3003) |
| `NODE_ENV` | Environment mode | No (default: development) |

## API Endpoints

- `POST /api/content/generate` - Generate AI content
- `GET /` - Main application interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository. 