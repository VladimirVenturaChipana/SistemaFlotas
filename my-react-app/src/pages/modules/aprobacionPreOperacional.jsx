import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, CardActions, Button, Grid,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Divider,
} from '@mui/material';

// Iconos
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import RouteIcon from '@mui/icons-material/Route';
import SpeedIcon from '@mui/icons-material/Speed';
import BusinessIcon from '@mui/icons-material/Business';

import { PUNTOS_CONTROL } from '../../utils/inspectionData';
import ModalState from '../../components/modalState';

const generateMockChecklist = () => {
  const checklist = {};
  PUNTOS_CONTROL.forEach(({ campo }, idx) => {
    if (idx === 4) {
      checklist[campo] = { estado: 'MALO', observacion: 'Pastillas de freno desgastadas por debajo del límite seguro.' };
    } else if (idx === 13) {
      checklist[campo] = { estado: 'NO_APLICA', observacion: '' };
    } else {
      checklist[campo] = { estado: 'BUENO', observacion: '' };
    }
  });
  return checklist;
};

export default function AprobacionPreOperacional() {
  const [inspections, setInspections] = useState([]);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAprobado, setModalAprobado] = useState(true);

  // Cargar inspecciones desde localStorage
  const loadInspections = () => {
    const list = JSON.parse(localStorage.getItem('inspecciones') || '[]');
    setInspections(list);
  };

  useEffect(() => {
    loadInspections();
  }, []);

  // Generar una inspección de prueba si el usuario lo desea o para iniciar
  const handleCreateMock = () => {
    const newMock = {
      id: Date.now().toString(),
      vehiculo_id: 'veh-mock-hilux',
      placa: 'F4D-891',
      marca: 'Toyota',
      modelo: 'Hilux 4x4 D/C',
      conductor: 'Carlos Mendoza',
      fecha: new Date().toLocaleDateString(),
      estado: 'pendiente',

      // MOVIMIENTOS_DIARIOS
      movimiento: {
        id: 'mov-mock',
        vehiculo_id: 'veh-mock-hilux',
        conductor_id: 'Carlos Mendoza',
        fecha: new Date().toISOString().split('T')[0],
        kilometraje_salida: 12500,
        kilometraje_llegada: null,
        hora_salida: '07:30',
        hora_llegada: null,
        horas_utilizacion: 0,
        destino: 'Mina Central',
        sector_solicitante: 'Producción',
      },

      // CHECKLIST_VERIFICACION
      checklist: generateMockChecklist(),
      otras_observaciones: 'El vehículo rechina ligeramente al frenar, requiere revisión técnica.',
    };

    const existing = JSON.parse(localStorage.getItem('inspecciones') || '[]');
    existing.push(newMock);
    localStorage.setItem('inspecciones', JSON.stringify(existing));
    loadInspections();
  };

  // Obtener detalles adicionales del vehículo cruzando con localStorage
  const getFullVehicleDetails = (vehiculo_id) => {
    const list = JSON.parse(localStorage.getItem('vehiculos') || '[]');
    return list.find((v) => v.id === vehiculo_id) || null;
  };

  // Limpiar historial de pruebas
  const handleClearHistory = () => {
    localStorage.removeItem('inspecciones');
    setInspections([]);
  };

  // Actualizar estado de aprobación
  const handleUpdateStatus = (id, newStatus) => {
    const updated = inspections.map((ins) => {
      if (ins.id === id) {
        return { ...ins, estado: newStatus };
      }
      return ins;
    });
    setInspections(updated);
    localStorage.setItem('inspecciones', JSON.stringify(updated));
  };

  const handleApprove = (id) => {
    handleUpdateStatus(id, 'aprobado');
    setModalAprobado(true);
    setIsModalOpen(true);
  };

  const handleDeny = (id) => {
    handleUpdateStatus(id, 'denegado');
    setModalAprobado(false);
    setIsModalOpen(true);
  };

  const handleOpenDetails = (inspection) => {
    setSelectedInspection(inspection);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedInspection(null);
    setIsDetailsOpen(false);
  };

  // Determinar los colores del chip de estado
  const getStatusChip = (estado) => {
    switch (estado) {
      case 'aprobado':
        return (
          <Chip
            icon={<CheckCircleIcon style={{ color: 'white' }} />}
            label="Aprobado"
            color="success"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        );
      case 'denegado':
        return (
          <Chip
            icon={<CancelIcon style={{ color: 'white' }} />}
            label="Denegado"
            color="error"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        );
      default:
        return (
          <Chip
            icon={<HourglassEmptyIcon />}
            label="Pendiente"
            color="warning"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        );
    }
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* Cabecera */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Aprobación Pre-Operacional
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Evalúe y autorice el uso de vehículos en base a los checklists y movimientos diarios enviados por los conductores.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AddCircleOutlinedIcon />}
            onClick={handleCreateMock}
            size="small"
          >
            Generar Demo
          </Button>
          {inspections.length > 0 && (
            <Button
              variant="text"
              color="error"
              onClick={handleClearHistory}
              size="small"
            >
              Limpiar Todo
            </Button>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Lista de Cards */}
      {inspections.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: 'background.paper',
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <DirectionsCarIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No hay inspecciones enviadas
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 450, mx: 'auto' }}>
            Las inspecciones enviadas desde el módulo "Inspección de vehículo (Cond.)" aparecerán aquí para revisión.
          </Typography>
          <Button variant="contained" onClick={handleCreateMock}>
            Generar una inspección de prueba
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {[...inspections].reverse().map((inspection) => (
            <Grid item xs={12} sm={6} md={4} key={inspection.id}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                  {/* Encabezado de Tarjeta */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsCarIcon color="primary" /> {inspection.placa}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {inspection.marca} {inspection.modelo}
                      </Typography>
                    </Box>
                    {getStatusChip(inspection.estado)}
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Detalles del conductor y fecha */}
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <strong>Conductor:</strong> {inspection.conductor}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Fecha:</strong> {inspection.fecha}
                  </Typography>

                  {/* Información del Movimiento Diario */}
                  {inspection.movimiento && (
                    <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 1, mb: 1.5 }}>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                        MOVIMIENTO DIARIO
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <RouteIcon fontSize="inherit" color="action" />
                        <Typography variant="body2"><strong>Destino:</strong> {inspection.movimiento.destino}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <BusinessIcon fontSize="inherit" color="action" />
                        <Typography variant="body2"><strong>Sector:</strong> {inspection.movimiento.sector_solicitante}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SpeedIcon fontSize="inherit" color="action" />
                        <Typography variant="body2"><strong>Km Salida:</strong> {inspection.movimiento.kilometraje_salida} km</Typography>
                      </Box>
                    </Box>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontStyle: 'italic',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <strong>Obs:</strong> {inspection.otras_observaciones || 'Sin observaciones.'}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleOpenDetails(inspection)}
                    sx={{ flexGrow: 1 }}
                  >
                    Ver Detalles
                  </Button>

                  {inspection.estado === 'pendiente' && (
                    <Box sx={{ display: 'flex', gap: 1, width: '100%', mt: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleApprove(inspection.id)}
                        sx={{ flexGrow: 1 }}
                      >
                        Aprobar
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleDeny(inspection.id)}
                        sx={{ flexGrow: 1 }}
                      >
                        Denegar
                      </Button>
                    </Box>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialogo de Detalles de Checklist */}
      <Dialog
        open={isDetailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        {selectedInspection && (() => {
          const fullVeh = getFullVehicleDetails(selectedInspection.vehiculo_id);
          return (
            <>
              <DialogTitle sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'primary.contrastText', py: 2 }}>
                Ficha de Inspección Pre-Operacional — {selectedInspection.placa}
              </DialogTitle>
              <DialogContent dividers sx={{ p: 0 }}>
                {/* 1. Información General y Movimiento */}
                <Box sx={{ p: 3, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                        DATOS DEL MOVIMIENTO DIARIO
                      </Typography>
                      <Typography variant="body2"><strong>Conductor:</strong> {selectedInspection.conductor}</Typography>
                      <Typography variant="body2"><strong>Fecha Envío:</strong> {selectedInspection.fecha}</Typography>
                      {selectedInspection.movimiento && (
                        <>
                          <Typography variant="body2"><strong>Hora Salida:</strong> {selectedInspection.movimiento.hora_salida}</Typography>
                          <Typography variant="body2"><strong>Kilometraje de Salida:</strong> {selectedInspection.movimiento.kilometraje_salida} km</Typography>
                          <Typography variant="body2"><strong>Destino:</strong> {selectedInspection.movimiento.destino}</Typography>
                          <Typography variant="body2"><strong>Sector Solicitante:</strong> {selectedInspection.movimiento.sector_solicitante}</Typography>
                        </>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                        ESPECIFICACIONES DEL VEHÍCULO
                      </Typography>
                      <Typography variant="body2"><strong>Marca / Modelo:</strong> {selectedInspection.marca} {selectedInspection.modelo}</Typography>
                      <Typography variant="body2"><strong>Estado Actual de Inspección:</strong></Typography>
                      <Box sx={{ my: 0.5 }}>{getStatusChip(selectedInspection.estado)}</Box>

                      {/* Mostrar detalles de base de datos de addFlota si existe */}
                      {fullVeh ? (
                        <Box sx={{ mt: 1, p: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'background.paper' }}>
                          <Typography variant="caption" display="block"><strong>Código Patrimonial:</strong> {fullVeh.codigo_patrimonial}</Typography>
                          <Typography variant="caption" display="block"><strong>N° Motor:</strong> {fullVeh.numero_motor}</Typography>
                          <Typography variant="caption" display="block"><strong>Combustible:</strong> {fullVeh.tipo_combustible} | <strong>Ejes:</strong> {fullVeh.configuracion_ejes}</Typography>
                          <Typography variant="caption" display="block"><strong>Batería:</strong> {fullVeh.bateria_tipo} ({fullVeh.bateria_voltios}V / {fullVeh.bateria_amperios}Ah)</Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          (Vehículo temporal sin ficha técnica registrada en Flota)
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>

                {/* 2. Tabla de Puntos de Control */}
                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
                  <Table stickyHeader aria-label="checklist table" size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Punto de Control</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', width: '120px' }}>Estado</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Observación Técnica</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {PUNTOS_CONTROL.map(({ campo, label }) => {
                        const item = selectedInspection.checklist?.[campo] || { estado: 'NO_EVALUADO', observacion: '' };
                        let chipColor = 'default';
                        let chipLabel = 'Sin Evaluar';

                        if (item.estado === 'BUENO') {
                          chipColor = 'success';
                          chipLabel = 'Bueno';
                        } else if (item.estado === 'MALO') {
                          chipColor = 'error';
                          chipLabel = 'Malo';
                        } else if (item.estado === 'NO_APLICA') {
                          chipColor = 'default';
                          chipLabel = 'N/A';
                        }

                        return (
                          <TableRow key={campo} hover>
                            <TableCell sx={{ py: 1.2 }}>{label}</TableCell>
                            <TableCell align="center" sx={{ py: 1.2 }}>
                              <Chip label={chipLabel} color={chipColor} size="small" sx={{ fontWeight: 600, minWidth: 70 }} />
                            </TableCell>
                            <TableCell sx={{ py: 1.2, color: item.estado === 'MALO' ? 'error.main' : 'text.primary', fontStyle: item.estado === 'MALO' ? 'normal' : 'italic' }}>
                              {item.observacion || (item.estado === 'MALO' ? 'Falta ingresar observación' : '-')}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* 3. Otras Observaciones del Conductor */}
                <Box sx={{ p: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Otras observaciones generales del conductor:
                  </Typography>
                  <Typography variant="body2" sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: 'divider', fontStyle: 'italic' }}>
                    {selectedInspection.otras_observaciones || 'No se ingresaron observaciones adicionales.'}
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Box>
                  {selectedInspection.estado === 'pendiente' && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => {
                          handleApprove(selectedInspection.id);
                          handleCloseDetails();
                        }}
                      >
                        Aprobar Vehículo
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          handleDeny(selectedInspection.id);
                          handleCloseDetails();
                        }}
                      >
                        Denegar Vehículo
                      </Button>
                    </Box>
                  )}
                </Box>
                <Button onClick={handleCloseDetails} variant="outlined" color="primary">
                  Cerrar
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>

      {/* Modal de Aprobado / Desaprobado */}
      <ModalState
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aprobado={modalAprobado}
      />
    </Box>
  );
}
