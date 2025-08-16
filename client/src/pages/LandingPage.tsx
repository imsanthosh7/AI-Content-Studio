import React from "react";
import Nav from '@/components/Nav'

const LandingPage: React.FC = () => {

 
  return (
    <div className=" bg-white relative overflow-hidden">
      <Nav/>
      {/* Hero Section */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-2 md:px-6">
        {/* Background gradients */}
        <div
          className="absolute  inset-0 z-0"
          style={{
            backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
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
          <div className="inline-flex justify-between gap-1 items-center px-4 py-2 bg-purple-50 rounded-full border border-purple-200 mb-8">
            <span className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-sparkles-icon lucide-sparkles text-purple-700"
              >
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                <path d="M20 2v4" />
                <path d="M22 4h-4" />
                <circle cx="4" cy="20" r="2" />
              </svg>
            </span>
            <span className="text-purple-700 font-medium text-sm">
              AI-powered suggestions
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            AI Content Studio{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Create Smarter, Faster
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into polished content with AI-powered grammar
            correction, intelligent rewriting, and social media optimization.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg">
              Get Started
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
