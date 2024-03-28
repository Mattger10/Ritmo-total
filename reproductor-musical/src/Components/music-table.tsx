import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography, styled, Button, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import artistas from "./artists.json";

interface MusicTableProps {
  seleccionar: string;
  handleSelectSong: (song: string, url: string, index: number) => void;
  playAll: boolean;
  showFavorites: boolean; // Añade esta línea
}

const MusicTable: React.FunctionComponent<MusicTableProps> = ({
  seleccionar,
  handleSelectSong,
  playAll,
  showFavorites,
}) => {
  const seleccionarArtista = artistas.find(
    (songs) => songs.name === seleccionar
  );
  const songs = seleccionarArtista ? seleccionarArtista.songs : [];

  const rows = songs;
  const [verTodasLasCanciones, setVerTodasLasCanciones] = React.useState(false);
  const [, setShowReproductor] = React.useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [favoritos, setFavoritos] = React.useState<string[]>(() => {
    // Recuperar el estado de favoritos del localStorage al cargar el componente
    const storedFavoritos = localStorage.getItem("favoritos");
    return storedFavoritos ? JSON.parse(storedFavoritos) : [];
  });
  // const [, setShowFavorites] = React.useState(false);
  const filteredRows = showFavorites
    ? rows.filter((row) => favoritos.includes(row.songName))
    : rows;

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
    // Guardar el estado de favoritos en el localStorage al actualizarlo
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const handlePlayPause = (url: string, song: string, index: number) => {
    handleSelectSong(song, url, index);
    setShowReproductor(true);
  };

  React.useEffect(() => {
    if (playAll) {
      rows.map((song, index) => {
        setTimeout(() => {
          handlePlayPause(song.song_url, song.songName, index);
        }); // Cambia este valor según tu preferencia para el intervalo de reproducción
      });
    }
  }, [playAll]);

  if (seleccionarArtista) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "10rem",
          marginTop: "2rem",
        }}
      >
        <TableContainer
          component={Paper}
          sx={{
            width: "80%",
            padding: "0px",
            backgroundColor: "transparent",
            border: "1px solid white",
            "@media screen and (max-width: 768px)": {
              width: "100%",
            },
          }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography sx={{ color: "white" }}>#</Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: "white" }}>CANCIONES</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography sx={{ color: "white" }}>ARTISTA</Typography>
                </TableCell>
                <TableCell align="left">
                  {" "}
                  <Typography sx={{ color: "white" }}>ALBUM</Typography>
                </TableCell>
                <TableCell align="right">
                  {" "}
                  <Typography sx={{ color: "white" }}>DURACIÓN</Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRows.map((row, index) => {
                return verTodasLasCanciones || index < 20 ? (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ImgIcon width={40} height={40} src={row.icon} alt="" />
                        <Typography
                          sx={{
                            marginLeft: "2rem",
                            marginTop: "0rem",
                            color: "white",
                          }}
                        >
                          {row.number}
                        </Typography>

                        {favoritos.includes(row.songName) ? (
                          <FavoriteIcon
                            color="secondary"
                            sx={{
                              marginLeft: "1.5rem",
                              color: "#ffee04",
                              cursor: "pointer",
                              fontSize: 20,
                            }}
                            onClick={() => handleToggleFavorito(row.songName)}
                          />
                        ) : (
                          <FavoriteBorderIcon
                            color="secondary"
                            sx={{
                              marginLeft: "1.5rem",
                              color: "#ccc",
                              cursor: "pointer",
                              fontSize: "20px",
                            }}
                            onClick={() => handleToggleFavorito(row.songName)}
                          />
                        )}
                        <PlayCircleOutlineIcon
                          sx={{
                            marginLeft: "2rem",
                            cursor: "pointer",
                            fontSize: "22px",
                            color: "white",
                            "&:hover": {
                              color: "#ffee04", // Cambiar el color a tu preferencia cuando el cursor esté sobre el ícono
                            },
                          }}
                          onClick={() =>
                            handlePlayPause(row.song_url, row.songName, index)
                          }
                        />
                        <audio
                          ref={audioRef}
                          controls
                          style={{ display: "none" }}
                        ></audio>
                      </Box>
                    </TableCell>
                    <TableCell align="left" sx={{ color: "white" }}>
                      {row.songName}
                    </TableCell>
                    <TableCell align="left" sx={{ color: "white" }}>
                      {row.artista}
                    </TableCell>
                    <TableCell align="left" sx={{ color: "white" }}>
                      {row.album}
                    </TableCell>
                    <TableCell align="right" sx={{ color: "white" }}>
                      {row.duration}
                    </TableCell>
                  </TableRow>
                ) : null;
              })}
            </TableBody>
          </Table>

          {songs.length > 20 && (
            <ContainerButton>
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
            </ContainerButton>
          )}
        </TableContainer>
      </Box>
    );
  } else {
    return null;
  }
};

export default MusicTable;

const ImgIcon = styled("img")(() => ({}));

const StyledButton = styled(Button)(() => ({
  color: "#fff",
  ":hover": {
    backgroundColor: "transparent",
  },
}));

const ContainerButton = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
}));
