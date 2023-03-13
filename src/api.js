// URL de base du serveur
const BASE_URL = 'https://webmob-ui-22-spotlified.herokuapp.com'

// Fonction loadJson utilisée à l'interne. Elle s'occupe de charger l'url passée en paramètre et convertir
// son résultat en json
const loadJson = (url) => {
  return fetch(url)
    .then((response) => response.json())
}

// Retourne une liste d'artistes
const getArtists = () => {
  return loadJson(`${BASE_URL}/api/artists`)
}

// Retourne la liste des chansons d'un ariste
const getSongsForArtist = (id) => {
  return loadJson(`${BASE_URL}/api/artists/${id}/songs`)
}

// Retourne un résultat de recherche
const searchSongs = (query) => {
  return loadJson(`${BASE_URL}/api/songs/search/${encodeURIComponent(query)}`)
}

export { getArtists, getSongsForArtist, searchSongs }
