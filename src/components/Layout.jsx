import React from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Heart } from 'lucide-react';

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#030303]/80 border-b border-gray-200/60 dark:border-gray-800/60">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
              Progress
            </span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-800/80 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-all duration-200 active:scale-95"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-200/60 dark:border-gray-800/60 bg-white/50 dark:bg-[#030303]/50 backdrop-blur-sm mt-auto">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5 sm:py-6">
          <div className="flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500">
            <span>Built with</span>
            <Heart size={13} className="text-red-400 fill-red-400" />
            <span>by</span>
            <a
              href="https://github.com/dev-kvt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              dev-kvt
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/dev-kvt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <span className="text-xs text-gray-300 dark:text-gray-700">
              © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
