
import { Grid, Typography, TextField } from '@mui/material';
import { filtrarEntradaBateria, obtenerErrorBateria } from './logicBatteryData';

export default function SeccionBateria({ formData, setFormData }) {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const valorFiltrado = filtrarEntradaBateria(name, value);
    setFormData((prev) => ({ ...prev, [name]: valorFiltrado }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item size={12} sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
          Sistema Eléctrico (Batería)
        </Typography>
      </Grid>

      <Grid item size={6}>
        <TextField
          fullWidth
          size="small"
          label="Tipo Batería"
          name="bateria_tipo"
          value={formData.bateria_tipo || ''}
          onChange={handleInputChange} />
      </Grid>
      <Grid item size={2}>
        <TextField
          fullWidth
          size="small"
          label="Celdas"
          name="bateria_celdas"
          value={formData.bateria_celdas || ''}
          onChange={handleInputChange} />
      </Grid>
      <Grid item size={2}>
        <TextField
          fullWidth
          size="small"
          label="Voltios"
          name="bateria_voltios"
          value={formData.bateria_voltios || ''}
          onChange={handleInputChange}
          error={!!obtenerErrorBateria('bateria_voltios', formData.bateria_voltios)}
          helperText={obtenerErrorBateria('bateria_voltios', formData.bateria_voltios)} />
      </Grid>
      <Grid item size={2}>
        <TextField
          fullWidth
          size="small"
          label="Amperios (Ah)"
          name="bateria_amperios"
          value={formData.bateria_amperios || ''}
          onChange={handleInputChange} />
      </Grid>
    </Grid>
  );
}