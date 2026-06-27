import { useState } from 'react';
import { Grid, Typography, TextField } from '@mui/material';
import { filtrarEntradaTexto, obtenerErrorCampo, LIMITES_ANIO } from './logicGeneralData';

export default function SeccionDatosGenerales({ formData, setFormData }) {
  // Estado local para los errores: addFlota ni se entera de esto
  const [localErrors, setLocalErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const valorFiltrado = filtrarEntradaTexto(name, value);

    // Actualizamos el estado global en addFlota
    setFormData((prev) => ({
      ...prev,
      [name]: valorFiltrado,
    }));

    // Validamos en tiempo real si ya había un error previo para quitarlo rápido
    if (localErrors[name]) {
      const errorMsg = obtenerErrorCampo(name, valorFiltrado);
      setLocalErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }
  };

  // Cuando el usuario sale del input, validamos rigurosamente
  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    const errorMsg = obtenerErrorCampo(name, value);
    setLocalErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item size={12} sx={{ mt: 1 }}>
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
          Datos Generales del Vehículo
        </Typography>
      </Grid>
      <Grid item size={3} sm={4}>
        <TextField
          fullWidth
          size="small"
          label="Placa de Rodaje"
          name="placa"
          placeholder="Ej: F4D891"
          value={formData.placa || ''}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required
          error={!!localErrors.placa}
          helperText={localErrors.placa}
        />
      </Grid>
      <Grid item size={3} sm={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Año de Fabricación"
          name="anio_fabricacion"
          value={formData.anio_fabricacion || ''}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required
          error={!!localErrors.anio_fabricacion}
          helperText={localErrors.anio_fabricacion || `Rango: ${LIMITES_ANIO.min} - ${LIMITES_ANIO.max}`}
        />
      </Grid>
      <Grid item size={6} sm={6}>
        <TextField
          fullWidth
          size="small"
          label="Color (Opcional)"
          name="color"
          placeholder="Ej: Blanco"
          value={formData.color || ''}
          onChange={handleInputChange}
        />
      </Grid>
      <Grid item size={6} sm={4}>
        <TextField
          fullWidth
          size="small"
          label="Marca"
          name="marca"
          placeholder="Ej: Toyota"
          value={formData.marca || ''}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required
          error={!!localErrors.marca}
          helperText={localErrors.marca}
        />
      </Grid>
      <Grid item size={6} sm={4}>
        <TextField
          fullWidth
          size="small"
          label="Modelo"
          name="modelo"
          placeholder="Ej: Hilux"
          value={formData.modelo || ''}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          required
          error={!!localErrors.modelo}
          helperText={localErrors.modelo}
        />
      </Grid>
    </Grid>
  );
}