import React from "react";

const TvRow = ({ row, rowIndex, activeRow, activeCol }) => {
  const isActiveRow = rowIndex === activeRow;

  // HORIZONTAL TRACKING ENGINE:
  // Card width (155px) + Grid Gap (20px) = 175px total footprint per card.
  // When this row is active, we shift the container left dynamically.
  // This ensures the selected card always remains anchored beautifully in view.
  const calculateHorizontalOffset = () => {
    if (!isActiveRow) return "0px";
    return `${-(activeCol * 175)}px`;
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
              {/* Optional: Accessibility layer for TV Screen Readers */}
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
