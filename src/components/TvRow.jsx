import React from "react";

const TvRow = ({ row, rowIndex, activeRow, activeCol }) => {
  const isActiveRow = rowIndex === activeRow;

  // HORIZONTAL CROSSHAIR TRACKING ENGINE
  // Card Footprint: 155px width + 20px gap = 175px total.
  // Card Centerpoint: 155px / 2 = 77.5px.
  // Viewport padding offset adjustment: 60px.
  const calculateHorizontalOffset = () => {
    if (!isActiveRow) return "0px";
    
    // Calculates the shift required to lock the active card precisely at 50vw
    return `calc(50vw - 137.5px - (${activeCol * 175}px))`;
  };

  return (
    <div className={`tv-row ${isActiveRow ? "active-row" : ""}`}>
      <h2>{row.title}</h2>
      
      <div
        className="cards-container"
        style={{
          transform: `translate3d(${calculateHorizontalOffset()}, 0px, 0px)`,
        }}
      >
        {row.items?.map((anime, colIndex) => {
          const isFocused = isActiveRow && colIndex === activeCol;
          
          return (
            <div
              key={anime.mal_id || colIndex}
              className={`anime-card ${isFocused ? "focused" : ""}`}
              style={{
                backgroundImage: `url(${
                  anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url
                })`,
              }}
            >
              <span className="sr-only">
                {anime.title_english || anime.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TvRow;
