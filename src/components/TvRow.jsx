import React from "react";
import AnimeCard from "./AnimeCard";

const TvRow = ({ row, rowIndex, activeRow, activeCol }) => {
  const isRowFocused = activeRow === rowIndex;
  const horizontalOffset = isRowFocused ? activeCol * -224 : 0;

  return (
    <div className={`tv-row ${isRowFocused ? "active-row" : ""}`}>
      <h2>{row.title}</h2>
      <div 
        className="cards-container"
        style={{ transform: `translate3d(${horizontalOffset}px, 0px, 0px)` }}
      >
        {row.items.map((anime, colIndex) => {
          const isCardFocused = isRowFocused && activeCol === colIndex;
          return (
            <AnimeCard
              key={anime.mal_id}
              anime={anime}
              isFocused={isCardFocused}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TvRow;
