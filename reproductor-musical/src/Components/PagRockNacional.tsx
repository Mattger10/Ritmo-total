import {  styled } from "@mui/material";
import { FunctionComponent} from "react";

import RockNacional from "./RockNacional";

interface PagRockNacionalProps {
  handleSelectSong: (song: string, url: string, index: number) => void;
}

const PagRockNacional: FunctionComponent<PagRockNacionalProps> = ({
  handleSelectSong,
}) => {
  // const [mostrarTabla, setMostrarTabla] = useState(true);

  // const alternarMostrarTabla = () => {
  //   setMostrarTabla((prevShowTable) => !prevShowTable);
  // };

  return (
    <Container>
     
        <RockNacional mostrarTabla={true} handleSelectSong={handleSelectSong} />
     
    </Container>
  );
};

export default PagRockNacional;

const Container = styled("div")(() => ({
  
}));

