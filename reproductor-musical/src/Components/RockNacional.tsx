import * as React from "react";
import { Typography, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import rocknacional from "./Rocknacional.json";

import styled from "styled-components";

interface RockNacionalProps {
  mostrarTabla: boolean;
  handleSelectSong: (song: string, url: string, index: number) => void;
}

const RockNacional: React.FunctionComponent<RockNacionalProps> = ({
  handleSelectSong,
}) => {
  const allSongs = rocknacional.find((songs) => songs.songs);

  const [verTodasLasCanciones, ] = React.useState(false);
  const [, setShowReproductorRock] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  // Function to format artist names using Intl.ListFormat('es').format

  const [favoritos, setFavoritos] = React.useState<string[]>(() => {
    // Recuperar el estado de favoritos del localStorage al cargar el componente
    const storedFavoritos = localStorage.getItem("favoritos");
    return storedFavoritos ? JSON.parse(storedFavoritos) : [];
  });

  const handleToggleFavorito = (songName: string) => {
    if (favoritos.includes(songName)) {
      setFavoritos((prevFavoritos) =>
        prevFavoritos.filter((song) => song !== songName)
      );
    } else {
      setFavoritos((prevFavoritos) => [...prevFavoritos, songName]);
    }
  };

  React.useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const handlePlayPause = (url: string, song: string, index: number) => {
    handleSelectSong(song, url, index);
    setShowReproductorRock(true);
  };

  if (allSongs) {
    return (
      <CenteredBox>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <Typography
            sx={{
              color: "#ccc",
              fontSize: "30px",
              fontWeight: "bold",
              "&:hover": {
                color: "#ffee04",
              },
            }}
          >
            ROCK NACIONAL
          </Typography>
        </Box>
        <StyledList>
          {rocknacional[0].songs.map((song, index) => {
            return verTodasLasCanciones || index < 100 ? (
              <StyledListItem key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                  <StyledImage src={song.icon} alt="" />
                    <Box sx={{ marginLeft: "20px" }}>
                      <Typography
                        sx={{
                          color: "#ccc",
                          fontSize: "20px",
                          "@media screen and (max-width: 768px)": {
                            fontSize: "18px",
                          },
                        }}
                      >
                        {song.songName}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#ccc",
                          fontSize: "12px",
                          "@media screen and (max-width: 768px)": {
                            fontSize: "12px",
                          },
                        }}
                      >
                        {song.artista}
                      </Typography>
                    </Box>

                    <audio
                      ref={audioRef}
                      controls
                      style={{ display: "none" }}
                    ></audio>
                  </Box>
                  
                  <Box sx={{display: "flex", flexDirection: "column"}}>
                      <PlayCircleOutlineIcon
                        onClick={() =>
                          handlePlayPause(song.song_url, song.songName, index)
                        }
                        sx={{
                          color: "#ccc",
                          fontSize: "30px",
                          cursor: "pointer",
                         
                          "&:hover": {
                            color: "#ffee04",
                          },
                        }}
                      />
                      {favoritos.includes(song.songName) ? (
                        <FavoriteIcon
                          color="secondary"
                          sx={{
                            color: "#ffee04",
                            fontSize: "30px",
                            cursor: "pointer",
                            marginTop: "0.5rem",
                          }}
                          onClick={() => handleToggleFavorito(song.songName)}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          color="secondary"
                          sx={{
                            color: "#ccc",
                            fontSize: "30px",
                            cursor: "pointer",
                            marginTop: "0.5rem",
                          }}
                          onClick={() => handleToggleFavorito(song.songName)}
                        />
                      )}
                    </Box>
                </Box>
              </StyledListItem>
            ) : null;
          })}
        </StyledList>
        {/* <ContainerButton>
          <StyledButton
            onClick={() => setVerTodasLasCanciones(!verTodasLasCanciones)}
            sx={{ marginTop: "1rem" }}
          >
            {verTodasLasCanciones ? (
              <Typography sx={{ letterSpacing: "0.2rem" }}>
                Mostrar menos
                <KeyboardArrowUpIcon
                  sx={{
                    position: "absolute",
                    marginLeft: "0.5rem",
                    marginTop: "-0.1rem",
                    fontSize: 25,
                  }}
                />
              </Typography>
            ) : (
              <Typography sx={{ letterSpacing: "0.2rem" }}>
                Mostrar más
                <KeyboardArrowDownIcon
                  sx={{
                    position: "absolute",
                    marginLeft: "0.5rem",
                    marginTop: "-0.1rem",
                    fontSize: 25,
                  }}
                />
              </Typography>
            )}
          </StyledButton>
        </ContainerButton> */}
      </CenteredBox>
    );
  } else {
    return null;
  }
};

export default RockNacional;

// const StyledButton = styled(Button)(() => ({
//   color: "#fff",
//   ":hover": {
//     backgroundColor: "transparent",
//   },
// }));

// const ContainerButton = styled("div")(() => ({
//   display: "flex",
//   justifyContent: "center",
//   marginBottom: "5rem",
// }));

const CenteredBox = styled(Box)`
  display: grid;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 10rem;
`;

const StyledList = styled("ul")(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "50px",
  padding: "5px",
  listStyle: "none",
  "@media screen and (max-width: 768px)": {
    gridTemplateColumns: "repeat(1, 1fr)",
    marginTop: "-1.5rem",
    gap: "0px",
  },
}));

const StyledListItem = styled("li")(() => ({
  paddingTop: "10px",
  paddingBottom: "25px",
  paddingLeft: "15px",
  paddingRight: "15px",
  backgroundColor: "#0b0c17",
  border: "1px solid #0b0c17",
  width: "90%",
  height: "50%",
  borderRadius: "10px",
  "@media screen and (max-width: 768px)": {
    width: "90%",
  },
}));

const StyledImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;
