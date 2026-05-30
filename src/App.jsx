import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [rows, setRows] = useState([]);
  const [activeRow, setActiveRow] = useState(0);
  const [activeCol, setActiveCol] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch real anime arrays from MyAnimeList via Jikan API v4
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, popularRes] = await Promise.all([
          fetch("https://api.jikan.moe/v4/seasons/now?limit=12"),
          fetch("https://api.jikan.moe/v4/top/anime?limit=12")
        ]);

        const trendingData = await trendingRes.json();
        const popularData = await popularRes.json();

        setRows([
          { title: "Trending This Season", items: trendingData.data || [] },
          { title: "Top Rated Shows", items: popularData.data || [] }
        ]);
        setLoading(false);
      } catch (err) {
        console.error("API Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  // Spatial Navigation Keyboard Engine
  useEffect(() => {
    if (rows.length === 0) return;

    const handleKeyDown = (e) => {
      // Direct remote control inputs mapping
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
        e.preventDefault();
      }

      const currentItems = rows[activeRow]?.items || [];

      switch (e.key) {
        case "ArrowDown":
          if (activeRow < rows.length - 1) {
            setActiveRow(prev => prev + 1);
            setActiveCol(0); // Resets position index per row switch
          }
          break;
        case "ArrowUp":
          if (activeRow > 0) {
            setActiveRow(prev => prev - 1);
            setActiveCol(0);
          }
          break;
        case "ArrowRight":
          if (activeCol < currentItems.length - 1) {
            setActiveCol(prev => prev + 1);
          }
          break;
        case "ArrowLeft":
          if (activeCol > 0) {
            setActiveCol(prev => prev - 1);
          }
          break;
        case "Enter":
          const selection = currentItems[activeCol];
          if (selection) {
            alert(`Streaming Episode 1: ${selection.title}`);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeRow, activeCol, rows]);

  if (loading) {
    return <div style={{ color: "white", padding: "60px", fontSize: "24px" }}>Loading Stream Streams...</div>;
  }

  const verticalOffset = activeRow * -390; 
  const currentFocusedAnime = rows[activeRow]?.items[activeCol];

  return (
    <div className="tv-viewport">
      <div className="tv-header">
        <h1>ANIME STREAM TV</h1>
      </div>

      <div 
        className="rows-wrapper"
        style={{ transform: `translate3d(0px, ${verticalOffset}px, 0px)` }}
      >
        {rows.map((row, rowIndex) => {
          const isRowFocused = activeRow === rowIndex;
          const horizontalOffset = isRowFocused ? activeCol * -224 : 0;

          return (
            <div key={rowIndex} className={`tv-row ${isRowFocused ? "active-row" : ""}`}>
              <h2>{row.title}</h2>
              <div 
                className="cards-container"
                style={{ transform: `translate3d(${horizontalOffset}px, 0px, 0px)` }}
              >
                {row.items.map((anime, colIndex) => {
                  const isCardFocused = isRowFocused && activeCol === colIndex;
                  return (
                    <div
                      key={anime.mal_id}
                      className={`anime-card ${isCardFocused ? "focused" : ""}`}
                      style={{ backgroundImage: `url(${anime.images.jpg.large_image_url})` }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Synchronized dynamic display description metadata */}
      {currentFocusedAnime && (
        <div className="active-meta">
          <h3>{currentFocusedAnime.title}</h3>
          <p>{currentFocusedAnime.synopsis || "No description overview available."}</p>
        </div>
      )}
    </div>
  );
};

export default App;
