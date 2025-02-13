"use client";
import Link from "next/link";
import { useState } from "react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              QuizAI
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link
              href="/quizzes/create"
              className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              Create Quiz
            </Link>
            <Link
              href="/quizzes"
              className="px-4 py-2 text-gray-700 hover:text-blue-500 transition-colors"
            >
              Quizzes
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-500 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/quizzes/create"
              className="block px-3 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Create Quiz
            </Link>
            <Link
              href="/quizzes"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Quizzes
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

