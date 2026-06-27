import { useState } from 'react';
import { Grid, Typography, TextField, MenuItem } from '@mui/material';
import { filtrarEntradaTecnica, obtenerErrorTecnico } from './logicTechnicalData';

export default function SeccionEspecificacionesTecnicas({ formData, setFormData }) {
  const [localErrors, setLocalErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const valorFiltrado = filtrarEntradaTecnica(name, value);

    setFormData((prev) => ({ ...prev, [name]: valorFiltrado }));

    if (localErrors[name]) {
      setLocalErrors((prev) => ({ ...prev, [name]: obtenerErrorTecnico(name, valorFiltrado) }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    setLocalErrors((prev) => ({ ...prev, [name]: obtenerErrorTecnico(name, value) }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item size={12} sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
          Especificaciones del Motor y Chasis
        </Typography>
      </Grid>

      <Grid item size={4} sm={4}>
        <TextField
          fullWidth size="small"
          label="Número de Motor"
          name="numero_motor"
          value={formData.numero_motor || ''}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          error={!!localErrors.numero_motor}
          helperText={localErrors.numero_motor} />
      </Grid>

      <Grid item size={4} sm={4}>
        <TextField
          fullWidth size="small"
          label="Número de Chasis / VIN"
          name="numero_chasis"
          value={formData.numero_chasis || ''}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          error={!!localErrors.numero_chasis}
          helperText={localErrors.numero_chasis} />
      </Grid>

      <Grid item size={4} sm={4}>
        <TextField
          fullWidth size="small"
          select
          label="Tipo de Combustible"
          name="tipo_combustible"
          value={formData.tipo_combustible || 'DIESEL'}
          onChange={handleInputChange}
          required>
          <MenuItem value="GASOLINA">GASOLINA</MenuItem>
          <MenuItem value="DIESEL">DIESEL</MenuItem>
          <MenuItem value="GLP">GLP</MenuItem>
          <MenuItem value="ELECTRICO">ELECTRICO</MenuItem>
          <MenuItem value="HIBRIDO">HIBRIDO</MenuItem>
        </TextField>
      </Grid>

      <Grid item size={2} sm={4}>
        <TextField
          fullWidth size="small"
          label="Potencia HP"
          name="potencia_hp"
          value={formData.potencia_hp || ''}
          onChange={handleInputChange}
          inputProps={{ inputMode: 'numeric' }} />
      </Grid>

      <Grid item size={3} sm={4}>
        <TextField
          fullWidth size="small"
          label="Capacidad Carga (Kg)"
          name="capacidad_carga_kg"
          value={formData.capacidad_carga_kg || ''}
          onChange={handleInputChange}
          inputProps={{ inputMode: 'decimal' }} />
      </Grid>

      <Grid item size={2} sm={4}>
        <TextField
          fullWidth size="small"
          label="N° Pasajeros"
          name="capacidad_pasajeros"
          value={formData.capacidad_pasajeros || ''}
          onChange={handleInputChange}
          inputProps={{ inputMode: 'numeric' }} />
      </Grid>

      <Grid item size={2} sm={6}>
        <TextField
          fullWidth size="small"
          label="N° Ejes"
          name="numero_ejes"
          value={formData.numero_ejes || ''}
          onChange={handleInputChange}
          inputProps={{ inputMode: 'numeric' }} />
      </Grid>

      <Grid item size={3} sm={6}>
        <TextField
          fullWidth size="small"
          label="Configuración de Ejes"
          name="configuracion_ejes"
          placeholder="Ej: 4X2"
          value={formData.configuracion_ejes || ''}
          onChange={handleInputChange} />
      </Grid>
    </Grid>
  );
}