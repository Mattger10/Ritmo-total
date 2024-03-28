import React, { useState, useRef, useEffect } from "react";
import { CancionFavorita } from "./Favoritos";
import { Box, styled, Typography } from "@mui/material";
import RepeatIcon from "@mui/icons-material/Repeat";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import Tooltip from "@mui/material/Tooltip";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

interface ReproductorFavoritosProps {
  cancionesFavoritas: CancionFavorita[]; // Define el tipo de 'cancionesFavoritas'
  seleccionarCancion: string; // Agrega esta prop para obtener la canción seleccionada
  onClose: () => void;
}

const ReproductorFavoritos: React.FC<ReproductorFavoritosProps> = ({
  cancionesFavoritas,
  seleccionarCancion,
  onClose,
}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [isRepeatMode, setIsRepeatMode] = useState(false);
  const [autoPlayNext, setAutoPlayNext] = useState(false);
  const [, setCurrentRandomIndex] = useState(-1);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const findSelectedSongIndex = (songName: string): number => {
    return cancionesFavoritas.findIndex((song) => song.song_url === songName);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setCurrentTime(currentTime);
      setDuration(duration);
      const progressValue = (currentTime / duration) * 100;
      setSliderValue(progressValue);
      if (currentTime >= duration - 1) {
        playNextSong();
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying((prevState) => !prevState);
    }
  };

  const playNextSong = () => {
    if (isShuffleMode) {
      playRandomSong();
    } else if (isRepeatMode) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      setCurrentSongIndex(
        (prevIndex) => (prevIndex + 1) % cancionesFavoritas.length
      );
      setAutoPlayNext(true);
    }
  };

  const playPreviousSong = () => {
    setCurrentSongIndex(
      (prevIndex) =>
        (prevIndex - 1 + cancionesFavoritas.length) % cancionesFavoritas.length
    );
    setAutoPlayNext(true);
  };

  const handleSongEnd = () => {
    playNextSong();
  };

  useEffect(() => {
    setIsPlaying(autoPlayNext);
  }, [autoPlayNext]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentSongIndex, isPlaying]);

  const playSelectedSong = (songName: string) => {
    const selectedSongIndex = findSelectedSongIndex(songName);
    setCurrentSongIndex(selectedSongIndex);
    setAutoPlayNext(true);
  };

  useEffect(() => {
    if (seleccionarCancion) {
      playSelectedSong(seleccionarCancion);
    }
   
  }, [seleccionarCancion]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = progressBarRef.current;
      if (!progressBar) return;

      const rect = progressBar.getBoundingClientRect();
      const progressBarWidth = rect.width;
      const clickX = e.clientX - rect.left;
      const percentage = (clickX / progressBarWidth) * 100;
      const currentTime = (duration * percentage) / 100;

      audioRef.current.currentTime = currentTime;
      setCurrentTime(currentTime);
      setSliderValue(percentage);
    }
  };

  const playRandomSong = () => {
    const randomIndex = Math.floor(Math.random() * cancionesFavoritas.length);
    setCurrentRandomIndex(randomIndex);
    setCurrentSongIndex(randomIndex);
    setAutoPlayNext(true);
  };

  const [isVisible, setIsVisible] = useState(true); // Nuevo estado para controlar la visibilidad

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (audioRef.current) {
      const seekTime = ((newValue as number) * duration) / 100;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime); // Actualiza el tiempo actual de reproducción
      setSliderValue(newValue as number);
    }
  };

  if (cancionesFavoritas[currentSongIndex]) {
    return (
      <Box>
        {isVisible && (
          <Box
            sx={{
              position: "fixed",
              width: "100%",
              height: "100%",
              top: "0%",
              left: "0%",
              backdropFilter: "blur(10px)",
              cursor: "pointer",
            }}
            onClick={handleToggleVisibility}
          >
            <IconButton onClick={onClose}>
              <Tooltip title={"Cerrar"}>
                <HighlightOffOutlinedIcon
                  sx={{
                    position: "fixed",
                    color: isShuffleMode ? "#ffee04" : "#ccc",
                    right: 40,
                    top: 40,
                    fontSize: "37px",
                    "&:hover": {
                      color: "#ffee04",
                    },
                    "@media screen and (max-width: 768px)": {
                      right: 10,
                      top: 10,
                    },
                  }}
                />
              </Tooltip>
            </IconButton>
            <Box
              sx={{
                position: "fixed",
                top: "45%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Img
                src={cancionesFavoritas[currentSongIndex].icon}
                alt={cancionesFavoritas[currentSongIndex].songName}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  color="white"
                  fontWeight={500}
                  sx={{ fontSize: "25px" }}
                >
                  {cancionesFavoritas[currentSongIndex].artists_evolved.join(
                    ", "
                  )}
                </Typography>
                <Typography noWrap sx={{ color: "#ffee04", fontSize: "20px" }}>
                  {cancionesFavoritas[currentSongIndex].songName}
                </Typography>
                <Typography
                  noWrap
                  letterSpacing={-0.25}
                  sx={{ color: "white" }}
                >
                  {cancionesFavoritas[currentSongIndex].album}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Widget sx={{ width: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mt: -1,
              }}
            >
              <Tooltip title="Repetir">
                <IconButton
                  onClick={() => setIsRepeatMode((prevMode) => !prevMode)}
                >
                  <RepeatIcon
                    sx={{
                      color: isRepeatMode ? "#ffee04" : "#ccc",
                      fontSize: "29px",
                      "&:hover": {
                        color: "#ffee04",
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Anterior">
                <IconButton
                  aria-label="previous song"
                  onClick={playPreviousSong}
                >
                  <SkipPreviousIcon
                    sx={{
                      color: "#ccc",
                      fontSize: "35px",
                      "&:hover": {
                        color: "#ffee04",
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title={isPlaying ? "Pausa" : "Reproducir"}>
                <IconButton aria-label="toggle play" onClick={togglePlay}>
                  {isPlaying ? (
                    <PauseRounded
                      sx={{
                        fontSize: "35px",
                        color: "#ccc",
                        "&:hover": {
                          color: "#ffee04",
                        },
                      }}
                    />
                  ) : (
                    <PlayArrowRounded
                      sx={{
                        fontSize: "35px",
                        color: "#ccc",
                        "&:hover": {
                          color: "#ffee04",
                        },
                      }}
                    />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title={"Siguiente"}>
                <IconButton aria-label="next song" onClick={playNextSong}>
                  <SkipNextIcon
                    sx={{
                      color: "#ccc",
                      fontSize: "35px",
                      "&:hover": {
                        color: "#ffee04",
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={
                  isShuffleMode ? "Desactivar aleatorio" : "Activar aleatorio"
                }
              >
                <IconButton
                  onClick={() => {
                    if (isShuffleMode) {
                      setIsShuffleMode(false);
                      setCurrentRandomIndex(-1);
                    } else {
                      setIsShuffleMode(true);
                    }
                  }}
                >
                  <ShuffleIcon
                    sx={{
                      color: isShuffleMode ? "#ffee04" : "#ccc",
                      fontSize: "27px",
                      "&:hover": {
                        color: "#ffee04",
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title={isVisible ? "Minimizar" : "Expandir"}>
                <IconButton onClick={handleToggleVisibility}>
                  {isVisible ? (
                    <CloseFullscreenIcon
                      sx={{
                        color: "#ccc",
                        fontSize: "23px",
                        "&:hover": {
                          color: "#ffee04",
                        },
                      }}
                    />
                  ) : (
                    <OpenInFullIcon
                      sx={{
                        color: "#ccc",
                        fontSize: "23px",
                        "&:hover": {
                          color: "#ffee04",
                        },
                      }}
                    />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {cancionesFavoritas[currentSongIndex] && (
                <Slider
                  aria-label="time-indicator"
                  size="small"
                  ref={progressBarRef}
                  value={sliderValue}
                  onChange={handleSliderChange}
                  onClick={handleProgressBarClick}
                  sx={{
                    color: "#ccc",
                    height: 4,
                    width: "50%",
                    "& .MuiSlider-thumb": {
                      width: 8,
                      height: 8,

                      "&::before": {
                        boxShadow: "0 2px 12px 0 #ffee04",
                      },
                      "&:hover, &.Mui-focusVisible": {},
                      "&.Mui-active": {
                        width: 20,
                        height: 20,
                      },
                    },
                    "& .MuiSlider-rail": {
                      opacity: 0.28,
                    },
                    "@media screen and (max-width: 768px)": {
                      width: "100%",
                    },
                  }}
                />
              )}
            </Box>
            <audio
              ref={audioRef}
              src={cancionesFavoritas[currentSongIndex].song_url || ""}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleSongEnd}
            />
          </Widget>
        </Box>
      </Box>
    );
  } else {
    return null;
  }
};

export default ReproductorFavoritos;

const Widget = styled("div")(() => ({
  padding: 16,
  borderRadius: 0,
  width: 343,
  maxWidth: "100%",
  margin: "auto",
  position: "relative",
  zIndex: -999,
  backgroundColor: "#0b0c17",
  backdropFilter: "blur(40px)",
}));

const Img = styled("img")(() => ({
  width: "500px",
  height: "500px",
  "@media (max-width: 768px)": {
    width: "250px",
    height: "250px",
  },
}));
