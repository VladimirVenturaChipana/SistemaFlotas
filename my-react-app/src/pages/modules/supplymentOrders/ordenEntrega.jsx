// src/pages/modules/addCombustible/ordenEntrega.jsx
import { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, TextField, Button, Paper, Divider,
  List, ListItem, ListItemButton, ListItemText, Snackbar, Alert, Card, CardContent
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import DrawIcon from '@mui/icons-material/Draw';

export default function OrdenEntrega() {
  const [inspeccionesAprobadas, setInspeccionesAprobadas] = useState([]);
  const [inspeccionSeleccionada, setInspeccionSeleccionada] = useState(null);
  const [numeroOrdenAuto, setNumeroOrdenAuto] = useState('');

  // Campos manuales que le corresponden estrictamente al Inspector/Encargado
  const [sector, setSector] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [firmaDigital, setFirmaDigital] = useState('');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Cargar únicamente las inspecciones aprobadas de la lista general
  useEffect(() => {
    const todasLasInspecciones = JSON.parse(localStorage.getItem('inspecciones') || '[]');
    // Filtrar estrictamente por el estado 'aprobado' que viene del checklist
    const aprobadasYListas = todasLasInspecciones.filter(ins => ins.estado === 'aprobado');
    setInspeccionesAprobadas(aprobadasYListas);
  }, []);

  // Al seleccionar una inspección de la lista de pendientes
  const handleSeleccionarInspeccion = (inspeccion) => {
    setInspeccionSeleccionada(inspeccion);

    // REQUERIMIENTO: Código de orden automático iniciando en 000001 si no hay previas
    const ordenesExistentes = JSON.parse(localStorage.getItem('ordenes_combustible') || '[]');
    const siguienteCorrelativo = ordenesExistentes.length + 1;
    const nuevoNumero = `ORD-${String(siguienteCorrelativo).padStart(6, '0')}`; // Resultado: ORD-000001, ORD-000002...
    setNumeroOrdenAuto(nuevoNumero);

    setSector('');
    setLocalidad('');
    setFirmaDigital('');
  };

  const handleSubmitOrden = (e) => {
    e.preventDefault();
    if (!inspeccionSeleccionada) return;

    // Construcción del objeto de la orden que viajará al módulo del Conductor
    const nuevaOrdenAbastecimiento = {
      id: Date.now().toString(),
      numero_orden: numeroOrdenAuto,
      fecha_emision: new Date().toLocaleDateString(),
      vehiculo_id: inspeccionSeleccionada.vehiculo_id,
      placa: inspeccionSeleccionada.placa,
      conductor: inspeccionSeleccionada.conductor, // Almacena a quién va dirigida

      // Datos del Solicitante ingresados por el Inspector
      solicitante: {
        sector: sector,
        localidad: localidad
      },
      firma_inspector: firmaDigital || "FIRMA_ELECTRONICA_VALIDADA",

      // ESTADO INICIAL: Todo lo del conductor y servicentro se va vacío aquí
      estado_orden: 'PENDIENTE',
      nombre_serviccentro: '',
      numero_ticket_serviccentro: '',
      kilometraje_actual: '',
      cantidad_galones: '',
      sello_serviccentro: false,
      incluye_aceite_motor: false,
      cantidad_aceite_motor_lt: '',
      viscosidad_aceite_motor: ''
    };

    // Guardar la orden generada en el almacén de combustible
    const ordenesExistentes = JSON.parse(localStorage.getItem('ordenes_combustible') || '[]');
    ordenesExistentes.push(nuevaOrdenAbastecimiento);
    localStorage.setItem('ordenes_combustible', JSON.stringify(ordenesExistentes));

    // Sacar la inspección de la lista de pendientes (ya fue atendida con su orden)
    const todasLasInspecciones = JSON.parse(localStorage.getItem('inspecciones') || '[]');
    const filtradas = todasLasInspecciones.filter(ins => ins.id !== inspeccionSeleccionada.id);
    localStorage.setItem('inspecciones', JSON.stringify(filtradas));
    setInspeccionesAprobadas(filtradas.filter(ins => ins.estado === 'aprobado'));

    setSnackbar({ open: true, message: `¡Orden ${numeroOrdenAuto} generada correctamente!`, severity: 'success' });
    setInspeccionSeleccionada(null);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
        Emisión de Órdenes de Abastecimiento (MA 122 01 02)
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Genere la documentación de combustible para las unidades autorizadas.
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        {/* LISTA IZQUIERDA: VEHÍCULOS ESPERANDO ORDEN */}
        <Grid item size={4}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2, maxHeight: '70vh', overflowY: 'auto' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
              Unidades con Checklist Aprobado ({inspeccionesAprobadas.length})
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {inspeccionesAprobadas.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                No hay unidades aprobadas pendientes de orden.
              </Typography>
            ) : (
              <List>
                {inspeccionesAprobadas.map((ins) => (
                  <ListItem key={ins.id} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() => handleSeleccionarInspeccion(ins)}
                      selected={inspeccionSeleccionada?.id === ins.id}
                      sx={{ borderRadius: 1 }}
                    >
                      <ListItemText
                        primary={`Vehículo Placa: ${ins.placa.toUpperCase()}`}
                        secondary={`Asignado a: ${ins.conductor}`}
                        secondaryTypographyProps={{ fontSize: '12px' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* DETALLE DERECHO: FORMULARIO EXCLUSIVO DEL INSPECTOR */}
        <Grid item size={8}>
          {inspeccionSeleccionada ? (
            <Box component="form" onSubmit={handleSubmitOrden}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 2, borderTop: '4px solid', borderColor: 'primary.main' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalGasStationIcon color="primary" /> Datos del Documento de Entrega
                  </Typography>
                  <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                    {numeroOrdenAuto}
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* ASIGNACIÓN DE VEHÍCULO AUTOMÁTICA EXTRAÍDA DEL CHECKLIST */}
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth disabled size="small" label="Fecha de Emisión" value={new Date().toLocaleDateString()} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth disabled size="small" label="Código Vehículo" value={inspeccionSeleccionada.vehiculo_id} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField fullWidth disabled size="small" label="Placa de Rodaje" value={inspeccionSeleccionada.placa.toUpperCase()} />
                  </Grid>

                  <Grid item size={12}>Información del Solicitante</Grid>

                  {/* INPUTS ESCRITOS REQUERIDOS */}
                  <Grid item size={6}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      label="Sector del Solicitante"
                      placeholder="Ej: Mantenimiento de Redes"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                    />
                  </Grid>
                  <Grid item size={6}>
                    <TextField
                      fullWidth
                      required
                      size="small"
                      label="Localidad donde opera"
                      placeholder="Ej: Planta Callao, Sede Centro"
                      value={localidad}
                      onChange={(e) => setLocalidad(e.target.value)}
                    />
                  </Grid>

                  <Grid item size={12}>Firma de Autorización</Grid>

                  {/* PANEL SIMULADO DE FIRMA ELECTRÓNICA */}
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ bgcolor: 'action.hover', borderStyle: 'dashed' }}>
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <DrawIcon sx={{ fontSize: 28, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                          Por seguridad, digite su nombre o credencial de encargado para firmar el documento.
                        </Typography>
                        <TextField
                          required
                          size="small"
                          label="Firma / ID del Encargado"
                          placeholder="Ej: L. GARAJE"
                          sx={{ maxWidth: 280, bgcolor: 'background.paper' }}
                          value={firmaDigital}
                          onChange={(e) => setFirmaDigital(e.target.value)}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid item size={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained" color="primary" size="large">
                    Emitir Orden
                  </Button>
                </Grid>
              </Paper>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '45vh', border: '2px dashed', borderColor: 'divider', borderRadius: 2, p: 3, textAlign: 'center' }}>
              <AssignmentIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1.5 }} />
              <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                Esperando selección
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Seleccione una unidad aprobada a la izquierda para procesar la Orden de Abastecimiento.
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}