import React from "react";

const TvRow = ({ row, rowIndex, activeRow, activeCol }) => {
  const isActiveRow = rowIndex === activeRow;

  // NETFLIX BOUNDARY CLAMPING ENGINE
  const calculateHorizontalOffset = () => {
    if (!isActiveRow) return "0px";
    
    const totalItems = row.items?.length || 0;
    if (totalItems === 0) return "0px";

    const viewportWidth = window.innerWidth;
    const cardStep = 175;  // 155px width + 20px gap
    const cardWidth = 155;
    const leftPadding = 60; // Safe area padding-left from content-slider

    // 1. Calculate the ideal translation to put the active card dead center
    const targetTranslation = (viewportWidth / 2) - leftPadding - (activeCol * cardStep) - (cardWidth / 2);

    // 2. Left Boundary Guard: Prevent the row from sliding right and leaving blank space
    let clampedTranslation = Math.min(0, targetTranslation);

    // 3. Right Boundary Guard: Prevent the row from sliding too far left at the end of the list
    const totalRowWidth = (totalItems * cardStep) - 20;
    const minTranslation = viewportWidth - 60 - leftPadding - totalRowWidth;

    // If the total width of all cards fits on the screen without scrolling, keep it at 0px
    if (totalRowWidth + leftPadding + 60 <= viewportWidth) {
      return "0px";
    }

    // Apply the right boundary clamp
    clampedTranslation = Math.max(clampedTranslation, minTranslation);

    return `${clampedTranslation}px`;
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
