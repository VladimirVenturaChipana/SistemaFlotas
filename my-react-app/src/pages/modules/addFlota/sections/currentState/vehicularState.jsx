import { Grid, Typography, ToggleButton, ToggleButtonGroup, TextField } from '@mui/material';
import { filtrarEntradaMantenimiento, obtenerErrorMantenimiento } from './logicVehicularState';

export default function SeccionMantenimiento({ formData, setFormData }) {

    // Manejador único para todos los campos (tanto botones como inputs)
    const handleInputChange = (e, nameProp, valueProp) => {
        const name = nameProp || e.target.name;
        const value = valueProp !== undefined ? valueProp : e.target.value;

        const valorFiltrado = filtrarEntradaMantenimiento(name, value);
        setFormData((prev) => ({ ...prev, [name]: valorFiltrado }));
    };

    const estados = [
        { label: 'Pintura', name: 'estado_pintura' },
        { label: 'Faros', name: 'estado_faros' },
        { label: 'Lunas', name: 'estado_lunas' }
    ];

    // Función para definir el color según el estado
    const getColor = (value) => {
        if (value === 'BUENO') return 'success';
        if (value === 'MALO') return 'error';
        return 'standard'; // 'standard' o 'neutral' en MUI
    };

    return (
        <Grid container spacing={3}>
            <Grid size={12} sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                    Estado de Conservación
                </Typography>
            </Grid>

            {/* Grupos de botones para estados */}
            {estados.map((item) => (
                <Grid size={{ xs: 12, sm: 4 }} key={item.name}>
                    <Typography variant="caption" sx={{ mb: 0.5, fontWeight: 'bold' }}>{item.label}</Typography>
                    <ToggleButtonGroup
                        // Aplicamos el color dinámico al grupo según el valor actual[cite: 8]
                        color={getColor(formData[item.name])}
                        value={formData[item.name]}
                        exclusive
                        onChange={(e, val) => val !== null && handleInputChange(null, item.name, val)}
                        fullWidth
                        size="small"
                    >
                        <ToggleButton value="BUENO">Bueno</ToggleButton>
                        <ToggleButton value="REGULAR">Regular</ToggleButton>
                        <ToggleButton value="MALO">Malo</ToggleButton>
                    </ToggleButtonGroup>
                </Grid>
            ))}
            {/* Campos Financieros */}
            {[
                { label: 'Valor Adquisición', name: 'valor_adquisicion' },
                { label: 'Vida Útil (años)', name: 'vida_util_anios' },
                { label: 'Seguro Anual', name: 'seguro_anual' },
                { label: 'Licenciamiento', name: 'licenciamiento_anual' }
            ].map((field) => (
                <Grid size={{ xs: 6, sm: 3 }} key={field.name}>
                    <TextField
                        fullWidth size="small" type="number"
                        label={field.label}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        error={!!obtenerErrorMantenimiento(field.name, formData[field.name])}
                        helperText={obtenerErrorMantenimiento(field.name, formData[field.name])}
                    />
                </Grid>
            ))}

            <Grid size={12}>
                <TextField
                    fullWidth size="small" type="number"
                    label="Periodicidad Mantenimiento (km)"
                    name="periodicidad_mantenimiento_km"
                    value={formData.periodicidad_mantenimiento_km}
                    onChange={handleInputChange}
                />
            </Grid>
        </Grid>
    );
}