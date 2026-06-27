
import { useState } from 'react';
import {
    Paper, Typography, Divider, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Box, Modal
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function VehicleList({ vehicles, onDelete }) {
    const [open, setOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const handleOpen = (vehicle) => {
        setSelectedVehicle(vehicle);
        setOpen(true);
    };

    return (
        <>
            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Flota Registrada ({vehicles.length})
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <TableContainer sx={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Placa</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Marca / Modelo</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vehicles.map((v) => (
                                <TableRow key={v.id} hover>
                                    <TableCell>{v.placa.toUpperCase()}</TableCell>
                                    <TableCell>{v.marca} {v.modelo}</TableCell>
                                    <TableCell align="center">
                                        <IconButton size="small" onClick={() => handleOpen(v)}>
                                            <VisibilityIcon fontSize="small" color="info" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => onDelete(v.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Modal de Detalle/Edición */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={{ p: 4, bgcolor: 'background.paper' }}>
                    <Typography variant="h6">Detalle de {selectedVehicle?.placa}</Typography>
                </Box>
            </Modal>
        </>
    );
}