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

import ButtonTheme from '../components/buttonTheme';

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { Link as RouterLink, useNavigate } from 'react-router-dom'

export default function Login({ isLight, setIsLight }) {

  const navigate = useNavigate();

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const [showPassword, setShowPassword] = React.useState(false);

  const handleChange = (e) => {
    const valor = e.target.value;
    const valorLimpio = valor.replace(/[^a-zA-Z0-9._-]/g, '')
    setUsuario(valorLimpio);
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickLogin = () => {
    const correoCompleto = `${usuario}@esp.gob.pe`;

    if (correoCompleto === "123@esp.gob.pe" && contrasena === "123") {
      navigate('/home');
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ButtonTheme isLight={isLight} setIsLight={setIsLight} ></ButtonTheme>
      </Box>

      <Paper
        sx={{
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
        }}
      >
        <Typography
          variant="h5" component='h1' fontWeight='bold' align='center' sx={{ mb: 1 }}>
          Iniciar Sesión
        </Typography>

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
          placeholder='Inserte su contraseña'
          variant='outlined'
          fullWidth
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
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

        <FormControlLabel control={<Checkbox />} label="Recordarme" />

        <Button variant="contained" type="submit" size="large" onClick={handleClickLogin}>
          INGRESAR
        </Button>

        <Typography align='center' sx={{ mt: 1 }}>
          ¿No tienes cuenta?{' '}
          <Typography
            component={RouterLink}
            to='/register'
            color='primary'
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Regístrate
          </Typography>
        </Typography>
      </Paper>
    </Box >
  );
}