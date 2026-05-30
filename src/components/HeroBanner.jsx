import React, { useState, useEffect } from "react";

const HeroBanner = ({ upcomingAnime }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto Scroll logic: Change slide every 5 seconds
  useEffect(() => {
    if (!upcomingAnime || upcomingAnime.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % upcomingAnime.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [upcomingAnime]);

  if (!upcomingAnime || upcomingAnime.length === 0) return null;

  const currentAnime = upcomingAnime[currentIndex];

  return (
    <div className="hero-banner">
      {/* Cinematic Backdrop Image */}
      <div 
        className="hero-backdrop"
        style={{ backgroundImage: `url(${currentAnime.images.jpg.large_image_url})` }}
      />
      {/* Dark vignette tint overlays for remote text readability */}
      <div className="hero-vignette" />

      {/* Hero Meta Content */}
      <div className="hero-content">
        <span className="hero-tag">UPCOMING BLOCKBUSTER</span>
        <h1 className="hero-title">{currentAnime.title}</h1>
        
        <div className="hero-badges">
          <span className="badge rating-badge">{currentAnime.rating || "Unrated"}</span>
          <span className="badge status-badge">{currentAnime.status || "Upcoming"}</span>
        </div>

        <p className="hero-description">
          {currentAnime.synopsis || "No synopsis available for this upcoming release."}
        </p>
      </div>
    </div>
  );
};

export default React.memo(HeroBanner);
