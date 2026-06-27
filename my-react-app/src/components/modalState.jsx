import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

export default function ModalState({ open, onClose, aprobado = true }) {
  const navigate = useNavigate();

  const handleContinue = () => {
    onClose();
    navigate('/rutas');
  };

  if (aprobado) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Typography variant="h6" fontWeight="bold" color="success.main">
            ¡Vehículo Apto!
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Tenga un buen día en su inicio de jornada. La inspección ha sido aprobada.
          </Typography>
          <Button
            onClick={handleContinue}
            sx={{ mt: 3, backgroundColor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
            variant="contained"
          >
            Continuar
          </Button>
        </Box>
      </Modal>
    );
  } else {
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={style}>
          <Typography variant="h6" fontWeight="bold" color="error.main">
            ¡Vehículo No Apto!
          </Typography>
          <Typography sx={{ mt: 2 }}>
            El vehículo no cumple con las condiciones óptimas de seguridad. El uso del vehículo ha sido denegado.
          </Typography>
          <Button
            onClick={onClose}
            sx={{ mt: 3, backgroundColor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
            variant="contained"
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    );
  }
}