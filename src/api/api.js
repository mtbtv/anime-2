const BASE_URL = "https://api.jikan.moe/v4";

export const fetchTvHomeData = async () => {
  try {
    const [trendingRes, popularRes] = await Promise.all([
      fetch(`${BASE_URL}/seasons/now?limit=12`),
      fetch(`${BASE_URL}/top/anime?limit=12`)
    ]);

    if (!trendingRes.ok || !popularRes.ok) {
      throw new Error("Failed to fetch data from Jikan API");
    }

    const trendingData = await trendingRes.json();
    const popularData = await popularRes.json();

    return [
      { title: "Trending This Season", items: trendingData.data || [] },
      { title: "Top Rated Shows", items: popularData.data || [] }
    ];
  } catch (error) {
    console.error("Jikan API Fetch Error:", error);
    return [];
  }
};        page: 1
      }
    })
  });

  const json = await response.json();
  return json.data.Page.media;
}
