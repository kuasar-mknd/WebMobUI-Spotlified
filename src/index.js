import {getArtist, getArtists, getSongsForArtist} from './api'

const afficherSection = async (hash) => {
    if (hash == '') hash = '#home'


    // Supprime/Ajoute la classe active sur la section
    // On va chercher le lien actuellement affiché (n'importe quel lien qui a une classe active)
    document.querySelector(`nav a.active`)?.classList.remove('active')
    // On va chercher le lien avec pour url le hash en cours (car window.location.hash est égal au href du lien)
    // Exemple: <a href="#player">...</a> ===>>> window.location.hash vaudra '#player'
    document.querySelector(`nav a[href="${hash}"]`)?.classList.add('active')

    hash = hash.split('-')

    switch (hash[0]) {
        case '#artists':
            console.log('---------------------------------------------')
            console.log('👩‍🎨 Section artiste !')
            console.log('---------------------------------------------')

            if (hash[1]) {
                const list = document.querySelector('.list')
                list.replaceChildren()

              //récupérer l'artiste
                const artist = await getArtist(hash[1])

              //ajouter le nom de l'artiste et du lien vers la liste des artistes
                const artistName = document.querySelector('#element-vide-a-copier-artistName').content.cloneNode(true)
                console.log(artistName)
                artistName.querySelector('a').href = `#artists`
                artistName.querySelector('a').innerHTML = "Artistes > "
                console.log(artist.name)
                artistName.querySelector('a').after(artist.name)
                console.log(artistName)
                list.append(artistName)

              // charger les chansons de l'artiste
                const artistSongs = await getSongsForArtist(hash[1])
                console.log(artistSongs)

                const elementVideAcopier = document.querySelector('#element-vide-a-copier-listSong')


                artistSongs.forEach((song) => {
                    const lacopieARemplir = elementVideAcopier.content.cloneNode(true)
                    lacopieARemplir.querySelector('.list-item-title').innerHTML = song.title

                    list.append(lacopieARemplir)
                })
                hash = '#list'

            } else {
                // vider la liste
                // list.replaceChildren()

                // charger artistes depuis api
                const artists = await getArtists()

                const elementVideAcopier = document.querySelector('#element-vide-a-copier')
                const list = document.querySelector('.artist-list')
                list.replaceChildren()

                console.log(artists)

                artists.forEach((artiste) => {
                    const lacopieARemplir = elementVideAcopier.content.cloneNode(true)

                    lacopieARemplir.querySelector('.artist-list-item-title').innerHTML = artiste.name
                    lacopieARemplir.querySelector('img').src = artiste.image_url

                    //ajout hash pour chaque artiste
                    lacopieARemplir.querySelector('a').href = `#artists-${artiste.id}`

                    list.append(lacopieARemplir)
                })
            }
            break;

        case '#favorites':
            hash = '#list'
            break;
    }

    // Comme pour le menu, on enlève la classe active à la section en cours
    document.querySelector(`section.active`)?.classList.remove('active')
    // et on essaie de trouver la section correspondante et l'afficher, en y ajoutant la classe active
    document.querySelector(`${hash}-section`)?.classList.add('active')
}

window.addEventListener('hashchange', () => afficherSection(window.location.hash))

afficherSection(window.location.hash)
