import { getArtists } from '../api'

 // On obtient l'élément DOM qui nous servira de template pour un élément de la liste d'artistes
const artistListItemTemplate = document.querySelector('#artist-list-item-template')

// Element DOM de la liste à manipuler
const artistList =  document.querySelector('.artist-list')

// Génère le HTML nécessaire pour afficher la liste des artistes
const renderArtists = () => {
  // On vide la liste de ses anciennes informations, pour en ajouter de nouvelles à jour
  artistList.replaceChildren()

  // On récupère les artistes depuis l'API
  getArtists()
    .then((artists) => {
      // On itère sur chacun des artistes récupérés depuis l'API
      artists.forEach((artist) => {
        // Créer une copie du template et de son contenu pour avoir un nouvelle élément vierge
        // que l'on stock dans la variable newArtistItem
        const newArtistItem = artistListItemTemplate.content.cloneNode(true)

        // On modifie l'url du lien qui se trouve à l'intérieur, pour avoir une URL du style #artists-12
        newArtistItem.querySelector('a').href = '#artists-' + artist.id

        // On rempli le titre de l'artiste dans ce nouvel élément, en sélectionnant l'élément
        // artist-list-item-title à l'intérieur (!dans newArtistItem! Pas dans document)
        newArtistItem.querySelector('.artist-list-item-title').innerHTML = artist.name

        // On modifie le src de l'image qui se trouve à l'intérieur, pour afficher la cover de l'artiste
        newArtistItem.querySelector('img').src = artist.image_url

        // On l'ajoute à la liste d'artistes
        artistList.append(newArtistItem)
      })
    })
}

export default renderArtists
