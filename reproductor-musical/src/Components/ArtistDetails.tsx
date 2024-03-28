import { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import artistas from "./artists.json";
import { Box, Button, Typography } from "@mui/material";
import styled from "styled-components";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MusicTable from "./music-table";


interface Song {
  songName: string;
  duration: string;
  number: string;
  artists_evolved: string[];
  artista: string;
  icon: string;
  album: string;
  song_url: string;
}

interface ArtistasDetailsProps {
  onPlaySong: (song: Song) => void;
  handleSelectSong: (song: string, url: string, index: number) => void;

}

const ArtistasDetails: FunctionComponent<ArtistasDetailsProps> = ({
  handleSelectSong,

}) => {
  const { id } = useParams<{ id: string }>();
  const artistaIndex = parseInt(id || "0"); // Si id es undefined, se asigna "0" como valor predeterminado
  const artista = artistas[artistaIndex];
  const [playAll, setPlayAll] = useState(false);

  // const seleccionarArtista = artistas.find(
  //   (songs) => songs.name === seleccionar
  // );

  // const songs = seleccionarArtista ? seleccionarArtista.songs : [];
  // const rows = songs;

  const [favoritos, ] = useState<string[]>(() => {
    // Recuperar el estado de favoritos del localStorage al cargar el componente
    const storedFavoritos = localStorage.getItem("favoritos");
    return storedFavoritos ? JSON.parse(storedFavoritos) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);

  // const filteredRows = showFavorites
  //   ? rows.filter((row) => favoritos.includes(row.songName))
  //   : rows;

  // const handleToggleFavorito = (songName: string) => {
  //   if (favoritos.includes(songName)) {
  //     setFavoritos((prevFavoritos) =>
  //       prevFavoritos.filter((song) => song !== songName)
  //     );
  //   } else {
  //     setFavoritos((prevFavoritos) => [...prevFavoritos, songName]);
  //   }
  // };

  const handleToggleShowFavorites = () => {
    // Cambiar el estado para mostrar todas las canciones o solo las favoritas
    setShowFavorites((prevState) => !prevState);
    console.log("boton");
  };

  const handlePlayAll = () => {
    setPlayAll(true);
  };

  useEffect(() => {
    // Guardar el estado de favoritos en el localStorage al actualizarlo
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  

  return (
    <div>
      <Container>
        <Box
          sx={{
            width: "auto",
            display: "flex",
            justifyContent: "center",
            "@media (max-width: 768px)": {
              width: "100%",
            },
          }}
        >
          <Img src={artista.photo_url} alt="" />
        </Box>
        <Content>
          <Box sx={{ display: "flex", textAlign: "center" }}>
            <Typography
              color="#ffee04"
              sx={{
                fontSize: "46px",
                fontWeight: "bold",
                wordWrap: "break-word", // Para permitir el salto de palabras largas
                overflowWrap: "break-word", // Para forzar el salto de palabras largas
                "@media screen and (max-width: 768px)": {
                  fontSize: "25px",
                },
              }}
            >
              {artista.name}
            </Typography>
          </Box>
          <Typography
            color="#545864"
            sx={{
              fontSize: "14px",
              fontWeight: "500",
              wordWrap: "break-word", // Para permitir el salto de palabras largas
              overflowWrap: "break-word", // Para forzar el salto de palabras largas
              "@media screen and (max-width: 768px)": {
                fontSize: "14px",
              },
            }}
          >
            {artista.genre.join(", ")}
          </Typography>
          <Typography
            color="white"
            sx={{
              display: "flex",
              justifyContent: "center",
              textAlign: "start",
              mt: 2,
              fontSize: "16px",
              marginBottom: "50px",

              "@media screen and (max-width: 768px)": {
                fontSize: "16px",
                padding: "10px",
              },
            }}
          >
            {artista.bio}
          </Typography>
          <ButtonContainer>
            <Button
              onClick={handlePlayAll}
              variant="contained"
              sx={{
                border: "2px solid #ffee04",
                backgroundColor: "#ffee04",
                color: "#0b0c17",
                padding: "4px 30px 4px 30px",
                borderRadius: "30px",
                ":hover": {
                  backgroundColor: "#ffee04",
                  boxShadow: "1px 1px 10px 2px #ffee04",
                },
              }}
            >
              <VolumeUpIcon
                fontSize="small"
                sx={{ marginRight: "10px", marginLeft: "-0.5rem" }}
              />
              REPRODUCIR
            </Button>

            <Button
              onClick={handleToggleShowFavorites}
              variant="contained"
              sx={{
                border: "2px solid #ffee04",
                backgroundColor: "#ffee04",
                color: "#0b0c17",
                padding: "5px 5px 5px 5px",
                borderRadius: "50px",
                borderRadiusTop: "30px",
                ":hover": {
                  backgroundColor: "#ffee04",
                  boxShadow: "1px 1px 10px 2px #ffee04",
                },
              }}
            >
              <FavoriteBorderIcon />
            </Button>
          </ButtonContainer>
        </Content>
      </Container>
      <MusicTable
        seleccionar={artista.name}
        handleSelectSong={handleSelectSong}
        playAll={playAll}
        showFavorites={showFavorites}
      />
    </div>
  );
};

export default ArtistasDetails;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center; 
  margin-bottom: 20px;
  gap: 20px;
`;

const Content = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: start;
  @media screen and (max-width: 768px) {
    align-items: center;
  }
`;

const Container = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  height: "20vh",
  padding: "200px",
  gap: "30px",
  paddingTop: "0px",
  marginTop: "2rem",
  "@media screen and (max-width: 768px)": {
    display: "flex",
    flexDirection: "column",
    padding: "0px",
    marginBottom: "0rem",
    height: "auto",
  },
}));

const Img = styled("img")(() => ({
  filter: "grayscale(40%)",
  width: "350px",
  height: "350px",
  borderRadius: "10px",
  "&:hover": {
    filter: "grayscale(0%)", // Al hacer hover, mostrar en color
  },
  "@media screen and (max-width: 768px)": {
    width: "20rem",
    height: "auto",
  },
}));

