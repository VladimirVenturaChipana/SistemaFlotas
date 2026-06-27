import React, { useState } from 'react';

import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import ButtonTheme from '../components/buttonTheme';

import { Link as RouterLink } from 'react-router-dom'

export default function Register({ isLight, setIsLight }) {

  const [usuario, setUsuario] = useState('');

  const handleChange = (e) => {
    const valor = e.target.value;
    const valorLimpio = valor.replace(/[^a-zA-Z0-9._-]/g, '')
    setUsuario(valorLimpio);
  }


  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ButtonTheme isLight={isLight} setIsLight={setIsLight} ></ButtonTheme>
      </Box>

      <Paper
        sx={{
          maxHeight: {
            xs: '65vh'
          },
          overflowY: {
            xs: 'auto',
            sm: 'hidden'
          },
          maxWidth: {
            xs: 300,
            sm: '35%'
          },
          minWidth: {
            xs: '85%',
            sm: 415,
            md: 450,
          },
          p: { xs: 3, sm: 4 },
          boxShadow: { xs: 0, sm: 3, md: 4 },
          bgcolor: { xs: 'transparent', sm: 'background.paper' },
          borderRadius: 4,
          gap: { xs: 1.5, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Typography
          variant="h5" component='h1' fontWeight='bold' align='center' sx={{ mb: 1 }}>
          Registrate
        </Typography>
        <TextField
          type='text'
          label='Nombres'
          placeholder='Inserte su nombre'
          variant='outlined'
          fullWidth
        />
        <TextField
          type='text'
          label='Apellidos'
          placeholder='Inserte sus apellidos'
          variant='outlined'
          fullWidth
        />
        <TextField
          type='number'
          label='Telefono*'
          placeholder='Inserte su número celular'
          variant='outlined'
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position='start'>
                  <Typography color='text.secondary' sx={{ fontWeight: 'medium' }}>
                    +51
                  </Typography>
                </InputAdornment>
              )
            }
          }}
        />
        <TextField
          type='email'
          label='Email'
          placeholder='Inserte su correo'
          variant='outlined'
          fullWidth
          sx={{ mb: 1 }}
          value={usuario}
          onChange={handleChange}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='start'>
                  <Typography color='text.secondary' sx={{ fontWeight: 'medium' }}>
                    @esp.gob.pe
                  </Typography>
                </InputAdornment>
              )
            }
          }}
        />

        <TextField
          type={showPassword ? 'text' : 'password'}
          label='Contraseña'
          placeholder='Inserte otro dato'
          variant='outlined'
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleClickShowPassword}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />

        <Button variant="contained" type="submit" size="large">
          INGRESAR
        </Button>

        <Typography align='center'>
          ¿Ya registrado?{' '}
          <Typography
            component={RouterLink}
            to='/login'
            color='primary'
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Inicie sesión
          </Typography>
        </Typography>
      </Paper>
    </Box >
  );
}