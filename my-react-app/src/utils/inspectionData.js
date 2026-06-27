export const PUNTOS_CONTROL = [
    { campo: 'documentos', label: '1. Documentos del vehículo' },
    { campo: 'aceite_motor', label: '2. Nivel de aceite de motor' },
    { campo: 'agua', label: '3. Nivel de agua del radiador' },
    { campo: 'bateria', label: '4. Batería (electrolito y bornes)' },
    { campo: 'frenos', label: '5. Sistema de frenos (líquido y funcionamiento)' },
    { campo: 'embrague', label: '6. Embrague (líquido y funcionamiento)' },
    { campo: 'fajas', label: '7. Fajas / Correas (alternador, distribución)' },
    { campo: 'faros', label: '8. Faros (delanteros, traseros, de freno)' },
    { campo: 'lunas', label: '9. Lunas / Vidrios' },
    { campo: 'plumillas', label: '10. Plumillas / Limpiaparabrisas' },
    { campo: 'llantas', label: '11. Presión y estado de llantas' },
    { campo: 'espejos', label: '12. Espejos retrovisores' },
    { campo: 'herramientas', label: '13. Herramientas y equipo de emergencia' },
    { campo: 'extintor_botiquin', label: '14. Extintor y botiquín' },
    { campo: 'manchas_fugas', label: '15. Manchas por fugas en el estacionamiento' },
];

export const buildInitialState = () => {
    const checklist = {};
    PUNTOS_CONTROL.forEach(({ campo }) => {
        checklist[campo] = { estado: '', observacion: '' };
    });
    return {
        checklist,
        otras_observaciones: '',
    };
};