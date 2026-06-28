import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, TextField, Button, Paper, Divider,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import SendIcon from '@mui/icons-material/Send';

// Función auxiliar para formatear la hora
const formatTime = (date) => {
    if (!date) return '--:--';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Función auxiliar para calcular diferencia de horas
const calcDiferenciaHoras = (inicio, fin) => {
    if (!inicio || !fin) return '00:00';
    const diff = new Date(fin) - new Date(inicio);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export default function Rutas() {
    // Estado General de la Jornada
    const [jornadaIniciada, setJornadaIniciada] = useState(false);
    const [jornadaFinalizada, setJornadaFinalizada] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);

    // Datos de Cabecera (Jalados de módulos anteriores)
    const [cabecera, setCabecera] = useState({
        codigo_vehiculo: '', placa: '', fecha: new Date().toLocaleDateString(),
        conductor_nombre: 'Juan Pérez', conductor_matricula: 'MAT-8541',
        combustible_galones: '', orden_abastecimiento: ''
    });

    // Control de Tiempos y Kilometrajes Generales
    const [kmInicialGeneral, setKmInicialGeneral] = useState('');
    const [horaSalidaGeneral, setHoraSalidaGeneral] = useState(null);
    const [horaLlegadaGeneral, setHoraLlegadaGeneral] = useState(null);
    const [kmLlegadaGeneral, setKmLlegadaGeneral] = useState(0);

    // Arreglo de Tramos (El detalle infinito)
    const [tramos, setTramos] = useState([]);
    const [tramoActual, setTramoActual] = useState({ destino: '', km_llegada: '' });

    // 1. Simulación de carga de datos previos (Abastecimiento y Checklist)
    useEffect(() => {
        const ordenes = JSON.parse(localStorage.getItem('ordenes_combustible') || '[]');
        const ultimaOrden = ordenes[ordenes.length - 1]; // Asumimos la última completada

        if (ultimaOrden) {
            setCabecera(prev => ({
                ...prev,
                codigo_vehiculo: ultimaOrden.vehiculo_id || 'V-001',
                placa: ultimaOrden.placa || 'ABC-123',
                combustible_galones: ultimaOrden.cantidad_galones || '0',
                orden_abastecimiento: ultimaOrden.numero_orden || 'S/N'
            }));
            setKmInicialGeneral(ultimaOrden.kilometraje_actual || '');
        }
    }, []);

    // 2. Iniciar la jornada y el primer tramo
    const handleIniciarJornada = () => {
        if (!kmInicialGeneral) return alert("Ingrese el KM inicial del odómetro.");

        const ahora = new Date().toISOString();
        setHoraSalidaGeneral(ahora);
        setJornadaIniciada(true);

        // Crear el primer tramo base
        setTramos([{
            id: 1,
            destino: '',
            hora_salida: ahora,
            hora_llegada: null,
            km_salida: Number(kmInicialGeneral),
            km_llegada: null
        }]);
    };

    // 3. Cerrar el tramo actual y abrir uno nuevo
    const handleSiguienteTramo = () => {
        if (!tramoActual.destino || !tramoActual.km_llegada) {
            return alert("Debe llenar el destino y el KM de llegada del tramo actual.");
        }

        const ahora = new Date().toISOString();
        const kmLlegada = Number(tramoActual.km_llegada);
        const kmSalidaAnterior = tramos[tramos.length - 1].km_salida;

        if (kmLlegada <= kmSalidaAnterior) {
            return alert("El KM de llegada debe ser mayor al KM de salida de este tramo.");
        }

        // Actualizar el tramo que se está cerrando
        const tramosActualizados = [...tramos];
        tramosActualizados[tramosActualizados.length - 1] = {
            ...tramosActualizados[tramosActualizados.length - 1],
            destino: tramoActual.destino,
            hora_llegada: ahora,
            km_llegada: kmLlegada
        };

        // Crear el nuevo tramo (su hora salida es la hora llegada del anterior)
        tramosActualizados.push({
            id: tramosActualizados.length + 1,
            destino: '',
            hora_salida: ahora,
            hora_llegada: null,
            km_salida: kmLlegada,
            km_llegada: null
        });

        setTramos(tramosActualizados);
        setTramoActual({ destino: '', km_llegada: '' }); // Limpiar inputs para el nuevo tramo
    };

    // 4. Finalizar toda la jornada de rutas
    const handleFinalizarJornada = () => {
        if (!tramoActual.destino || !tramoActual.km_llegada) {
            return alert("Complete el último destino y KM de llegada antes de finalizar la jornada.");
        }

        const ahora = new Date().toISOString();
        const kmFinal = Number(tramoActual.km_llegada);

        // Cerrar el último tramo
        const tramosActualizados = [...tramos];
        tramosActualizados[tramosActualizados.length - 1] = {
            ...tramosActualizados[tramosActualizados.length - 1],
            destino: tramoActual.destino,
            hora_llegada: ahora,
            km_llegada: kmFinal
        };

        setTramos(tramosActualizados);
        setHoraLlegadaGeneral(ahora);
        setKmLlegadaGeneral(kmFinal);
        setJornadaFinalizada(true);
        setModalAbierto(true);
    };

    // 5. Enviar el reporte consolidado al inspector (Guardar en DB)
    const handleEnviarReporte = () => {
        const reporteFinal = {
            id_movimiento: `MOV-${Date.now()}`,
            fecha: cabecera.fecha,
            vehiculo_id: cabecera.codigo_vehiculo,
            conductor_id: cabecera.conductor_matricula,
            kilometraje_salida: Number(kmInicialGeneral),
            kilometraje_llegada: kmLlegadaGeneral,
            hora_salida: horaSalidaGeneral,
            hora_llegada: horaLlegadaGeneral,
            horas_utilizacion: calcDiferenciaHoras(horaSalidaGeneral, horaLlegadaGeneral),
            tramos: tramos
        };

        const movimientos = JSON.parse(localStorage.getItem('movimientos_diarios') || '[]');
        movimientos.push(reporteFinal);
        localStorage.setItem('movimientos_diarios', JSON.stringify(movimientos));

        setModalAbierto(false);
        alert("¡Reporte de Movimiento Diario enviado al Inspector con éxito!");
        window.location.reload(); // Reiniciar la vista
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Registro de Movimiento Diario de Vehículo
            </Typography>

            {/* PANEL DE CABECERA (Como en el formato físico) */}
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">VEHÍCULO</Typography>
                        <Typography variant="body1"><strong>Código:</strong> {cabecera.codigo_vehiculo}</Typography>
                        <Typography variant="body1"><strong>Placa:</strong> {cabecera.placa}</Typography>
                        <Typography variant="body1"><strong>Fecha:</strong> {cabecera.fecha}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">CONDUCTOR</Typography>
                        <Typography variant="body1"><strong>Nombre:</strong> {cabecera.conductor_nombre}</Typography>
                        <Typography variant="body1"><strong>Matrícula:</strong> {cabecera.conductor_matricula}</Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">ABASTECIMIENTO</Typography>
                        <Typography variant="body1"><strong>Combustible:</strong> {cabecera.combustible_galones} GL</Typography>
                        <Typography variant="body1"><strong>Ord. Abastecimiento:</strong> {cabecera.orden_abastecimiento}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* BOTÓN DE INICIO Y KM GENERAL */}
            {!jornadaIniciada ? (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="h6" gutterBottom>Iniciar Jornada de Rutas</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center', mt: 2 }}>
                        <TextField
                            label="Kilometraje Odómetro (Salida)"
                            type="number"
                            size="small"
                            value={kmInicialGeneral}
                            onChange={(e) => setKmInicialGeneral(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            startIcon={<PlayArrowIcon />}
                            onClick={handleIniciarJornada}
                        >
                            Iniciar Rutas
                        </Button>
                    </Box>
                </Paper>
            ) : (
                <Box>
                    {/* TABLA DE TRAMOS */}
                    <TableContainer component={Paper} sx={{ mb: 3 }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: 'primary.main' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>N°</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Destino</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Hora Salida</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Hora Llegada</TableCell>
                                    <TableCell sx={{ color: 'white' }}>KM Salida</TableCell>
                                    <TableCell sx={{ color: 'white' }}>KM Llegada</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tramos.map((tramo, index) => {
                                    const esUltimo = index === tramos.length - 1 && !jornadaFinalizada;
                                    return (
                                        <TableRow key={tramo.id}>
                                            <TableCell>{tramo.id}</TableCell>
                                            <TableCell>
                                                {esUltimo ? (
                                                    <TextField
                                                        size="small"
                                                        placeholder="Destino Manual..."
                                                        value={tramoActual.destino}
                                                        onChange={(e) => setTramoActual({ ...tramoActual, destino: e.target.value })}
                                                    />
                                                ) : tramo.destino}
                                            </TableCell>
                                            <TableCell>{formatTime(tramo.hora_salida)}</TableCell>
                                            <TableCell>{formatTime(tramo.hora_llegada)}</TableCell>
                                            <TableCell>{tramo.km_salida}</TableCell>
                                            <TableCell>
                                                {esUltimo ? (
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        placeholder="KM actual"
                                                        value={tramoActual.km_llegada}
                                                        onChange={(e) => setTramoActual({ ...tramoActual, km_llegada: e.target.value })}
                                                    />
                                                ) : tramo.km_llegada}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* BOTONES DE ACCIÓN DEL TRAMO */}
                    {!jornadaFinalizada && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<AddRoadIcon />}
                                onClick={handleSiguienteTramo}
                            >
                                Registrar Llegada y Añadir Nuevo Tramo
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<StopIcon />}
                                onClick={handleFinalizarJornada}
                            >
                                Finalizar Jornada Completa
                            </Button>
                        </Box>
                    )}
                </Box>
            )}

            {/* MODAL DE RESUMEN FINAL */}
            <Dialog open={modalAbierto} maxWidth="md" fullWidth>
                <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
                    Resumen de Movimiento Diario
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f0f4f8' }}>
                                <Typography variant="subtitle1" fontWeight="bold">TIEMPO TOTAL</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="body2">Salida: {formatTime(horaSalidaGeneral)}</Typography>
                                <Typography variant="body2">Llegada: {formatTime(horaLlegadaGeneral)}</Typography>
                                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                    Total: {calcDiferenciaHoras(horaSalidaGeneral, horaLlegadaGeneral)} hrs
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f0f4f8' }}>
                                <Typography variant="subtitle1" fontWeight="bold">RECORRIDO TOTAL</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="body2">KM Inicial: {kmInicialGeneral}</Typography>
                                <Typography variant="body2">KM Final: {kmLlegadaGeneral}</Typography>
                                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                    Total: {kmLlegadaGeneral - Number(kmInicialGeneral)} KM
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        size="large"
                        color="success"
                        endIcon={<SendIcon />}
                        onClick={handleEnviarReporte}
                    >
                        Confirmar y Enviar al Inspector de Vehículos
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}