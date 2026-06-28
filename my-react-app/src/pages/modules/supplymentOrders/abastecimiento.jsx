// src/pages/modules/addCombustible/Abastecimiento.jsx
import { useState, useEffect } from 'react';
import {
  Grid, TextField, Checkbox, FormControlLabel, Typography,
  Divider, Box, Paper, Button, Snackbar, Alert, MenuItem
} from '@mui/material';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import FactCheckIcon from '@mui/icons-material/FactCheck';

export default function Abastecimiento() {
  const [ordenPendiente, setOrdenPendiente] = useState(null);
  const [kmSalidaInspeccion, setKmSalidaInspeccion] = useState(0);
  const [errorKm, setErrorKm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Cargar la orden generada por el inspector que le corresponde a este conductor
  useEffect(() => {
    // Simulamos que el usuario logueado es 'Juan Pérez' (puedes jalarlo de tu sesión real)
    const conductorLogueado = 'Juan Pérez';

    const ordenes = JSON.parse(localStorage.getItem('ordenes_combustible') || '[]');
    // Buscamos una orden PENDIENTE asignada a este conductor
    const pendiente = ordenes.find(o => o.estado_orden === 'PENDIENTE' && o.conductor === conductorLogueado);

    if (pendiente) {
      setOrdenPendiente(pendiente);

      const inspecciones = JSON.parse(localStorage.getItem('inspecciones_historial') || '[]');
      const ultimaInspeccion = inspecciones.find(i => i.vehiculo_id === pendiente.vehiculo_id);

      // Si existe registro previo tomamos ese KM, si no, asumimos 0 para no romper el flujo
      setKmSalidaInspeccion(ultimaInspeccion ? ultimaInspeccion.movimiento.kilometraje_salida : 0);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const valorFinal = type === 'checkbox' ? checked : value;

    setOrdenPendiente(prev => ({
      ...prev,
      [name]: valorFinal
    }));

    // Validación en tiempo real del odómetro (Kilometraje actual en el grifo)
    if (name === 'kilometraje_actual') {
      const kmIntroducido = parseInt(valorFinal) || 0;
      if (kmIntroducido < kmSalidaInspeccion) {
        setErrorKm(`Inconsistencia: El KM no puede ser menor al de salida registrado hoy (${kmSalidaInspeccion} KM).`);
      } else {
        setErrorKm('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Bloqueo de seguridad si el odómetro no cuadra con el pasado
    const kmActual = parseInt(ordenPendiente.kilometraje_actual) || 0;
    if (kmActual < kmSalidaInspeccion) {
      setSnackbar({ open: true, message: 'No puedes guardar una orden con inconsistencias en el odómetro.', severity: 'error' });
      return;
    }

    // Guardar los datos y pasar la orden a COMPLETADA
    const ordenes = JSON.parse(localStorage.getItem('ordenes_combustible') || '[]');
    const actualizadas = ordenes.map(o =>
      o.id === ordenPendiente.id
        ? {
          ...ordenPendiente,
          estado_orden: 'COMPLETADA',
          fecha_abastecimiento: new Date().toLocaleDateString(),
          // Calculamos el total de dinero para facilitarle la vida al Operador en el cierre de mes
          total_pago: (parseFloat(ordenPendiente.cantidad_galones) || 0) * (parseFloat(ordenPendiente.precio_por_galon) || 0)
        }
        : o
    );
    localStorage.setItem('ordenes_combustible', JSON.stringify(actualizadas));

    setSnackbar({ open: true, message: '¡Abastecimiento registrado con éxito! Enviado a Operación.', severity: 'success' });
    setOrdenPendiente(null); // Limpia la pantalla
  };

  if (!ordenPendiente) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
        <FactCheckIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1.5 }} />
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          No tienes órdenes de abastecimiento pendientes
        </Typography>
        <Typography variant="body2" color="text.disabled">
          El encargado del garaje te asignará una orden cuando apruebe tu inspección pre-operacional.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 850, margin: 'auto' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        Registro de Servicio de Combustible (Conductor)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Complete los campos del voucher entregado por el Servicentro Acreditado.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Paper component="form" onSubmit={handleSubmit} elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>

          {/* CABECERA: DATOS DE LA ORDEN DE ORIGEN (SOLO LECTURA) */}
          <Grid item size={12}>
            <Alert severity="info" icon={<LocalGasStationIcon />} sx={{ fontWeight: 'medium' }}>
              Orden Autorizada: <strong>{ordenPendiente.numero_orden}</strong> |
              Vehículo Código: <strong>{ordenPendiente.vehiculo_id}</strong> |
              Placa: <strong>{ordenPendiente.placa.toUpperCase()}</strong>
            </Alert>
          </Grid>

          <Grid item size={12} sx={{ mt: 1 }}><Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>1. Comprobante del Servicentro</Typography></Grid>

          <Grid item fullWidth size={6}>
            <TextField fullWidth required size="small" label="Nombre del Servicentro" name="nombre_serviccentro" value={ordenPendiente.nombre_serviccentro || ''} onChange={handleChange} />
          </Grid>
          <Grid item fullWidth size={6}>
            <TextField fullWidth required size="small" label="N° Ticket / Factura" name="numero_ticket_serviccentro" value={ordenPendiente.numero_ticket_serviccentro || ''} onChange={handleChange} />
          </Grid>

          <Grid item size={12} sx={{ mt: 1 }}><Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>2. Detalle del Abastecimiento</Typography></Grid>

          <Grid item fullWidth size={4}>
            <TextField fullWidth required size="small" select label="Tipo de Combustible" name="tipo_combustible" value={ordenPendiente.tipo_combustible || ''} onChange={handleChange}>
              <MenuItem value="GASOLINA">GASOLINA</MenuItem>
              <MenuItem value="DIESEL">DIESEL</MenuItem>
              <MenuItem value="GLP">GLP</MenuItem>
            </TextField>
          </Grid>
          <Grid item fullWidth size={4}>
            <TextField fullWidth required size="small" type="number" slotProps={{ htmlInput: { step: "0.001" } }} label="Cantidad (Galones)" name="cantidad_galones" value={ordenPendiente.cantidad_galones || ''} onChange={handleChange} />
          </Grid>
          <Grid item fullWidth size={4}>
            <TextField fullWidth required size="small" type="number" slotProps={{ htmlInput: { step: "0.01" } }} label="Precio por Galón (S/.)" name="precio_por_galon" value={ordenPendiente.precio_por_galon || ''} onChange={handleChange} />
          </Grid>

          <Grid item size={6} sx={{ mt: 1 }}><Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>3. Control del Odómetro</Typography></Grid>

          <Grid item size={6} >
            <TextField
              fullWidth
              required
              size="small"
              type="number"
              label="Kilometraje Actual (Odómetro)"
              name="kilometraje_actual"
              value={ordenPendiente.kilometraje_actual || ''}
              onChange={handleChange}
              error={!!errorKm}
              helperText={errorKm || `Kilometraje de salida base: ${kmSalidaInspeccion} KM`}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 1 }}>
            <FormControlLabel
              control={<Checkbox name="sello_serviccentro" checked={ordenPendiente.sello_serviccentro || false} onChange={handleChange} required />}
              label="Confirmo bajo declaración que el ticket cuenta con el Sello físico del Servicentro"
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="success" size="large" disabled={!!errorKm}>
              Registrar y Cerrar Orden
            </Button>
          </Grid>

        </Grid>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}