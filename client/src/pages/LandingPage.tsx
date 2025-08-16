import React, { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { useLocation } from "wouter";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from "@/contexts/ThemeContext";

const LandingPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to home
        setLocation("/home");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [setLocation]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // The useEffect hook will handle the redirect after successful login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="bg-background relative overflow-hidden">
      <Nav handleLogin={handleLogin} />
      {/* Hero Section */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-2 md:px-6">
        {/* Background gradients */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, ${theme === 'dark' ? '#374151' : '#e2e8f0'} 1px, transparent 1px),
              linear-gradient(to bottom, ${theme === 'dark' ? '#374151' : '#e2e8f0'} 1px, transparent 1px)
            `,
            backgroundSize: "20px 30px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
          }}
        />
        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto relative -mt-24 z-10">
          <div className="inline-flex justify-between gap-1 items-center px-4 py-2 bg-accent rounded-full border border-border mb-8">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                                 className="lucide lucide-sparkles-icon lucide-sparkles text-accent-foreground"
              >
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                <path d="M20 2v4" />
                <path d="M22 4h-4" />
                <circle cx="4" cy="20" r="2" />
              </svg>
            </span>
            <span className="text-accent-foreground font-medium text-sm">
              AI-powered suggestions
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
            AI Content Studio{" "}
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              Write Better, Engage Smarter
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Fix grammar instantly, generate captions that work across LinkedIn,
            Instagram, Twitter, and Reddit, and create smart comment replies
            that keep conversations alive, all powered by AI.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
