import { FunctionComponent } from "react";
import artistas from "./artists.json";
import { Box, Typography, styled } from "@mui/material";
import { Link } from "react-router-dom";

interface ArtistasProps {
  
}

const Artistas: FunctionComponent<ArtistasProps> = () => {
  return (
    <Box sx={{ marginBottom: "10rem" }}>
      <StyledUlContainer>
        <StyledUl>
          {artistas.slice(0, 20).map((artista, index) => (
            <Box key={index}>
              <StyledLi key={index}>
                <Link to={`/artistas/${index}`}>
                  <Img src={artista.photo_url} alt={artista.name} />
                </Link>
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "10px",
                    color: "#fff",
                    fontSize: "23px",
                    "@media (max-width: 768px)": {
                      fontSize: "14px",
                    },
                  }}
                >
                  {artista.name}
                </Typography>

                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    fontSize: "12px",
                    marginBottom: "0px",
                    "@media (max-width: 768px)": {
                      fontSize: "10px",
                    },
                  }}
                >
                  {artista.genre.join(", ")}
                </Typography>
              </StyledLi>
            </Box>
          ))}
        </StyledUl>
      </StyledUlContainer>
    </Box>
  );
};

export default Artistas;

const StyledUlContainer = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: "3rem",
});

const StyledUl = styled("ul")({
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  padding: 0,
  margin: 0,
  width: "100%",
  listStyle: "none",
  gap: "20px",
  cursor: "pointer",
});

const StyledLi = styled("li")({
  backgroundColor: "#0b0c17",
  width: "20rem",
  height: "25rem",
  ":hover": {
    opacity: 0.7,
  },
  "@media (max-width: 768px)": {
    width: "10.5rem",
    height: "15rem",
  },
});

const Img = styled("img")({
  width: "86%",
  height: "70%",
  padding: "20px 20px 0px 20px",
 
  "@media (max-width: 768px)": {
    padding: "10px 10px 0px 10px",
    width: "87%",
    height: "65%",
  },
});
