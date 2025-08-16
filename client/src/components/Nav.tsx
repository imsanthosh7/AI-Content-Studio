import React, { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { useLocation } from "wouter";

interface UserData {
  name: string;
  email: string;
  photo: string;
}

const Nav: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [, setLocation] = useLocation(); // Wouter navigation

  // Listen to Firebase auth state
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const currentUser: UserData = {
          name: firebaseUser.displayName || "Unknown User",
          email: firebaseUser.email || "",
          photo:
            firebaseUser.photoURL || "https://via.placeholder.com/40?text=User",
        };
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  // Firebase login
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser: User = result.user;

      const loggedUser: UserData = {
        name: firebaseUser.displayName || "Unknown User",
        email: firebaseUser.email || "",
        photo:
          firebaseUser.photoURL || "https://via.placeholder.com/40?text=User",
      };

      setUser(loggedUser);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setLocation("/home"); // navigate after login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Firebase logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("user");
      setLocation("/"); // navigate to landing page after logout
      setShowDropdown(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="relative z-50 flex items-center justify-between px-5 md:px-8 py-7 md:py-6 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <span className="text-2xl  font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          AI Studio
        </span>
      </div>

      {/* User Section */}
      <div className="relative">
        {user ? (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-50 transition-colors"
            >
              <img
                src={user.photo}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-500 ring-offset-2"
              />
              <span className="hidden sm:block text-gray-900 font-medium">
                {user.name.split(" ")[0]}
              </span>
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => setLocation("/home")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setLocation("/settings")}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Settings
                  </button>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="px-6 py-2.5 flex justify-center items-center gap-2  text-black border rounded-full font-medium shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
          >
            <span>
              <svg
                width="24px"
                height="24px"
                viewBox="-3 0 262 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
                fill="#000000"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    fill="#EB4335"
                  ></path>
                </g>
              </svg>
            </span>
            <span className="md:block hidden">Sign in with Google</span>
            <span className="md:hidden">Sign in</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
