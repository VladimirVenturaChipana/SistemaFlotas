import { Grid, Typography, TextField } from '@mui/material';

export default function SeccionInventario({ formData, setFormData }) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Grid container spacing={2}>
            <Grid size={12} sx={{ mt: 1 }}>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                    Inventario de Herramientas y Accesorios
                </Typography>
            </Grid>
            <Grid size={12}>
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Inventario Herramientas"
                    name="inventario_herramientas"
                    value={formData.inventario_herramientas || ''}
                    onChange={handleInputChange}
                />
            </Grid>
        </Grid>
    );
}