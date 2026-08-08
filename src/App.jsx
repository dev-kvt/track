import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DayView from './pages/DayView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/day/:date" element={<DayView />} />
      </Routes>
    </Router>
  );
}

export default App;
