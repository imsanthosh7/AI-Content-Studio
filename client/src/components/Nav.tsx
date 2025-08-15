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
    <nav className="relative z-50 flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
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
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
