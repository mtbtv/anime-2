import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

case "ArrowDown": {
  const nextRow = Math.min(
    activeRow + 1,
    sections.length - 1
  );

  const nextRowItems =
    animeData[sections[nextRow]?.title] || [];

  const nextCard = Math.min(
    activeCard,
    Math.max(nextRowItems.length - 1, 0)
  );

  setActiveRow(nextRow);
  setActiveCard(nextCard);

  break;
}

case "ArrowUp": {
  const prevRow = Math.max(
    activeRow - 1,
    0
  );

  const prevRowItems =
    animeData[sections[prevRow]?.title] || [];

  const nextCard = Math.min(
    activeCard,
    Math.max(prevRowItems.length - 1, 0)
  );

  setActiveRow(prevRow);
  setActiveCard(nextCard);

  break;
}
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
