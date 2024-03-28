import {  styled } from "@mui/material";
import { FunctionComponent, } from "react";
import Favoritos from "./Favoritos";


interface PagFavoritosProps {
  handleSelect: (song: string) => void;
}

const PagFavoritos: FunctionComponent<PagFavoritosProps> = ({
  handleSelect,
}) => {
  
  return (
    <Container>
      <Favoritos mostrarTabla={true} handleSelect={handleSelect} />
    </Container>
  );
};

export default PagFavoritos;

const Container = styled("div")(() => ({}));
