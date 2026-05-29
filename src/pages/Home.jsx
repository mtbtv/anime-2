import React, { useEffect, useState } from 'react';

const sections = [
  {
    title: 'Trending Anime',
    endpoint: 'https://api.jikan.moe/v4/top/anime?filter=airing'
  },
  {
    title: 'Popular Anime',
    endpoint: 'https://api.jikan.moe/v4/top/anime'
  },
  {
    title: 'Upcoming Anime',
    endpoint: 'https://api.jikan.moe/v4/seasons/upcoming'
  }
];

export default function Home() {
  const [animeData, setAnimeData] = useState({});
  const [activeRow, setActiveRow] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    async function loadData() {
      const results = {};

      for (const section of sections) {
        const response = await fetch(section.endpoint);
        const json = await response.json();
        results[section.title] = json.data || [];
      }

      setAnimeData(results);
    }

    loadData();
  }, []);

  useEffect(() => {
    function handleKey(event) {
      const currentSection = sections[activeRow];
      const currentItems = animeData[currentSection?.title] || [];

      switch (event.key) {
        case 'ArrowRight':
          setActiveCard((prev) => Math.min(prev + 1, currentItems.length - 1));
          break;

        case 'ArrowLeft':
          setActiveCard((prev) => Math.max(prev - 1, 0));
          break;

        case 'ArrowDown':
          setActiveRow((prev) => Math.min(prev + 1, sections.length - 1));
          setActiveCard(0);
          break;

        case 'ArrowUp':
          setActiveRow((prev) => Math.max(prev - 1, 0));
          setActiveCard(0);
          break;

        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [activeRow, activeCard, animeData]);

  return (
    <div className='min-h-screen bg-black text-white px-6 py-10 overflow-hidden'>
      <h1 className='text-5xl font-black mb-10'>Anime TV</h1>

      {sections.map((section, rowIndex) => (
        <div key={section.title} className='mb-12'>
          <h2 className='text-2xl font-bold mb-5'>
            {section.title}
          </h2>

          <div className='flex gap-4 overflow-x-auto pb-2 scrollbar-hide'>
            {(animeData[section.title] || []).map((anime, cardIndex) => {
              const isActive = activeRow === rowIndex && activeCard === cardIndex;

              return (
                <div
                  key={anime.mal_id}
                  className={`min-w-[170px] rounded-2xl overflow-hidden transition-all duration-200 ${
                    isActive
                      ? 'scale-110 ring-4 ring-cyan-400 z-20'
                      : 'scale-100 opacity-80'
                  }`}
                >
                  <img
                    src={anime.images?.jpg?.large_image_url}
                    alt={anime.title}
                    className='w-full h-[250px] object-cover'
                  />

                  <div className='p-3 bg-zinc-900'>
                    <h3 className='font-semibold text-sm line-clamp-2'>
                      {anime.title}
                    </h3>

                    <p className='text-xs text-gray-400 mt-2'>
                      ⭐ {anime.score || 'N/A'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
