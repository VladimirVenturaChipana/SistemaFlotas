import { useEffect } from 'react';
import { Grid, Typography, TextField, MenuItem, Box } from '@mui/material';
import { generarCodigoPatrimonial, CLASE_MAP, CATEGORIA_MAP } from './logicIdentificacion';

export default function SeccionIdentificacion({ formData, setFormData, vehicles }) {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.clase_patrimonial && formData.categoria_patrimonial) {
      const { secuencial, codigo_patrimonial } = generarCodigoPatrimonial(
        formData.clase_patrimonial,
        formData.categoria_patrimonial,
        vehicles
      );
      setFormData((prev) => ({
        ...prev,
        secuencial,
        codigo_patrimonial
      }));
    }
  }, [formData.clase_patrimonial, formData.categoria_patrimonial, vehicles, setFormData]);

  return (
    <Grid container spacing={2}>
      <Grid item size={12}>
        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
          Identificación Patrimonial (Autogenerado)
        </Typography>
      </Grid>

      {/* Selector de Clase */}
      <Grid item size={3}>
        <TextField
          fullWidth
          size="small"
          select
          label="Clase Patrimonial"
          name="clase_patrimonial"
          value={formData.clase_patrimonial}
          onChange={handleInputChange}
        >
          {Object.keys(CLASE_MAP).map((clase) => (
            <MenuItem key={clase} value={clase}>
              {clase} ({CLASE_MAP[clase]})
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Selector de Categoría */}
      <Grid item size={3}>
        <TextField
          fullWidth
          size="small"
          select
          label="Categoría Patrimonial"
          name="categoria_patrimonial"
          value={formData.categoria_patrimonial}
          onChange={handleInputChange}
        >
          {Object.keys(CATEGORIA_MAP).map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat} ({CATEGORIA_MAP[cat]})
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Bloque Destacado: Muestra el Código de 6 Dígitos Final */}
      <Grid item size={6}>
        <Box sx={{
          height: '100%',
          boxSizing: 'border-box',
          bgcolor: 'action.hover',
          borderRadius: 1,
          border: '1px dashed',
          borderColor: formData.codigo_patrimonial ? 'primary.main' : 'text.disabled',
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
            Código Generado (Secuencial: {formData.secuencial || '---'})
          </Typography>
          <Typography variant="body" sx={{ fontWeight: 'bold', fontFamily: 'monospace', color: 'primary.main' }}>
            {formData.codigo_patrimonial || 'Esperando selección...'}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}