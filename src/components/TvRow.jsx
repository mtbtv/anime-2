import React from "react";

const TvRow = ({ row, rowIndex, activeRow, activeCol }) => {
  const isActiveRow = rowIndex === activeRow;

  // NETFLIX BOUNDARY CLAMPING ENGINE
  const calculateHorizontalOffset = () => {
    if (!isActiveRow) return "0px";
    
    const totalItems = row.items?.length || 0;
    if (totalItems === 0) return "0px";

    const viewportWidth = window.innerWidth;
    const cardStep = 175;  
    const cardWidth = 155;
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
              <div className="card-info-overlay">
                <div className="card-title" title={displayTitle}>
                  {displayTitle}
                </div>
                
                {/* Clean 3-Item Metadata Grid */}
                <div className="card-meta-grid">
                  <span className="meta-score">⭐ {anime.score ? anime.score.toFixed(1) : "—"}</span>
                  
                  {/* Colorful dynamic type tag */}
                  <span className={`meta-badge type-tag tag-${animeType.toLowerCase()}`}>
                    {animeType}
                  </span>
                  
                  <span className="meta-badge episode-tag">
                    {anime.episodes ? `${anime.episodes} EP` : "Unk"}
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
