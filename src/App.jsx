import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import LeetCodeCalendar from './LeetCodeCalendar';

function App() {
  const username = 'dev-kvt';

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-12 p-8">
      
      {/* GitHub Graph */}
      <h1 className="text-2xl font-bold">Github</h1>
      <div className="flex justify-center w-full overflow-x-auto">
        <GitHubCalendar 
          username={username} 
          colorScheme="dark"
          fontSize={14}
          blockSize={14}
          blockMargin={4}
          hideTotalCount={true}
          hideColorLegend={true}
        />
      </div>

      {/* LeetCode Graph */}
      <h1 className="text-2xl font-bold">Leetcode</h1>
      <div className="flex justify-center w-full overflow-x-auto">
        <LeetCodeCalendar username={username} />
      </div>

    </div>
  );
}

export default App;
