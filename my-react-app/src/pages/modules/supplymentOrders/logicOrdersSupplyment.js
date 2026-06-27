// src/pages/modules/addCombustible/logicOrdersSupplyment.js

export const INITIAL_FUEL_STATE = {
    // --- DATOS DEL INSPECTOR ---
    numero_orden: '',
    fecha: new Date().toISOString().split('T')[0],
    vehiculo_id: '',
    conductor_id: '',
    sector_solicitante: '',

    // --- DATOS DEL CONDUCTOR ---
    tipo_combustible: 'DIESEL',
    cantidad_galones: '',
    costo_galon: '',
    incluye_aceite_motor: false,
    cantidad_aceite_motor_lt: '',
    viscosidad_aceite_motor: '',
    incluye_aceite_caja: false,
    cantidad_aceite_caja_lt: '',
    kilometraje_actual: '',
    nombre_serviccentro: '',
    numero_ticket_serviccentro: '',
    responsable_serviccentro: '',
    sello_serviccentro: false,

    // --- CONTROL DE ESTADO ---
    estado_orden: 'PENDIENTE' // Puede ser: 'PENDIENTE' o 'COMPLETADA'
};