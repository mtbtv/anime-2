export const ANILIST_API = 'https://graphql.anilist.co';

export const sections = [
  { key: 'TRENDING_DESC', title: 'Trending Now' },
  { key: 'POPULARITY_DESC', title: 'Popular Anime' },
  { key: 'SCORE_DESC', title: 'Top Rated Anime' },
  { key: 'FAVOURITES_DESC', title: 'Fan Favorites' },
  { key: 'START_DATE_DESC', title: 'Latest Releases' },
];

export const animeQuery = `
query ($sort: [MediaSort], $page: Int) {
  Page(page: $page, perPage: 20) {
    media(type: ANIME, sort: $sort, isAdult: false) {
      id
      title { romaji english }
      bannerImage
      coverImage { extraLarge }
      averageScore
      episodes
      genres
      description(asHtml: false)
    }
  }
}`;

export async function fetchAnimeByCategory(sortKey) {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: animeQuery,
      variables: {
        sort: [sortKey],
        page: 1
      }
    })
  });

  const json = await response.json();
  return json.data.Page.media;
}
