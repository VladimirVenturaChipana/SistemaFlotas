import {
    Box,
    Typography,
    ToggleButtonGroup,
    ToggleButton,
    Collapse,
    TextField,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

function InspectionRow({ index, campo, label, data, onChange }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const isMalo = data.estado === 'MALO';
    const isEven = index % 2 === 0;

    const handleEstado = (_e, nuevoEstado) => {
        if (nuevoEstado === null) return;
        onChange(campo, 'estado', nuevoEstado);
        if (nuevoEstado !== 'MALO') {
            onChange(campo, 'observacion', '');
        }
    };

    const handleObservacion = (e) => {
        onChange(campo, 'observacion', e.target.value);
    };

    return (
        <Box
            sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: isEven
                    ? (isDark ? 'grey.900' : 'grey.50')
                    : 'background.paper',
                transition: 'background-color 0.2s',
            }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1.5,
                }}
            >
                <Typography
                    variant="body2"
                    sx={{ fontWeight: data.estado ? 600 : 400, lineHeight: 1.4 }}
                >
                    {label}
                </Typography>
                <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={data.estado}
                    onChange={handleEstado}
                    aria-label={`estado-${campo}`}
                    sx={{ flexShrink: 0 }}
                >
                    <ToggleButton
                        value="BUENO"
                        aria-label="Bueno"
                        sx={{
                            px: 1.5,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            '&.Mui-selected': {
                                bgcolor: 'success.main',
                                color: 'success.contrastText',
                                '&:hover': { bgcolor: 'success.dark' },
                            },
                        }}
                    >
                        Bueno
                    </ToggleButton>
                    <ToggleButton
                        value="MALO"
                        aria-label="Malo"
                        sx={{
                            px: 1.5,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            '&.Mui-selected': {
                                bgcolor: 'error.main',
                                color: 'error.contrastText',
                                '&:hover': { bgcolor: 'error.dark' },
                            },
                        }}
                    >
                        Malo
                    </ToggleButton>
                    <ToggleButton
                        value="NO_APLICA"
                        aria-label="No aplica"
                        sx={{
                            px: 1.5,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            '&.Mui-selected': {
                                bgcolor: 'action.selected',
                                color: 'text.primary',
                                '&:hover': { bgcolor: 'action.focus' },
                            },
                        }}
                    >
                        N/A
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Collapse in={isMalo} unmountOnExit>
                <Box sx={{ px: 2, pb: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        multiline
                        rows={2}
                        label="Observación técnica"
                        value={data.observacion}
                        onChange={handleObservacion}
                        variant="outlined"
                        color="error"
                        placeholder="Describa el fallo encontrado..."
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'error.main' },
                                '&:hover fieldset': { borderColor: 'error.dark' },
                            },
                        }}
                    />
                </Box>
            </Collapse>
        </Box>
    );
}

export default InspectionRow;