import React, { useState } from 'react';
import { API } from 'aws-amplify';
import axios from 'axios';

const App = () => {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const fetchSongs = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/playlists/<YOUR_PLAYLIST_ID>/tracks', {
        headers: {
          Authorization: 'Bearer <YOUR_SPOTIFY_API_ACCESS_TOKEN>',
        },
      });

      const tracks = response.data.items;
      const songData = await Promise.all(
        tracks.map(async (track) => {
          const { id, name, artists, album, preview_url } = track.track;
          const artist = artists[0].name;
          const releaseDate = album.release_date;
          const imageUrl = album.images[0].url;

          return { id, name, artist, album: album.name, releaseDate, imageUrl, previewUrl: preview_url };
        })
      );

      setSongs(songData);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleStartGame = () => {
    setShowAnswer(false);
    fetchSongs();
  };

  const handlePlaySong = () => {
    const audioPlayer = new Audio(songs[currentSongIndex].previewUrl);
    audioPlayer.play();
  };

  const handleNextSong = () => {
    setShowAnswer(false);
    setCurrentSongIndex((prevIndex) => prevIndex + 1);
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const renderSongDetails = () => {
    const { artist, album, releaseDate, imageUrl } = songs[currentSongIndex];
    return (
      <div>
        <img src={imageUrl} alt="Album Art" />
        <p>Artist: {artist}</p>
        <p>Album: {album}</p>
        <p>Release Date: {releaseDate}</p>
      </div>
    );
  };

  return (
    <div className="App">
      {songs.length === 0 ? (
        <button onClick={handleStartGame}>Start Game</button>
      ) : (
        <>
          {currentSongIndex < songs.length && (
            <>
              <button onClick={handlePlaySong}>Play Song</button>
              {showAnswer && renderSongDetails()}
              {!showAnswer && <button onClick={handleRevealAnswer}>Reveal Answer</button>}
              {showAnswer && currentSongIndex < songs.length - 1 ? (
                <button onClick={handleNextSong}>Next Song</button>
              ) : (
                <button onClick={handleStartGame}>Start Over</button>
              )}
