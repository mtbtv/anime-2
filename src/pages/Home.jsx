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

  // MODIFIED VERTICAL FOCUS ENGINE
  // Instead of centering the row at 50vh, we lock the top baseline of the active row
  // to exactly 38vh from the top edge. This pulls the content up and guarantees
  // the row never hits or hides behind the bottom bezel of your TV browser.
  const calculateVerticalOffset = () => {
    const heroTotalHeight = 380; // 350px height + 30px margin
    const rowTotalHeight = 315;  // 290px height + 25px margin
    
    const targetRowTop = heroTotalHeight + (activeRow * rowTotalHeight);
    
    return `calc(38vh - ${targetRowTop}px)`;
  };

  return (
    <div className="tv-viewport">
      <div 
        className="content-slider"
        style={{ transform: `translate3d(0px, ${calculateVerticalOffset()}, 0px)` }}
      >
        <HeroBanner upcomingAnime={data.upcoming} />

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
