const BASE_URL = "https://api.jikan.moe/v4";

export const fetchTvHomeData = async () => {
  try {
    const [trendingRes, popularRes, upcomingRes] = await Promise.all([
      fetch(`${BASE_URL}/seasons/now?limit=12`),
      fetch(`${BASE_URL}/top/anime?limit=12`),
      fetch(`${BASE_URL}/seasons/upcoming?limit=12`) // Fetching 6 upcoming shows for the banner
    ]);

    if (!trendingRes.ok || !popularRes.ok || !upcomingRes.ok) {
      throw new Error("Failed to fetch data from Jikan API");
    }

    const trendingData = await trendingRes.json();
    const popularData = await popularRes.json();
    const upcomingData = await upcomingRes.json();

    return {
      upcoming: upcomingData.data || [],
      rows: [
        { title: "Trending This Season", items: trendingData.data || [] },
        { title: "Top Rated Shows", items: popularData.data || [] }
      ]
    };
  } catch (error) {
    console.error("Jikan API Fetch Error:", error);
    return { upcoming: [], rows: [] };
  }
};
