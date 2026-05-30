import React, { useState, useEffect } from "react";
import { fetchTvHomeData } from "../api/jikan";
import TvRow from "../components/TvRow";

const Home = () => {
  const [rows, setRows] = useState([]);
  const [activeRow, setActiveRow] = useState(0);
  const [activeCol, setActiveCol] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load configuration from API Layer
  useEffect(() => {
    let isMounted = true;
    fetchTvHomeData().then((data) => {
      if (isMounted) {
        setRows(data);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  // TV Remote Key Handler
  useEffect(() => {
    if (rows.length === 0) return;

    const handleKeyDown = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
        e.preventDefault();
      }

      const currentItems = rows[activeRow]?.items || [];

      switch (e.key) {
        case "ArrowDown":
          if (activeRow < rows.length - 1) {
            setActiveRow((prev) => prev + 1);
            setActiveCol(0);
          }
          break;
        case "ArrowUp":
          if (activeRow > 0) {
            setActiveRow((prev) => prev - 1);
            setActiveCol(0);
          }
          break;
        case "ArrowRight":
          if (activeCol < currentItems.length - 1) {
            setActiveCol((prev) => prev + 1);
          }
          break;
        case "ArrowLeft":
          if (activeCol > 0) {
            setActiveCol((prev) => prev - 1);
          }
          break;
        case "Enter":
          const selection = currentItems[activeCol];
          if (selection) {
            alert(`Streaming: ${selection.title}`);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeRow, activeCol, rows]);

  if (loading) {
    return <div style={{ color: "white", padding: "60px", fontSize: "24px" }}>Loading Anime Grid...</div>;
  }

  const verticalOffset = activeRow * -390; 
  const currentFocusedAnime = rows[activeRow]?.items[activeCol];

  return (
    <div className="tv-viewport">
      <div className="tv-header">
        <h1>ANIME STREAM TV</h1>
      </div>

      <div 
        className="rows-wrapper"
        style={{ transform: `translate3d(0px, ${verticalOffset}px, 0px)` }}
      >
        {rows.map((row, rowIndex) => (
          <TvRow
            key={rowIndex}
            row={row}
            rowIndex={rowIndex}
            activeRow={activeRow}
            activeCol={activeCol}
          />
        ))}
      </div>

      {currentFocusedAnime && (
        <div className="active-meta">
          <h3>{currentFocusedAnime.title}</h3>
          <p>{currentFocusedAnime.synopsis || "No synopsis available."}</p>
        </div>
      )}
    </div>
  );
};

export default Home;          results[section.title] = [];
        }
      }

      setAnimeData(results);
    }

    loadData();
  }, []);

  const focusCard = (row, card) => {
    const element = cardRefs.current?.[row]?.[card];

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "center",
    });
  };

  useEffect(() => {
    focusCard(activeRow, activeCard);
  }, [activeRow, activeCard]);

  useEffect(() => {
    const handleKey = (event) => {
      const currentItems =
        animeData[sections[activeRow]?.title] || [];

      switch (event.key) {
        case "ArrowRight":
          setActiveCard((prev) =>
            Math.min(prev + 1, currentItems.length - 1)
          );
          break;

        case "ArrowLeft":
          setActiveCard((prev) =>
            Math.max(prev - 1, 0)
          );
          break;

        case "ArrowDown": {
          const nextRow = Math.min(
            activeRow + 1,
            sections.length - 1
          );

          const nextItems =
            animeData[sections[nextRow]?.title] || [];

          setActiveRow(nextRow);

          setActiveCard((prev) =>
            Math.min(prev, nextItems.length - 1)
          );

          break;
        }

        case "ArrowUp": {
          const previousRow = Math.max(
            activeRow - 1,
            0
          );

          const previousItems =
            animeData[sections[previousRow]?.title] || [];

          setActiveRow(previousRow);

          setActiveCard((prev) =>
            Math.min(prev, previousItems.length - 1)
          );

          break;
        }

        case "Enter":
          console.log(
            "Selected",
            activeRow,
            activeCard
          );
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKey);

    return () =>
      window.removeEventListener("keydown", handleKey);
  }, [activeRow, activeCard, animeData]);

  return (
    <div className="min-h-screen bg-black text-white py-8">
      <div className="px-8 mb-10">
        <h1 className="text-5xl font-black">
          Anime TV
        </h1>
      </div>

      <div className="space-y-12 select-none">
        {sections.map((section, rowIndex) => (
          <div
            className="select-none"
            key={section.title}
            ref={(el) =>
              (rowRefs.current[rowIndex] = el)
            }
          >
            <h2 className="text-2xl font-bold mb-4 px-8">
              {section.title}
            </h2>

            <div className="flex gap-5 overflow-x-auto px-8 py-5 scroll-smooth">
              {(animeData[section.title] || []).map(
                (anime, cardIndex) => {
                  const isFocused =
                    activeRow === rowIndex &&
                    activeCard === cardIndex;

                  if (!cardRefs.current[rowIndex]) {
                    cardRefs.current[rowIndex] = [];
                  }

                  return (
                    <div
                      key={anime.mal_id}
                      ref={(el) =>
                        (cardRefs.current[rowIndex][
                          cardIndex
                        ] = el)
                      }
                      className={`
                        relative
                        min-w-[190px]
                        h-[285px]
                        flex-shrink-0
                        rounded-2xl
                        overflow-hidden
                        transition-all
                        duration-300
                        ${
                          isFocused
                            ? "scale-110 ring-4 ring-cyan-400 z-30"
                            : "opacity-60"
                        }
                      `}
                    >
                      <img
                        src={
                          anime.images?.jpg
                            ?.large_image_url
                        }
                        alt={anime.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="font-bold text-sm line-clamp-2 mb-2">
                          {anime.title}
                        </h3>

                        <div className="text-xs text-gray-200">
                          ⭐ {anime.score || "N/A"}
                        </div>

                        <div className="text-xs text-gray-300">
                          {anime.episodes || "?"} EP
                        </div>

                        <div className="text-xs text-cyan-300">
                          {anime.status}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
    }
  }, [activeRow, activeCard]);

  useEffect(() => {
    function handleKey(event) {
      const currentItems = animeData[sections[activeRow]?.title] || [];

      switch (event.key) {
        case 'ArrowRight': {
          const next = Math.min(activeCard + 1, currentItems.length - 1);
          savedCardPositions.current[activeRow] = next;
          setActiveCard(next);
          break;
        }
        case 'ArrowLeft': {
          const next = Math.max(activeCard - 1, 0);
          savedCardPositions.current[activeRow] = next;
          setActiveCard(next);
          break;
        }
        case 'ArrowDown': {
          const row = Math.min(activeRow + 1, sections.length - 1);
          setActiveRow(row);
          setActiveCard(savedCardPositions.current[row] || 0);
          break;
        }
        case 'ArrowUp': {
          const row = Math.max(activeRow - 1, 0);
          setActiveRow(row);
          setActiveCard(savedCardPositions.current[row] || 0);
          break;
        }
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeRow, activeCard, animeData]);

  return (
    <div className='min-h-screen bg-black text-white py-10'>
      <div className='px-8 mb-12'>
        <h1 className='text-5xl font-black'>Anime TV</h1>
      </div>

      <div className='space-y-12'>
        {sections.map((section, rowIndex) => (
          <div key={section.title}>
            <h2 className='text-2xl font-bold mb-5 px-8'>{section.title}</h2>

            <div className='flex gap-5 overflow-x-auto px-8 py-6 scroll-smooth'>
              {(animeData[section.title] || []).map((anime, cardIndex) => {
                const isActive = activeRow === rowIndex && activeCard === cardIndex;

                if (!cardRefs.current[rowIndex]) cardRefs.current[rowIndex] = [];

                return (
                  <div
                    key={anime.mal_id}
                    ref={(el) => (cardRefs.current[rowIndex][cardIndex] = el)}
                    className={`min-w-[170px] flex-shrink-0 rounded-2xl overflow-hidden bg-zinc-900 transition-all duration-300 ${isActive ? 'scale-110 ring-4 ring-cyan-400 opacity-100 z-30' : 'opacity-70'}`}
                  >
                    <img src={anime.images?.jpg?.large_image_url} alt={anime.title} className='w-full h-[250px] object-cover' />
                    <div className='p-3'>
                      <h3 className='font-semibold text-sm line-clamp-2'>{anime.title}</h3>
                      <p className='text-xs text-gray-400 mt-2'>⭐ {anime.score || 'N/A'}</p>
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
