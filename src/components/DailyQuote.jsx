import React, { useMemo } from 'react';
import { Quote } from 'lucide-react';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Programs must be written for people to read.", author: "Harold Abelson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "The most damaging phrase in the language is: it's always been done that way.", author: "Grace Hopper" },
  { text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.", author: "Antoine de Saint-Exupéry" },
  { text: "The function of good software is to make the complex appear to be simple.", author: "Grady Booch" },
  { text: "Knowledge is power.", author: "Francis Bacon" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "Before software can be reusable it first has to be usable.", author: "Ralph Johnson" }, 
  { text: "Controlling complexity is the essence of computer programming.", author: "Brian Kernighan" },
  { text: "The most important property of a program is whether it accomplishes the intention of its user.", author: "C.A.R. Hoare" }, 
  { text: "Premature optimization is the root of all evil.", author: "Donald Knuth" }, { text: "Debugging is twice as hard as writing the code in the first place.", author: "Brian Kernighan" },
  { text: "Good code is its own best documentation.", author: "Steve McConnell" }, { text: "Deleted code is debugged code.", author: "Jeff Sickel" }, { text: "If debugging is the process of removing software bugs, then programming must be the process of putting them in.", author: "Edsger Dijkstra" }, { text: "The computer was born to solve problems that did not exist before.", author: "Bill Gates" }, { text: "Clean code always looks like it was written by someone who cares.", author: "Robert C. Martin" }, { text: "Truth can only be found in one place: the code.", author: "Robert C. Martin" }, { text: "Walking on water and developing software from a specification are easy if both are frozen.", author: "Edward V. Berard" }, { text: "The sooner you start to code, the longer the program will take.", author: "Roy Carlson" }, { text: "Testing leads to failure, and failure leads to understanding.", author: "Burt Rutan" }, { text: "Quality is not an act, it is a habit.", author: "Aristotle" }, { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" }, { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" }, { text: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh" }, { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" }, { text: "Do not wait for the perfect moment. Take the moment and make it perfect.", author: "Zoey Sayward" }, { text: "Small daily improvements are the key to staggering long-term results.", author: "Robin Sharma" }, { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" }, { text: "Consistency is more important than intensity.", author: "Unknown" }, { text: "Dreams don't work unless you do.", author: "John C. Maxwell" }, { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }, { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" }, { text: "One day or day one. You decide.", author: "Paulo Coelho" }, { text: "The expert in anything was once a beginner.", author: "Helen Hayes" }, { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" }, { text: "Stay hungry, stay foolish.", author: "Steve Jobs" }

];

export default function DailyQuote() {
  const quote = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((today - start) / 86400000);
    return quotes[dayOfYear % quotes.length];
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
      <Quote size={28} className="text-gray-200 dark:text-gray-700 mb-5 rotate-180" />
      <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium italic leading-relaxed max-w-sm">
        "{quote.text}"
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
        — {quote.author}
      </p>
    </div>
  );
}
