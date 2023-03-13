import formatTimestamp from '../lib/formatTimestamp'

class Player {
  ////////// Constantes des différents tags HTML
  // Tag audio
  #audioPlayer = document.querySelector('#audio-player')

  // Song infos
  #playerThumbnail = document.querySelector('#player-thumbnail-image')
  #playerSongTitle = document.querySelector('#player-infos-song-title')
  #playerArtistName = document.querySelector('#player-infos-artist-name')

  // Controls
  #playerPrev = document.querySelector('#player-control-previous')
  #playerPlay = document.querySelector('#player-control-play')
  #playerPlayIcon = document.querySelector('#player-control-play .material-icons')
  #playerNext = document.querySelector('#player-control-next')

  // Progress
  #playerTimeCurrent = document.querySelector('#player-time-current')
  #playerTimeDuration = document.querySelector('#player-time-duration')
  #playerProgress = document.querySelector('#player-progress-bar')

  // Logo
  #logo = document.querySelector('#logo')

  ////////// Logique

  // songs contiendra la liste des chansons en cours de lecture, afin de pouvoir se déplacer entre les chansons
  songList = []
  // La chanson en cours de lecture
  currentSong = null

  constructor() {
    // On écoute le clique sur le bouton play et on transmets l'instruction au player
    this.#playerPlay.addEventListener('click', () => {
      if(this.#audioPlayer.paused)
        this.#audioPlayer.play()
      else
        this.#audioPlayer.pause()
    })

    // Bouton précédent. Attention à transmettre proprement la méthode, via une fonction fléchée, autrement le "this"
    // résolvera à l'event et non au "this" de l'instance actuelle de la classe
    this.#playerPrev.addEventListener('click', () => this.playPreviousSong())

    // Bouton suivant. Attention à transmettre proprement la méthode, via une fonction fléchée, autrement le "this"
    // résolvera à l'event et non au "this" de l'instance actuelle de la classe
    this.#playerNext.addEventListener('click', () => this.playNextSong())

    // Lorsque l'on click sur la barre de progression, on change sa valeur et elle émet donc un événement "change" pour
    // avertir de son changement. Comme on a défini la valeur max comme étant la durée totale de la chanson, toute valeur
    // transmise est forcément incluse dans cet interval. On peut alors la passer au player sans problème
    this.#playerProgress.addEventListener('change', (event) => {
      this.#audioPlayer.currentTime = event.currentTarget.value
    })

    // Lorsque nous faison ".src = " sur le player, celui-ci va télécharger la chanson en arrière plan et calculer
    // sa longueur. Lorsque c'est fait, il émet un event "durationchange" pour nous informer qu'il connait maintenant
    // sa durée (en secondes!) et que l'on peut se servir de cette information
    this.#audioPlayer.addEventListener('durationchange', () => {
      // On défini la valeur maximum du slider de la chanson comme étant sa durée en secondes
      this.#playerProgress.max = this.#audioPlayer.duration
      // On affiche la durée totale, grâce à la fonction de formattage du temps
      this.#playerTimeDuration.innerText = formatTimestamp(this.#audioPlayer.duration)
    })

    // Lorsque la chanson est en cours de lecture, l'événement "timeupdate" sera envoyé plusieurs fois par seconde
    // pour avertir de l'avancée dans la lecture. C'est cet événement qui nous permet de bouger la barre de progression
    // au fur et à mesure que la chanson se lit.
    this.#audioPlayer.addEventListener('timeupdate', () => {
      // On récupère la valeur "currentTime" qui est la position dans la chanson au sein du player et on la transmets
      // à la progress bar comme étant sa valeur. La progress bar a comme valeur minimum 0 et comme valeur max la durée
      // totale de la chanson. En lui passant le currrentTime, il sera forcément entre le min et le max et le browser
      // pourra afficher la petite boule au bon endroit
      this.#playerProgress.value = this.#audioPlayer.currentTime
      // On affiche la position de lecture, grâce à la fonction de formattage du temps
      this.#playerTimeCurrent.innerText = formatTimestamp(this.#audioPlayer.currentTime)
    })

    // Lorsque le player se met en lecture, il émet un évent "play" pour annoncer le début de lecture. Dans ce cas,
    // on change l'icône du bouton play à pause
    //
    // Pourquoi faire ça ici et non dans le "click" sur le bouton ? :) Que se passe-t-il si vous utilisez le bouton
    // "play/pause" natif qui se trouve sur votre clavier ? Cela va mettre en pause la chanson, mais l'événement "click"
    // du bouton play/pause ne sera pas émis, donc icône pas mis à jour, car vous avez utilisez votre clavier et
    // non le bouton.
    // En revanche, lorsque votre OS reçoit le click sur le clavier, il trouve l'application qui émet du son (en l'occ.
    // notre browser) et lui demande d'arrêter. Le browser va chercher quel élément audio lis actuellement de la musique
    // et va faire un "audioPlayer.pause()". Les évenements play/pause seront donc transmis et c'est pour cela qu'il est
    // mieux de gérer le changement d'icône ici
    this.#audioPlayer.addEventListener('play', () => this.#updateIcon())

    // Lorsque le player pause la lecture, il émet un évent "pause" pour annoncer le pause de lecture. Dans ce cas,
    // on change l'icône du bouton pause à play
    // voir commentaire précédent
    this.#audioPlayer.addEventListener('pause', () => this.#updateIcon())
  }

  // Lire une chanson sur laquelle on clique
  playSong(song, songs) {
    // On enregistre la chanson en cours de lecture
    this.currentSong = song

    // si un tableau est transmis, on le met à jour. Cela nous permet d'utiliser juste playSong(song) à l'interne,
    // sans devoir le repasser à chaque fois (depuis previous/next, par exemple)
    if(songs)
      this.songList = songs

    // On donne l'url au player et démarre la lecture
    this.#audioPlayer.src = song.audio_url
    this.#audioPlayer.play()

    // Remplacement des différentes informations au sein des tags
    this.#playerSongTitle.innerHTML = song.title
    this.#playerArtistName.innerHTML = song.artist.name
    this.#playerThumbnail.src = song.artist.image_url
  }

  // Lis la chanson suivante, d'après la chanson en cours
  playNextSong() {
    const index = this.songList.indexOf(this.currentSong)
    const newIndex = index + 1
    // On s'assure qu'on n'arrive jamais en dehors du tableau et on reboucle sur le début
    if(newIndex < this.songList.length)
      this.playSong(this.songList[newIndex])
    else
      this.playSong(this.songList[0])
  }

  // Lis la chanson précédente, d'après la chanson en cours
  playPreviousSong() {
    const index = this.songList.indexOf(this.currentSong)
    const newIndex = index - 1
    // On s'assure qu'on n'arrive jamais en dehors du tableau et on reboucle sur la fin
    if(newIndex >= 0)
      this.playSong(this.songList[newIndex])
    else
      this.playSong(this.songList[this.songList.length - 1])
  }

  #updateIcon() {
    if(this.#audioPlayer.paused) {
      this.#playerPlayIcon.innerHTML = 'play_arrow'

      // On arrête d'animer le logo de l'application lorsqu'aucune chanson ne se lit, pour moins de fancyness
      this.#logo.classList.remove('animated')

    } else {
      this.#playerPlayIcon.innerHTML = 'pause'

      // On anime le logo de l'application lorsqu'une chanson se lit, pour plus de fancyness
      this.#logo.classList.add('animated')
    }
  }
}

const playerSingleton = new Player()

export default playerSingleton
