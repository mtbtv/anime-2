import React from "react";

const TvRow = ({ row, rowIndex, activeRow, activeCol }) => {
  const isActiveRow = rowIndex === activeRow;

  // NETFLIX BOUNDARY CLAMPING ENGINE (Calibrated for the new 170px dimensions)
  const calculateHorizontalOffset = () => {
    if (!isActiveRow) return "0px";
    
    const totalItems = row.items?.length || 0;
    if (totalItems === 0) return "0px";

    const viewportWidth = window.innerWidth;
    const cardWidth = 170; // 5% Larger Base Scale Layout
    const cardStep = 190;  // 170px card width + 20px layout gap
    const leftPadding = 60; 

    const targetTranslation = (viewportWidth / 2) - leftPadding - (activeCol * cardStep) - (cardWidth / 2);
    let clampedTranslation = Math.min(0, targetTranslation);

    const totalRowWidth = (totalItems * cardStep) - 20;
    const minTranslation = viewportWidth - 60 - leftPadding - totalRowWidth;

    if (totalRowWidth + leftPadding + 60 <= viewportWidth) {
      return "0px";
    }

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
          const displayTitle = anime.title_english || anime.title;
          const animeType = anime.type || "TV";
          
          // Fallback parsing logic to check if current anime is ongoing
          const statusText = anime.airing ? "AIRING" : "FINISHED";

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
              {/* TOP FLOATING METADATA BADGES */}
              <div className="card-top-badge top-left-badge">
                ⭐ {anime.score ? anime.score.toFixed(1) : "—"}
              </div>
              
              <div className={`card-top-badge top-right-badge badge-${statusText.toLowerCase()}`}>
                {statusText}
              </div>

              {/* BOTTOM METADATA OVERLAY SHEET */}
              <div className="card-info-overlay">
                <div className="card-title" title={displayTitle}>
                  {displayTitle}
                </div>
                
                <div className="card-bottom-row">
                  <span className="card-type-text">{animeType}</span>
                  <span className="card-episodes-text">
                    {anime.episodes ? `EP-${anime.episodes}` : "EP-?"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TvRow;
