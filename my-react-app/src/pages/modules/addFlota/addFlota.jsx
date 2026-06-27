import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';

// Iconos
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// 1. IMPORTAMOS EL NUEVO COMPONENTE MODULAR
import { INITIAL_VEHICLE_STATE } from './vehicleConstants';
import SeccionIdentificacion from './sections/identification/identification';
import SeccionDatosGenerales from './sections/generalData/generalData';
import SeccionEspecificacionesTecnicas from './sections/technicalData/technicalData';
import SeccionBateria from './sections/electricalSystem/batteryData';
import SeccionEstadoVehicular from './sections/currentState/vehicularState';
import SeccionInventario from './sections/inventoryData/inventory';
import VehicleList from './sections/listVehicles/vehicleList';

export default function AddFlota({ onNavigate }) {
  const [formData, setFormData] = useState({ ...INITIAL_VEHICLE_STATE });
  const [vehicles, setVehicles] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadVehicles = () => {
    const list = JSON.parse(localStorage.getItem('vehiculos') || '[]');
    setVehicles(list);
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.placa) {
      setSnackbar({ open: true, message: 'La placa es un campo obligatorio.', severity: 'error' });
      return;
    }

    const newVehicle = {
      ...formData,
      id: Date.now().toString(),
    };

    const existing = JSON.parse(localStorage.getItem('vehiculos') || '[]');

    // Validar placa única
    if (existing.some((v) => v.placa.toUpperCase() === formData.placa.toUpperCase())) {
      setSnackbar({ open: true, message: `La placa ${formData.placa} ya está registrada.`, severity: 'error' });
      return;
    }

    existing.push(newVehicle);
    localStorage.setItem('vehiculos', JSON.stringify(existing));

    setSnackbar({ open: true, message: 'Vehículo registrado con éxito en la flota.', severity: 'success' });
    setFormData({ ...INITIAL_VEHICLE_STATE });
    loadVehicles();
  };

  const handleDelete = (id) => {
    const updated = vehicles.filter((v) => v.id !== id);
    localStorage.setItem('vehiculos', JSON.stringify(updated));
    setSnackbar({ open: true, message: 'Vehículo eliminado de la flota.', severity: 'warning' });
    loadVehicles();
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* Cabecera */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Añadir Flota (Gestión de Vehículos)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestione y registre las unidades vehiculares de la empresa según el inventario patrimonial.
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        {/* Formulario */}
        <Grid item size={{ xs: 12, lg: 7 }}>
          <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalShippingIcon color="primary" /> Datos del Nuevo Vehículo
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              {/* SECCIÓN 1 INTEGRADÍSIMA AQUÍ */}
              <Grid item size={12}>
                <SeccionIdentificacion
                  formData={formData}
                  setFormData={setFormData}
                  vehicles={vehicles}
                />
              </Grid>
              {/* Sección 2: Especificaciones Técnicas */}
              <Grid item size={12}>
                <SeccionDatosGenerales
                  formData={formData}
                  setFormData={setFormData}
                />
              </Grid>
              {/* Sección 3: Datos técnicos */}
              <Grid item size={12}>
                <SeccionEspecificacionesTecnicas
                  formData={formData}
                  setFormData={setFormData}
                />
              </Grid>
              {/* Sección 4: Batería */}
              <Grid item size={12}>
                <SeccionBateria
                  formData={formData}
                  setFormData={setFormData}
                />
              </Grid>
              {/* Sección 5: Estados y Administración */}
              <SeccionEstadoVehicular
                formData={formData}
                setFormData={setFormData}
              />
              {/* Sección 6: Inventario */}
              <Grid item size={12}>
                <SeccionInventario
                  formData={formData}
                  setFormData={setFormData}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
              <Button type="submit" variant="contained" color="success" startIcon={<AddCircleIcon />}>
                Registrar Vehículo
              </Button>
            </Box>
          </Paper>
        </Grid>
        {/* Listado lateral */}
        <Grid item size={{ xs: 12, lg: 5 }}>
          <VehicleList vehicles={vehicles} onDelete={handleDelete} />
        </Grid>
      </Grid>
      {/* Snackbar Notificaciones */}
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
    </Box >
  );
}