// src/pages/modules/addCombustible/Abastecimiento.jsx
import { Grid, TextField, Checkbox, FormControlLabel, Typography, Divider, Box } from '@mui/material';

export default function Abastecimiento({ formData, setFormData, modo = 'inspector' }) {

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Si el modo es 'conductor', el inspector no debería poder editar datos técnicos 
  // y viceversa. Aquí definimos qué es "solo lectura" según el rol.
  const isFieldDisabled = (fieldName) => {
    if (modo === 'inspector') {
      // El inspector llena la orden inicial, el conductor llena lo de servicio
      return ['nombre_serviccentro', 'numero_ticket_serviccentro', 'sello_serviccentro'].includes(fieldName);
    }
    if (modo === 'conductor') {
      // El conductor solo debe tocar los datos de servicio y kilometraje
      return ['numero_orden', 'fecha', 'vehiculo_id', 'conductor_id'].includes(fieldName);
    }
    return false;
  };

  return (
    <Grid container spacing={2}>
      {/* Sección 1: Datos de Control (Inspector) */}
      <Grid item xs={12}><Typography variant="h6">1. Asignación (Inspector)</Typography></Grid>
      <Grid item xs={6} md={3}>
        <TextField fullWidth label="N° Orden" name="numero_orden"
          value={formData.numero_orden || ''} onChange={handleChange} disabled={isFieldDisabled('numero_orden')} />
      </Grid>
      {/* ... resto de campos ... */}

      <Divider sx={{ my: 2, width: '100%' }} />

      {/* Sección 2: Llenado de Servicio (Conductor) */}
      <Grid item xs={12}><Typography variant="h6">2. Registro de Servicio (Conductor)</Typography></Grid>
      <Grid item xs={12} md={6}>
        <TextField fullWidth label="Nombre Servicentro" name="nombre_serviccentro"
          value={formData.nombre_serviccentro || ''} onChange={handleChange} disabled={isFieldDisabled('nombre_serviccentro')} />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField fullWidth label="N° Ticket" name="numero_ticket_serviccentro"
          value={formData.numero_ticket_serviccentro || ''} onChange={handleChange} disabled={isFieldDisabled('numero_ticket_serviccentro')} />
      </Grid>
    </Grid>
  );
}