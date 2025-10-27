const axios = require('axios');
const config = require('../config');

class TMDBService {
  constructor() {
    this.baseURL = config.tmdb.baseUrl;
    this.apiKey = config.tmdb.apiKey;
    this.imageBaseUrl = config.tmdb.imageBaseUrl;
    
    if (!this.apiKey) {
      console.warn('TMDB API key not configured. Movie data features will be limited.');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      params: {
        api_key: this.apiKey,
      },
      timeout: 10000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('TMDB API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  // Get trending movies and TV shows
  async getTrending(mediaType = 'all', timeWindow = 'day') {
    try {
      const response = await this.client.get(`/trending/${mediaType}/${timeWindow}`);
      return this.formatResults(response.data.results);
    } catch (error) {
      throw new Error(`Failed to fetch trending ${mediaType}: ${error.message}`);
    }
  }

  // Search for movies and TV shows
  async search(query, page = 1) {
    try {
      const [movieResults, tvResults] = await Promise.all([
        this.client.get('/search/movie', { params: { query, page } }),
        this.client.get('/search/tv', { params: { query, page } }),
      ]);

      const movies = this.formatResults(movieResults.data.results, 'movie');
      const tvShows = this.formatResults(tvResults.data.results, 'tv');

      return {
        results: [...movies, ...tvShows],
        totalResults: movieResults.data.total_results + tvResults.data.total_results,
        totalPages: Math.max(movieResults.data.total_pages, tvResults.data.total_pages),
      };
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  // Get movie details
  async getMovieDetails(movieId) {
    try {
      const [details, credits, videos] = await Promise.all([
        this.client.get(`/movie/${movieId}`),
        this.client.get(`/movie/${movieId}/credits`),
        this.client.get(`/movie/${movieId}/videos`),
      ]);

      return this.formatMovieDetails(details.data, credits.data, videos.data);
    } catch (error) {
      throw new Error(`Failed to fetch movie details: ${error.message}`);
    }
  }

  // Get TV show details
  async getTVDetails(tvId) {
    try {
      const [details, credits, videos] = await Promise.all([
        this.client.get(`/tv/${tvId}`),
        this.client.get(`/tv/${tvId}/credits`),
        this.client.get(`/tv/${tvId}/videos`),
      ]);

      return this.formatTVDetails(details.data, credits.data, videos.data);
    } catch (error) {
      throw new Error(`Failed to fetch TV show details: ${error.message}`);
    }
  }

  // Get popular movies
  async getPopularMovies(page = 1) {
    try {
      const response = await this.client.get('/movie/popular', { params: { page } });
      return {
        results: this.formatResults(response.data.results, 'movie'),
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch (error) {
      throw new Error(`Failed to fetch popular movies: ${error.message}`);
    }
  }

  // Get popular TV shows
  async getPopularTV(page = 1) {
    try {
      const response = await this.client.get('/tv/popular', { params: { page } });
      return {
        results: this.formatResults(response.data.results, 'tv'),
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };
    } catch (error) {
      throw new Error(`Failed to fetch popular TV shows: ${error.message}`);
    }
  }

  // Get genre list
  async getGenres() {
    try {
      const [movieGenres, tvGenres] = await Promise.all([
        this.client.get('/genre/movie/list'),
        this.client.get('/genre/tv/list'),
      ]);

      const allGenres = [...movieGenres.data.genres, ...tvGenres.data.genres];
      const uniqueGenres = allGenres.reduce((acc, genre) => {
        if (!acc.find(g => g.id === genre.id)) {
          acc.push(genre);
        }
        return acc;
      }, []);

      return uniqueGenres;
    } catch (error) {
      throw new Error(`Failed to fetch genres: ${error.message}`);
    }
  }

  // Format search results
  formatResults(results, forceMediaType = null) {
    return results.map(item => ({
      id: item.id,
      title: item.title || item.name,
      overview: item.overview,
      posterPath: item.poster_path ? `${this.imageBaseUrl}${item.poster_path}` : null,
      backdropPath: item.backdrop_path ? `${this.imageBaseUrl}${item.backdrop_path}` : null,
      releaseDate: item.release_date || item.first_air_date,
      rating: item.vote_average,
      voteCount: item.vote_count,
      popularity: item.popularity,
      genreIds: item.genre_ids || [],
      mediaType: forceMediaType || item.media_type || (item.title ? 'movie' : 'tv'),
      adult: item.adult || false,
    }));
  }

  // Format movie details
  formatMovieDetails(movie, credits, videos) {
    const trailer = videos.results.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );

    return {
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path ? `${this.imageBaseUrl}${movie.poster_path}` : null,
      backdropPath: movie.backdrop_path ? `${this.imageBaseUrl}${movie.backdrop_path}` : null,
      releaseDate: movie.release_date,
      runtime: movie.runtime,
      rating: movie.vote_average,
      voteCount: movie.vote_count,
      popularity: movie.popularity,
      genres: movie.genres,
      budget: movie.budget,
      revenue: movie.revenue,
      status: movie.status,
      tagline: movie.tagline,
      homepage: movie.homepage,
      imdbId: movie.imdb_id,
      originalLanguage: movie.original_language,
      productionCompanies: movie.production_companies,
      productionCountries: movie.production_countries,
      spokenLanguages: movie.spoken_languages,
      director: credits.crew.find(person => person.job === 'Director')?.name,
      cast: credits.cast.slice(0, 10).map(actor => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path ? `${this.imageBaseUrl}${actor.profile_path}` : null,
      })),
      trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      mediaType: 'movie',
    };
  }

  // Format TV show details
  formatTVDetails(tv, credits, videos) {
    const trailer = videos.results.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    );

    return {
      id: tv.id,
      title: tv.name,
      overview: tv.overview,
      posterPath: tv.poster_path ? `${this.imageBaseUrl}${tv.poster_path}` : null,
      backdropPath: tv.backdrop_path ? `${this.imageBaseUrl}${tv.backdrop_path}` : null,
      firstAirDate: tv.first_air_date,
      lastAirDate: tv.last_air_date,
      numberOfSeasons: tv.number_of_seasons,
      numberOfEpisodes: tv.number_of_episodes,
      episodeRunTime: tv.episode_run_time?.[0] || 45,
      rating: tv.vote_average,
      voteCount: tv.vote_count,
      popularity: tv.popularity,
      genres: tv.genres,
      status: tv.status,
      tagline: tv.tagline,
      homepage: tv.homepage,
      originalLanguage: tv.original_language,
      productionCompanies: tv.production_companies,
      networks: tv.networks,
      creators: tv.created_by?.map(creator => creator.name),
      cast: credits.cast.slice(0, 10).map(actor => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path ? `${this.imageBaseUrl}${actor.profile_path}` : null,
      })),
      trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      mediaType: 'tv',
    };
  }
}

module.exports = new TMDBService();
