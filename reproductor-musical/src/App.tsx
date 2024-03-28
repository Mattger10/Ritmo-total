import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Reproductor from "./Components/Reproductor";
import ReproductorArtists from "./Components/ReproductorArtists";
import PagRockNacional from "./Components/PagRockNacional";
import ReproductorRock from "./Components/ReproductorRock";
import ReproductorFavoritos from "./Components/ReproductorFavoritos";
import rocknacional from "./Components/Rocknacional.json";
import recommended from "./Components/recommended.json";
import artistas from "./Components/artists.json";
import Recommended from "./Components/recommended";
import ResponsiveAppBar from "./Components/ResponsiveAppBar";
import Artistas from "./Components/artist-slider";
import ArtistasDetails from "./Components/ArtistDetails";
import styled from "styled-components";
import SearchResults from "./Components/SearchResults";
import Favoritos from "./Components/Favoritos";

interface Song {
  songName: string;
  duration: string;
  number: string;
  artista: string;
  artists_evolved: string[];
  icon: string;
  album: string;
  song_url: string;
}

interface Data {
  songs: Song[];
  name?: string;
  bio?: string;
  photo_url?: string;
}

export function App() {
  const [seleccionarCancion, setSeleccionarCancion] = useState<string | null>(
    null
  );
  const [showReproductor, setShowReproductor] = useState(false);
  const [, setSelectedSong] = useState<string>("");
  const [favoritos] = useState<string[]>(() => {
    const storedFavoritos = localStorage.getItem("favoritos");
    return storedFavoritos ? JSON.parse(storedFavoritos) : [];
  });

  const [, setShowReproductorArtists] = useState(false);
  const [, setShowReproductorRock] = useState(false);
  const [, setShowReproductorRecommended] = useState(false);
  const [mostrarReproductorFavoritos, setMostrarReproductorFavoritos] =
    useState(false);
  const [, setCurrentSong] = useState<Song | null>(null);

  const allData: Data[] = [...artistas, ...recommended, ...rocknacional];
  const [searchResults, setSearchResults] = useState<Data[]>(allData);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchResults(allData); // Mostrar todos los datos sin filtrar
      return;
    }

    // Conjunto para realizar un seguimiento de los nombres de las canciones únicas
    const uniqueSongNames = new Set<string>();

    // Filtrar todas las canciones que coincidan con el término de búsqueda en todos los datos
    const matchedSongs: Song[] = [];

    allData.forEach((data) => {
      data.songs.forEach((song) => {
        const lowerCaseSongName = song.songName.toLowerCase();
        const lowerCaseArtista = song.artista?.toLowerCase() || "";
        const lowerCaseArtistsEvolved =
          song.artists_evolved?.map((artist) => artist.toLowerCase()) || [];
        const searchTermLower = term.toLowerCase();

        const isArtistEvolvedMatch = lowerCaseArtistsEvolved.some((artist) =>
          artist.includes(searchTermLower)
        );

        if (
          (lowerCaseSongName.includes(searchTermLower) ||
            lowerCaseArtista.includes(searchTermLower) ||
            isArtistEvolvedMatch) &&
          !uniqueSongNames.has(lowerCaseSongName)
        ) {
          uniqueSongNames.add(lowerCaseSongName); // Agregar el nombre de la canción al conjunto de canciones únicas
          matchedSongs.push(song); // Agregar la canción al resultado si es única
        }
      });
    });

    // Construir los resultados de búsqueda combinando las canciones coincidentes con sus datos respectivos
    const combinedResults: Data[] = allData
      .map((data) => ({
        ...data,
        songs: data.songs.filter((song) => matchedSongs.includes(song)),
      }))
      .filter((data) => data.songs.length > 0);

    setSearchResults(combinedResults);
  };

  const handleSelectSong = (song: string) => {
    setSeleccionarCancion(song);
    setSelectedSong(song);
    setShowReproductor(true);
    setShowReproductorRock(true);
    setShowReproductorArtists(true);
    setShowReproductorRecommended(true);
    setMostrarReproductorFavoritos(true);
  };

  const handleSelect = (song: string) => {
    setSeleccionarCancion(song);
    setSelectedSong(song);
    setMostrarReproductorFavoritos(true); // Mostrar el reproductor de favoritos
  };

  const handleCloseReproductor = () => {
    setShowReproductor(false);
    setShowReproductorArtists(false);
    setShowReproductorRock(false);
    setShowReproductorRecommended(false);
    setMostrarReproductorFavoritos(false);
  };

  const allSongs = [
    ...rocknacional[0].songs,
    ...recommended[0].songs,
    ...artistas.flatMap((artista) => artista.songs),
  ];

  // Filtrar las canciones favoritas de todas las canciones disponibles
  const cancionesFavoritas = allSongs.filter((song) =>
    favoritos.includes(song.songName)
  );

  const handlePlaySong = (song: Song) => {
    setCurrentSong(song); // Establece la canción seleccionada
  };

  return (
    <div>
      <Img />
      <ResponsiveAppBar searchTerm={searchTerm} onSearch={handleSearch} />

      <Routes>
        <Route path="" element={<Artistas />} />
        <Route
          path="artistas/:id"
          element={
            <ArtistasDetails
              onPlaySong={handlePlaySong}
              handleSelectSong={handleSelectSong}
            />
          }
        />
        <Route
          path="rocknacional"
          element={<PagRockNacional handleSelectSong={handleSelectSong} />}
        />
        <Route
          path="search"
          element={
            <SearchResults
              searchResults={searchResults}
              handleSelect={handleSelect}
              handleSelectSong={handleSelectSong}
            />
          }
        />
        <Route
          path="exitos"
          element={<Recommended handleSelectSong={handleSelectSong} />}
        />
        <Route
          path="favoritos"
          element={
            <Favoritos mostrarTabla={true} handleSelect={handleSelect} />
          }
        />
      </Routes>

      {(location.pathname === "" ||
        location.pathname.startsWith("/artistas") ||
        location.pathname.startsWith("/rocknacional") ||
        location.pathname.startsWith("/exitos") ||
        location.pathname.startsWith("/favoritos") ||
        location.pathname.startsWith("/search")) &&
        seleccionarCancion &&
        showReproductor &&
        cancionesFavoritas && (
          <div>
            <Reproductor seleccionar={seleccionarCancion} />

            <ReproductorArtists seleccionar={seleccionarCancion} />

            <ReproductorRock
              seleccionar={seleccionarCancion}
              onClose={handleCloseReproductor}
            />
          </div>
        )}

      {(location.pathname === "" ||
        location.pathname.startsWith("/artistas") ||
        location.pathname.startsWith("/rocknacional") ||
        location.pathname.startsWith("/exitos") ||
        location.pathname.startsWith("/favoritos") ||
        location.pathname.startsWith("/search")) &&
        mostrarReproductorFavoritos &&
        seleccionarCancion && (
          <div>
            <ReproductorFavoritos
              cancionesFavoritas={cancionesFavoritas}
              seleccionarCancion={seleccionarCancion}
              onClose={handleCloseReproductor}
            />
          </div>
        )}
    </div>
  );
}

export default App;

const Img = styled("div")(() => ({
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundColor: "#151829",
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: "-9999",
}));
