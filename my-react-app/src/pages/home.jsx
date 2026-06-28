import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Avatar, AppBar, Toolbar, Typography, Drawer, List,
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Menu, MenuItem, Tooltip, IconButton
} from '@mui/material';

import ButtonTheme from '../components/buttonTheme';

// Iconos de Material UI adaptados a los nuevos módulos
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // Añadir Flota
import BuildIcon from '@mui/icons-material/Build'; // Inspeccion Vehiculo
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'; // Aprobacion Pre-operacional
import DescriptionIcon from '@mui/icons-material/Description'; // Orden de entrega
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation'; // Abastecimiento
import AddRoadIcon from '@mui/icons-material/AddRoad'; // Rutas
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'; // Reporte de jornada
import AssessmentIcon from '@mui/icons-material/Assessment'; // Inspección de jornadas
import CalculateIcon from '@mui/icons-material/Calculate'; // Calculos Operacionales

// Importación de tu módulo real
import Abastecimiento from './modules/supplymentOrders/abastecimiento';
import VehicularInspection from './modules/vehicularInspection';
import BannerConectividad from '../components/bannerConectivity';
import AddFlota from './modules/addFlota/addFlota';
import AprobacionPreOperacional from './modules/aprobacionPreOperacional';
import OrdenEntrega from './modules/supplymentOrders/ordenEntrega';
import Rutas from './modules/rutas';
import ReporteJornada from './modules/reporteJornada';
import InspeccionJornadas from './modules/inspeccionJornadas';
import CalculosOperacionales from './modules/calculosOperacionales';
import DashboardInicio from './modules/dashboardInicio';

function Home({ isLight, setIsLight, currentUser = { rol: 'conductor', nombre: 'Test Admin' } }) {
  const navigate = useNavigate();

  // 1. Nueva definición de las pestañas según los roles indicados
  const allMenuItems = [
    { text: 'Inicio', view: 'inicio', icon: <DashboardIcon />, roles: ['admin', 'conductor', 'encargado_garaje', 'operador_vehiculos'] },
    { text: 'Añadir Flota', view: 'añadir_flota', icon: <LocalShippingIcon />, roles: ['admin'] },
    { text: 'Inspección de vehículo', view: 'inspeccion_vehiculo', icon: <BuildIcon />, roles: ['conductor'] },
    { text: 'Aprobación Pre-op.', view: 'aprobacion_preop', icon: <VerifiedUserIcon />, roles: ['encargado_garaje'] },
    { text: 'Orden de entrega', view: 'orden_entrega', icon: <DescriptionIcon />, roles: ['encargado_garaje'] },
    { text: 'Abastecimiento', view: 'abastecimiento', icon: <LocalGasStationIcon />, roles: ['conductor'] },
    { text: 'Rutas', view: 'rutas', icon: <AddRoadIcon />, roles: ['conductor'] },
    { text: 'Reporte de jornada', view: 'reporte_jornada', icon: <AssignmentTurnedInIcon />, roles: ['conductor'] },
    { text: 'Inspección de jornadas', view: 'inspeccion_jornadas', icon: <AssessmentIcon />, roles: ['encargado_garaje'] },
    { text: 'Cálculos Operacionales', view: 'calculos_operacionales', icon: <CalculateIcon />, roles: ['operador_vehiculos'] },
  ];

  // 2. Estado para controlar qué vista/módulo se renderiza
  const menuItems = allMenuItems.filter(item => item.roles.includes(currentUser.rol));

  const [currentView, setCurrentView] = useState('inicio');

  // Estados de menú configuración
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    navigate('/login');
  };

  // Estados de Drawer Responsivo
  const drawerWidth = 280;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // 3. Función actualizada para renderizar los nuevos componentes
  const renderMainContent = () => {
    switch (currentView) {
      case 'inicio':
        return <DashboardInicio />;
      case 'añadir_flota':
        return <AddFlota onNavigate={setCurrentView} />;
      case 'inspeccion_vehiculo':
        return <VehicularInspection onNavigate={setCurrentView} />;
      case 'aprobacion_preop':
        return <AprobacionPreOperacional onNavigate={setCurrentView} />;
      case 'orden_entrega':
        return <OrdenEntrega />;
      case 'abastecimiento':
        return <Abastecimiento />;
      case 'rutas':
        return <Rutas />;
      case 'reporte_jornada':
        return <ReporteJornada />;
      case 'inspeccion_jornadas':
        return <InspeccionJornadas />;
      case 'calculos_operacionales':
        return <CalculosOperacionales />;
      default:
        return <DashboardInicio />;
    }
  };

  const drawerContent = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.view} disablePadding>
            <ListItemButton onClick={() => {
              setCurrentView(item.view);
              setMobileOpen(false);
            }} selected={currentView === item.view}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontSize: '14px', fontWeight: currentView === item.view ? 600 : 400 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: { md: 'none' } }}
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              SAF - Flotas
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ButtonTheme isLight={isLight} setIsLight={setIsLight} />
            <Tooltip title={currentUser.nombre}>
              <IconButton onClick={handleClick} size="small" sx={{ p: 0 }}>
                <Avatar> {currentUser.nombre.charAt(0).toUpperCase()} </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* CONTENEDOR DINÁMICO PRINCIPAL */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {/* Aquí invocamos la función que inyecta el componente seleccionado */}
        {renderMainContent()}
        <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1300 }}>
          <BannerConectividad />
        </Box>
      </Box>

      {/* Menú de Configuración / Perfil */}
      <Menu
        anchorEl={anchorEl}
        id="menu-configuracion"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
              '&::before': {
                content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10,
                transform: 'translateY(-50%) rotate(45deg)', zIndex: 0, bgcolor: 'background.paper',
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          Mi cuenta
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default Home;