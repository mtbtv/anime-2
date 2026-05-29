import React, { useEffect, useRef, useState } from 'react';

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

  const cardRefs = useRef([]);
  const savedCardPositions = useRef({});

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
    const selectedCard = cardRefs.current?.[activeRow]?.[activeCard];

    if (selectedCard) {
      selectedCard.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [activeRow, activeCard]);

  useEffect(() => {
    function handleKey(event) {
      const currentSection = sections[activeRow];
      const currentItems = animeData[currentSection?.title] || [];

      switch (event.key) {
        case 'ArrowRight': {
          const nextCard = Math.min(activeCard + 1, currentItems.length - 1);
          setActiveCard(nextCard);
          savedCardPositions.current[activeRow] = nextCard;
          break;
        }

        case 'ArrowLeft': {
          const nextCard = Math.max(activeCard - 1, 0);
          setActiveCard(nextCard);
          savedCardPositions.current[activeRow] = nextCard;
          break;
        }

        case 'ArrowDown': {
          const nextRow = Math.min(activeRow + 1, sections.length - 1);
          setActiveRow(nextRow);
          setActiveCard(savedCardPositions.current[nextRow] || 0);
          break;
        }

        case 'ArrowUp': {
          const nextRow = Math.max(activeRow - 1, 0);
          setActiveRow(nextRow);
          setActiveCard(savedCardPositions.current[nextRow] || 0);
          break;
        }

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
    <div className='min-h-screen bg-black text-white overflow-hidden py-10'>
      <div className='px-8 mb-12'>
        <h1 className='text-5xl font-black'>Anime TV</h1>
      </div>

      <div className='space-y-12'>
        {sections.map((section, rowIndex) => (
          <div key={section.title}>
            <h2 className='text-2xl font-bold mb-5 px-8'>
              {section.title}
            </h2>

            <div className='flex gap-5 overflow-x-auto overflow-y-visible px-8 py-6 scrollbar-hide scroll-smooth'>
              {(animeData[section.title] || []).map((anime, cardIndex) => {
                const isActive = activeRow === rowIndex && activeCard === cardIndex;

                if (!cardRefs.current[rowIndex]) {
                  cardRefs.current[rowIndex] = [];
                }

                return (
                  <div
                    key={anime.mal_id}
                    ref={(el) => (cardRefs.current[rowIndex][cardIndex] = el)}
                    className={`min-w-[170px] rounded-2xl overflow-hidden bg-zinc-900 transition-all duration-300 flex-shrink-0 ${
                      isActive
                        ? 'scale-110 ring-4 ring-cyan-400 opacity-100 z-30'
                        : 'scale-100 opacity-50'
                    }`}
                  >
                    <img
                      src={anime.images?.jpg?.large_image_url}
                      alt={anime.title}
                      className='w-full h-[250px] object-cover'
                    />

                    <div className='p-3'>
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
    </div>
  );
}
