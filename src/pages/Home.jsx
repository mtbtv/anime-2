import React, { useState, useEffect } from "react";
import { fetchTvHomeData } from "../api/jikan";
import TvRow from "../components/TvRow";
import HeroBanner from "../components/HeroBanner";

const Home = () => {
  const [data, setData] = useState({ upcoming: [], rows: [] });
  const [activeRow, setActiveRow] = useState(0);
  const [activeCol, setActiveCol] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchTvHomeData().then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (data.rows.length === 0) return;

    const handleKeyDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
        e.preventDefault();
      }

      const currentItems = data.rows[activeRow]?.items || [];

      switch (e.key) {
        case "ArrowDown":
          if (activeRow < data.rows.length - 1) {
            setActiveRow((prev) => prev + 1);
            setActiveCol(0);
          }
          break;
        case "ArrowUp":
          if (activeRow > 0) {
            setActiveRow((prev) => prev - 1);
            setActiveCol(0);
          }
          break;
        case "ArrowRight":
          if (activeCol < currentItems.length - 1) {
            setActiveCol((prev) => prev + 1);
          }
          break;
        case "ArrowLeft":
          if (activeCol > 0) {
            setActiveCol((prev) => prev - 1);
          }
          break;
        case "Enter":
          const selection = currentItems[activeCol];
          if (selection) {
            alert(`Streaming Option Triggered: ${selection.title_english || selection.title}`);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeRow, activeCol, data]);

  if (loading) {
    return <div style={{ color: "white", padding: "60px", fontSize: "24px" }}>Syncing TV Layout Engine...</div>;
  }

  // VERTICAL POSITIONING ENGINE:
  // Keeps the Hero Banner locked at the top when activeRow === 0.
  // When navigating down, it shifts the canvas so the selected row snaps 
  // directly into the ideal viewing area (45% down the viewport height).
  const calculateVerticalOffset = () => {
    if (activeRow === 0) return "0px";
    
    const heroHeight = 380; // Hero (350px) + Margin (30px)
    const previousRowsHeight = (activeRow - 1) * 315; // Row (290px) + Margin (25px)
    const targetRowTop = heroHeight + previousRowsHeight;
    
    return `calc(42vh - ${targetRowTop}px)`;
  };

  return (
    <div className="tv-viewport">
      {/* Moving canvas driven by the dynamic vertical calculation layout */}
      <div 
        className="content-slider"
        style={{ transform: `translate3d(0px, ${calculateVerticalOffset()}, 0px)` }}
      >
        {/* Dynamic Auto-Scrolling Top Showcase */}
        <HeroBanner upcomingAnime={data.upcoming} />

        {/* Categories Rail Grids */}
        {data.rows.map((row, rowIndex) => (
          <TvRow
            key={rowIndex}
            row={row}
            rowIndex={rowIndex}
            activeRow={activeRow}
            activeCol={activeCol}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
