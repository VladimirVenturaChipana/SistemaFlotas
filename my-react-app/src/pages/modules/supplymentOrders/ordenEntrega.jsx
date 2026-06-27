// src/pages/modules/addCombustible/abastecimiento.jsx
import { useState, useEffect } from 'react';
import { Box, Typography, Grid, TextField, Button, Paper, Divider, Checkbox, FormControlLabel, Snackbar, Alert } from '@mui/material';

export default function Abastecimiento() {
    const [ordenPendiente, setOrdenPendiente] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    // Cargar la última orden pendiente al abrir la pestaña
    useEffect(() => {
        const ordenes = JSON.parse(localStorage.getItem('ordenes_combustible') || '[]');
        const pendiente = ordenes.find(o => o.estado_orden === 'PENDIENTE');
        if (pendiente) {
            setOrdenPendiente(pendiente);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOrdenPendiente(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Actualizamos la orden a COMPLETADA
        const ordenes = JSON.parse(localStorage.getItem('ordenes_combustible') || '[]');
        const actualizadas = ordenes.map(o =>
            o.id === ordenPendiente.id ? { ...ordenPendiente, estado_orden: 'COMPLETADA' } : o
        );
        localStorage.setItem('ordenes_combustible', JSON.stringify(actualizadas));

        setSnackbar({ open: true, message: 'Ficha de abastecimiento completada y enviada a Garaje' });
        setOrdenPendiente(null); // Desaparece la orden de la vista
    };

    if (!ordenPendiente) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">No tienes órdenes de abastecimiento pendientes.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Completar Abastecimiento (Conductor)
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                <Grid container spacing={2}>
                    {/* Resumen de la orden (Solo Lectura) */}
                    <Grid item xs={12}><Typography variant="subtitle2" color="text.secondary">Orden asignada: {ordenPendiente.numero_orden} - Vehículo: {ordenPendiente.vehiculo_id}</Typography></Grid>

                    {/* Datos del Servicentro */}
                    <Grid item xs={12} sx={{ mt: 2 }}><Typography variant="subtitle1" color="primary">1. Datos del Servicentro</Typography></Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Nombre Servicentro" name="nombre_serviccentro" value={ordenPendiente.nombre_serviccentro} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField fullWidth label="N° Ticket / Factura" name="numero_ticket_serviccentro" value={ordenPendiente.numero_ticket_serviccentro} onChange={handleChange} required />
                    </Grid>

                    {/* Detalle Técnico */}
                    <Grid item xs={12} sx={{ mt: 2 }}><Typography variant="subtitle1" color="primary">2. Consumo</Typography></Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth type="number" label="Kilometraje Actual" name="kilometraje_actual" value={ordenPendiente.kilometraje_actual} onChange={handleChange} required />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField fullWidth type="number" label="Galones Abastecidos" name="cantidad_galones" value={ordenPendiente.cantidad_galones} onChange={handleChange} required />
                    </Grid>

                    <Grid item xs={12}>
                        <FormControlLabel control={<Checkbox name="incluye_aceite_motor" checked={ordenPendiente.incluye_aceite_motor} onChange={handleChange} />} label="Se agregó Aceite de Motor" />
                    </Grid>

                    {ordenPendiente.incluye_aceite_motor && (
                        <Grid item xs={12} md={6} sx={{ display: 'flex', gap: 2 }}>
                            <TextField fullWidth size="small" label="Litros (Lt)" name="cantidad_aceite_motor_lt" value={ordenPendiente.cantidad_aceite_motor_lt} onChange={handleChange} />
                            <TextField fullWidth size="small" label="Viscosidad" name="viscosidad_aceite_motor" value={ordenPendiente.viscosidad_aceite_motor} onChange={handleChange} />
                        </Grid>
                    )}

                    <Grid item xs={12} sx={{ mt: 3 }}>
                        <FormControlLabel control={<Checkbox name="sello_serviccentro" checked={ordenPendiente.sello_serviccentro} onChange={handleChange} required />} label="Confirmo que el ticket cuenta con el Sello/Firma del Servicentro" />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="contained" color="success">Enviar Ficha</Button>
                    </Grid>
                </Grid>
            </Paper>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity="success">{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}