import { useState, useEffect } from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

export default function BannerConectividad() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showBanner, setShowBanner] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowBanner(true);
            setTimeout(() => setShowBanner(false), 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowBanner(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <Collapse in={showBanner}>
            <Box
                sx={{
                    width: '100%',
                    bgcolor: isOnline ? 'success.main' : 'error.main',
                    color: 'white',
                    py: 0.5,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2,
                }}
            >
                {isOnline ? <WifiIcon fontSize="small" /> : <WifiOffIcon fontSize="small" />}
                <Typography variant="caption" sx={{ fontWeight: 'bold', letterSpacing: 0.5 }}>
                    {isOnline ? 'Conectado' : 'Modo Offline - Guardando localmente'}
                </Typography>
            </Box>
        </Collapse>
    );
}