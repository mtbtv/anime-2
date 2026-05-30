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
    return <div style={{ color: "white", padding: "60px", fontSize: "24px" }}>Loading Entertainment Grid...</div>;
  }

  // VERTICAL MATH:
  // When activeRow === 0, keep slider at 0px (Hero banner fully visible)
  // When activeRow === 1, shift past Hero Banner (440px total space)
  // When activeRow > 1, shift further up by 340px per added row track
  const calculateVerticalOffset = () => {
    if (activeRow === 0) return 0;
    return -(440) - ((activeRow - 1) * 340);
  };

  return (
    <div className="tv-viewport">
      {/* Master slider wrapper enclosing everything together */}
      <div 
        className="content-slider"
        style={{ transform: `translate3d(0px, ${calculateVerticalOffset()}px, 0px)` }}
      >
        {/* Upcoming Anime Carousel Slider */}
        <HeroBanner upcomingAnime={data.upcoming} />

        {/* Media Rails Lists Content */}
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
