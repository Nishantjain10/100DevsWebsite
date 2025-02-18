# 100devs Community Platform

A social platform for the 100devs community to share posts, resources, and connect with fellow developers.

## Features

- 🔐 Secure Authentication with Appwrite
- 📱 Responsive Twitter-like Interface
- 📝 Create and Share Posts
- 🔥 Trending Posts Section
- 💬 Interactive Comments
- 📚 Resource Sharing
- 👤 User Profiles
- 🌓 Modern UI with Glassmorphism Design

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Appwrite Backend
- Vite
- React Router
- React Hot Toast

## Project Structure

```
100devs-community/
├── src/
│   ├── assets/          # Images, fonts, and other static files
│   │   ├── auth/       # Authentication related components
│   │   └── ui/         # Common UI components
│   ├── config/         # Configuration files
│   │   ├── appwrite.ts # Appwrite client setup
│   │   └── constants.ts # App constants
│   ├── pages/          # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── SignUp.tsx
│   │   └── LandingPage.tsx
│   ├── services/       # API and service functions
│   ├── types/          # TypeScript type definitions
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── public/             # Public assets
├── .env               # Environment variables
├── index.html         # HTML template
├── package.json       # Dependencies and scripts
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── vite.config.ts     # Vite configuration
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/100devs-community.git
```

2. Install dependencies:
```bash
cd 100devs-community
npm install
```

3. Create a `.env` file in the root directory with your Appwrite credentials:
```bash
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
```

4. Start the development server:
```bash
npm run dev
```

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Appwrite instance (local or cloud)

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Deployment

The application can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

## License

Distributed under the MIT License. See `LICENSE` for more information.
