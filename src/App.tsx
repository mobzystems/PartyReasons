import React from 'react';
import './App.css';
import permutate from './permutate';

function App() {
  const x = permutate([6, 3], (a) => true);
  return (
    <h1>Hello world</h1>
  );
}

export default App;
