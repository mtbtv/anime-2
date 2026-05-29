import React, { useEffect, useState } from 'react';
import { fetchAnimeByCategory, sections } from '../api/anilist';

export default function Home() {
  const [animeData, setAnimeData] = useState({});

  useEffect(() => {
    async function loadData() {
      const results = {};

      for (const section of sections) {
        results[section.key] = await fetchAnimeByCategory(section.key);
      }

      setAnimeData(results);
    }

    loadData();
  }, []);

  return (
    <div className='min-h-screen bg-black text-white px-6 py-10'>
      <h1 className='text-5xl font-black mb-10'>Anime TV</h1>

      {sections.map((section) => (
        <div key={section.key} className='mb-12'>
          <h2 className='text-2xl font-bold mb-5'>
            {section.title}
          </h2>

          <div className='flex gap-4 overflow-x-auto pb-2'>
            {(animeData[section.key] || []).map((anime) => (
              <div
                key={anime.id}
                className='min-w-[180px] bg-zinc-900 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300'
              >
                <img
                  src={anime.coverImage?.extraLarge}
                  alt={anime.title?.english}
                  className='w-full h-[250px] object-cover'
                />

                <div className='p-3'>
                  <h3 className='font-semibold text-sm line-clamp-2'>
                    {anime.title?.english || anime.title?.romaji}
                  </h3>

                  <p className='text-xs text-gray-400 mt-2'>
                    ⭐ {anime.averageScore || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
