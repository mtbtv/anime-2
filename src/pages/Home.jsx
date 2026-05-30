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
            alert(`Opening Streaming Layer for: ${selection.title_english || selection.title}`);
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

  // FIXED VERTICAL FOCUS ENGINE:
  // This calculates the exact midpoint of whichever row is currently active
  // and offsets it dynamically against 50vh (the vertical center of the screen).
  const calculateVerticalOffset = () => {
    const heroHeight = 380; // Hero banner height (350px) + margin-bottom (30px)
    const rowHeight = 315;  // Individual row height (290px) + margin-bottom (25px)
    
    // Find the exact center point of the current row
    const targetRowCenter = heroHeight + (activeRow * rowHeight) + (290 / 2);
    
    // Subtract from 50vh to slide the active row's center directly into the screen's center line
    return `calc(50vh - ${targetRowCenter}px)`;
  };

  return (
    <div className="tv-viewport">
      {/* Moving canvas driven by the new vertical balancing algorithm */}
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
