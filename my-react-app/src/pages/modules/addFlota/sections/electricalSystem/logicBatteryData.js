
export const filtrarEntradaBateria = (name, value) => {
    // Campos de solo números (Celdas, Voltios, Amperios)
    if (['bateria_celdas', 'bateria_voltios', 'bateria_amperios'].includes(name)) {
        return value.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
    }

    // Campo de texto (Tipo de batería) - Máximo 50 caracteres
    if (name === 'bateria_tipo') {
        return value.slice(0, 50);
    }

    return value;
};

export const obtenerErrorBateria = (name, value) => {
    // Ejemplo de validación: El voltaje no puede estar vacío si es un campo crítico
    if (name === 'bateria_voltios' && value && (parseInt(value) < 6 || parseInt(value) > 24)) {
        return 'El voltaje debe estar entre 6V y 24V';
    }
    return '';
};