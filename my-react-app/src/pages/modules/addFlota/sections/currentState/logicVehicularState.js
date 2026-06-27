export const filtrarEntradaMantenimiento = (name, value) => {
    // Campos que deben ser numéricos positivos
    const camposNumericos = [
        'valor_adquisicion', 'vida_util_anios', 'seguro_anual',
        'licenciamiento_anual', 'periodicidad_mantenimiento_km'
    ];

    if (camposNumericos.includes(name)) {
        return value.replace(/\D/g, ''); // Solo números
    }
    return value;
};

export const obtenerErrorMantenimiento = (name, value) => {
    const num = parseFloat(value);

    if (name === 'vida_util_anios' && (num < 1 || num > 50)) {
        return 'La vida útil debe ser entre 1 y 50 años';
    }
    if (name === 'valor_adquisicion' && num < 0) {
        return 'El valor no puede ser negativo';
    }
    return '';
};