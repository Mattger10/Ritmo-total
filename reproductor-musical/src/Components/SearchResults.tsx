import { Box, Typography } from "@mui/material";
import styled from "styled-components";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useState } from "react";

interface Song {
  songName: string;
  duration: string;
  artists_evolved: string[];
  number: string;
  artista: string;
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

interface SearchResultsProps {
  searchResults: Data[];
  handleSelect: (song: string) => void;
  handleSelectSong: (song: string, url: string, index: number) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  searchResults,
  handleSelect,
  handleSelectSong,
}) => {
  const handlePlayPause = (url: string, song: string, index: number) => {
    handleSelect(song);
    handleSelectSong(song, url, index);
  };

  const [favoritos, setFavoritos] = useState<string[]>(() => {
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

  useEffect(() => {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

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
          RESULTADOS
        </Typography>
      </Box>
      {searchResults.map((data, index) => (
        <Box>
          <StyledList key={index}>
            {data.songs.map((song: Song, songIndex: number) => (
              <StyledListItem key={songIndex}>
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
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
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
            ))}
          </StyledList>
        </Box>
      ))}
    </CenteredBox>
  );
};

export default SearchResults;

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
