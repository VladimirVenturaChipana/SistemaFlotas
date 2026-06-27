import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Alert,
  MenuItem,
  Paper,
  Grid,
  Snackbar,
} from '@mui/material';

import { PUNTOS_CONTROL, buildInitialState } from '../../utils/inspectionData';
import InspectionRow from '../../components/InspectionRow';

// Iconos
import BuildIcon from '@mui/icons-material/Build';
import SendIcon from '@mui/icons-material/Send';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const getInitialFormState = () => ({
  vehiculo_id: '',
  conductor: 'Juan Pérez',
  kilometraje_salida: '',
  destino: 'Planta Central',
  sector_solicitante: 'Operaciones',
  checklist: buildInitialState().checklist,
  otras_observaciones: '',
});

function VehicularInspection({ onNavigate }) {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState(getInitialFormState());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Cargar los vehículos registrados en addFlota
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('vehiculos') || '[]');
    setVehicles(list);
    if (list.length > 0) {
      setFormData((prev) => ({
        ...prev,
        vehiculo_id: list[0].id, // Auto-seleccionar el primero
      }));
    }
  }, []);

  const hayMalos = Object.values(formData.checklist).some(
    (v) => v.estado === 'MALO'
  );

  const pendientes = Object.values(formData.checklist).filter(
    (v) => v.estado === ''
  ).length;

  const handleItemChange = (campo, propiedad, valor) => {
    setFormData((prev) => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [campo]: {
          ...prev.checklist[campo],
          [propiedad]: valor,
        },
      },
    }));
  };

  const handleRootChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.vehiculo_id) {
      setSnackbar({ open: true, message: 'Por favor, seleccione un vehículo registrado.', severity: 'error' });
      return;
    }

    const selectedVehicle = vehicles.find((v) => v.id === formData.vehiculo_id);

    // Estructurar el objeto de acuerdo a las tablas MOVIMIENTOS_DIARIOS y CHECKLIST_VERIFICACION
    const payload = {
      id: Date.now().toString(),
      vehiculo_id: formData.vehiculo_id,
      placa: selectedVehicle?.placa || 'Desconocido',
      marca: selectedVehicle?.marca || '',
      modelo: selectedVehicle?.modelo || '',
      conductor: formData.conductor || 'Juan Pérez',
      fecha: new Date().toLocaleDateString(),
      estado: 'pendiente', // 'pendiente' | 'aprobado' | 'denegado'

      // MOVIMIENTOS_DIARIOS
      movimiento: {
        id: 'mov-' + Date.now(),
        vehiculo_id: formData.vehiculo_id,
        conductor_id: formData.conductor,
        fecha: new Date().toISOString().split('T')[0],
        kilometraje_salida: parseInt(formData.kilometraje_salida) || 0,
        kilometraje_llegada: null,
        hora_salida: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hora_llegada: null,
        horas_utilizacion: 0,
        destino: formData.destino,
        sector_solicitante: formData.sector_solicitante,
      },

      // CHECKLIST_VERIFICACION
      checklist: formData.checklist,
      otras_observaciones: formData.otras_observaciones,
    };

    // Guardar en localStorage
    const existing = JSON.parse(localStorage.getItem('inspecciones') || '[]');
    existing.push(payload);
    localStorage.setItem('inspecciones', JSON.stringify(existing));

    console.log('Inspección remitida con éxito a Aprobación:', payload);

    setSnackbar({
      open: true,
      message: '¡Checklist de Verificación Pre-Operacional enviado con éxito!',
      severity: 'success',
    });

    // Resetear formulario y auto-seleccionar el primer vehículo de nuevo
    const resetState = getInitialFormState();
    if (vehicles.length > 0) {
      resetState.vehiculo_id = vehicles[0].id;
    }
    setFormData(resetState);
  };

  if (vehicles.length === 0) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 700, margin: 'auto', textAlign: 'center' }}>
        <Paper
          elevation={2}
          sx={{
            p: 5,
            border: '2px dashed',
            borderColor: 'warning.main',
            borderRadius: 2,
            bgcolor: 'background.paper',
          }}
        >
          <BuildIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            No hay vehículos registrados
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Para poder enviar una inspección vehicular, primero debe registrar una unidad en la flota.
          </Typography>
          {onNavigate && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={() => onNavigate('añadir_flota')}
            >
              Registrar Vehículo en Flota
            </Button>
          )}
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ p: { xs: 2, md: 4 }, maxWidth: 960, margin: 'auto' }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        Checklist de Verificación Pre-Operacional
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Complete el checklist del vehículo y los datos del movimiento diario.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Datos del Movimiento Diario (Relacionados con el vehículo) */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>
          Movimiento Diario y Asignación
        </Typography>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              select
              label="Vehículo"
              name="vehiculo_id"
              value={formData.vehiculo_id}
              onChange={handleRootChange}
              required
            >
              {vehicles.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.placa.toUpperCase()} - {v.marca} {v.modelo}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Nombre del Conductor"
              name="conductor"
              value={formData.conductor}
              onChange={handleRootChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Kilometraje de Salida"
              name="kilometraje_salida"
              value={formData.kilometraje_salida}
              onChange={handleRootChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Destino del Viaje"
              name="destino"
              value={formData.destino}
              onChange={handleRootChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="Sector Solicitante"
              name="sector_solicitante"
              value={formData.sector_solicitante}
              onChange={handleRootChange}
              required
            />
          </Grid>
        </Grid>
      </Paper>

      {pendientes > 0 && (
        <Alert severity="info" sx={{ mb: 2 }} elevation={1}>
          {pendientes} punto{pendientes !== 1 ? 's' : ''} sin evaluar en el checklist.
        </Alert>
      )}

      {hayMalos && (
        <Alert severity="error" sx={{ mb: 2 }} elevation={1}>
          Existen ítems marcados como <strong>MALO</strong>. Complete las observaciones
          técnicas correspondientes.
        </Alert>
      )}

      {/* Tabla del Checklist */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
          px: 2,
          py: 1,
          bgcolor: 'primary.main',
          borderRadius: '8px 8px 0 0',
        }}
      >
        <Typography variant="caption" sx={{ color: 'primary.contrastText', fontWeight: 700, letterSpacing: 0.5 }}>
          PUNTO DE CONTROL
        </Typography>
        <Typography variant="caption" sx={{ color: 'primary.contrastText', fontWeight: 700, letterSpacing: 0.5, display: { xs: 'none', md: 'block' } }}>
          ESTADO
        </Typography>
      </Box>

      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden',
          mb: 3,
        }}
      >
        {PUNTOS_CONTROL.map(({ campo, label }, idx) => (
          <InspectionRow
            key={campo}
            index={idx}
            campo={campo}
            label={label}
            data={formData.checklist[campo]}
            onChange={handleItemChange}
          />
        ))}
      </Box>

      <Typography
        variant="body2"
        sx={{
          mb: 2,
          fontStyle: 'italic',
          color: 'text.secondary',
          textAlign: 'center',
        }}
      >
        Cualquier disconformidad señalar y entregar al encargado del garaje.
      </Typography>

      <TextField
        fullWidth
        multiline
        rows={3}
        label="Otras observaciones generales"
        name="otras_observaciones"
        value={formData.otras_observaciones}
        onChange={handleRootChange}
        variant="outlined"
        placeholder="Escriba aquí cualquier observación adicional..."
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={pendientes > 0}
          endIcon={<SendIcon />}
        >
          {pendientes > 0
            ? `Faltan ${pendientes} ítems`
            : 'Enviar a Aprobación'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default VehicularInspection;
