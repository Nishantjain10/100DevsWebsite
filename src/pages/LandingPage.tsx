import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { account } from '../config/appwrite';
import { FeatureCard } from '../components/FeatureCard';
import { TestimonialCard } from '../components/TestimonialCard';

export function LandingPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await account.get();
        setIsAuthenticated(true);
        setUserName(user.name);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      <header className="container mx-auto px-4 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-purple-600 font-bold text-2xl font-mono">100</span>
          </div>
          <span className="font-bold text-3xl font-mono">devs</span>
        </div>
        
        <nav>
          <ul className="flex space-x-6 text-lg font-semibold">
            <li><a href="#features" className="hover:text-yellow-300 transition-colors">About</a></li>
            <li><a href="#testimonials" className="hover:text-yellow-300 transition-colors">Community</a></li>
            {isAuthenticated ? (
              <>
                <li className="cursor-pointer hover:text-yellow-300 transition-colors">
                  Welcome, {userName}!
                </li>
                <li 
                  onClick={() => navigate('/dashboard')} 
                  className="cursor-pointer hover:text-yellow-300 transition-colors"
                >
                  Dashboard
                </li>
              </>
            ) : (
              <>
                <li 
                  onClick={() => navigate('/login')} 
                  className="cursor-pointer hover:text-yellow-300 transition-colors"
                >
                  Login
                </li>
                <li 
                  onClick={() => navigate('/signup')} 
                  className="cursor-pointer hover:text-yellow-300 transition-colors"
                >
                  Sign Up
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-mono animate-pulse">
            Welcome to <span className="text-yellow-300">100devs</span>
          </h1>
          <p className="text-2xl md:text-3xl mb-8 font-mono">Where coding meets chaos (the good kind)!</p>
          {isAuthenticated ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold text-xl px-8 py-4 rounded-full shadow-lg transform transition hover:scale-105"
            >
              Go to Dashboard
            </button>
          ) : (
            <button 
              onClick={() => navigate('/signup')}
              className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold text-xl px-8 py-4 rounded-full shadow-lg transform transition hover:scale-105"
            >
              Join the Madness
            </button>
          )}
        </section>

        <section id="features" className="py-20 relative">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 font-mono">Why 100devs is Lit 🔥</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Learn Together, Meme Together"
                description="Join a community where coding and memes unite! Share your best debugging memes and learn from fellow devs."
              />
              <FeatureCard
                title="Bugs? More like Features!"
                description="Every bug is just an unexpected feature in disguise. Turn your coding mishaps into legendary memes."
              />
              <FeatureCard
                title="From 'Hello World' to 'Hello Job'"
                description="Level up from console.log warrior to tech industry rockstar. We've got your back (and your memes)!"
              />
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 font-mono">What Our Devs Are Saying</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="I came for the coding, stayed for the memes. My debugging skills are now powered by quality memes and community support!"
                author="Meme Lord 9000"
              />
              <TestimonialCard
                quote="Thanks to 100devs, I now dream in JavaScript and wake up debugging. The memes make the learning 10x better!"
                author="Sleepless in Seattle.js"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-purple-900 bg-opacity-50 backdrop-filter backdrop-blur-lg text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-2xl font-mono">100devs</span>
              <p className="mt-2">Where coding dreams and memes collide</p>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            © {new Date().getFullYear()} 100devs. All rights reserved. Now go make some awesome stuff!
          </div>
        </div>
      </footer>
    </>
  );
} 