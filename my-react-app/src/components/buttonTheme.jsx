import { IconButton } from '@mui/material';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

export default function ButtonTheme({ isLight, setIsLight }) {
  return (
    <IconButton
      size="large"
      color="inherit"
      onClick={() => setIsLight(!isLight)}
      aria-label="cambiar tema"
    >
      {isLight ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
    </IconButton>
  );
}