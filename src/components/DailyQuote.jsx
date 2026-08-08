import React, { useMemo } from 'react';
import { Quote } from 'lucide-react';

const quotes = [
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "You act like mortals in all that you fear, and like immortals in all that you desire.", author: "Seneca" },
  { text: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.", author: "Marcus Aurelius" },
  { text: "Let us prepare our minds as if we'd come to the very end of life. Let us postpone nothing.", author: "Seneca" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "You could leave life right now. Let that determine what you do and say and think.", author: "Marcus Aurelius" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { text: "How long are you going to wait before you demand the best for yourself?", author: "Epictetus" },
  { text: "If you want to improve, be content to be thought foolish and stupid.", author: "Epictetus" },
  { text: "He who fears death will never do anything worthy of a man who is alive.", author: "Seneca" },
  { text: "Life is very short and anxious for those who forget the past, neglect the present, and fear the future.", author: "Seneca" },
  { text: "To live a good life: We have the potential for it. If we can learn to be indifferent to what makes no difference.", author: "Marcus Aurelius" },
  { text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca" },
  { text: "Sometimes even to live is an act of courage.", author: "Seneca" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca" },
  { text: "The whole future lies in uncertainty: live immediately.", author: "Seneca" }
];

export default function DailyQuote() {
  const quote = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((today - start) / 86400000);
    return quotes[dayOfYear % quotes.length];
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-4 sm:py-6">
        <Quote size={24} className="text-gray-200 dark:text-gray-700 mb-4 rotate-180 shrink-0" />
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium italic leading-relaxed">
          "{quote.text}"
        </p>
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-3 font-medium">
          — {quote.author}
        </p>
      </div>
    </div>
  );
}
