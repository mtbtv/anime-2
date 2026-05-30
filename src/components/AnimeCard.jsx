import React from "react";

const AnimeCard = ({ anime, isFocused }) => {
  return (
    <div
      className={`anime-card ${isFocused ? "focused" : ""}`}
      style={{ backgroundImage: `url(${anime.images.jpg.large_image_url})` }}
    />
  );
};

export default React.memo(AnimeCard); 
// React.memo prevents unnecessary re-renders while navigating other rows
