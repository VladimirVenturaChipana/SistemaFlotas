export const filtrarEntradaMantenimiento = (name, value) => {
    // Manejo especial para el Valor de Adquisición (permite punto y 2 decimales)
    if (name === 'valor_adquisicion') {
        // Limpiamos todo lo que no sea número o punto
        let val = value.replace(/[^0-9.]/g, '');
        // Limitamos a un solo punto y máximo dos decimales
        const match = val.match(/^[0-9]*\.?[0-9]{0,2}/);
        return match ? match[0] : '';
    }

    // Campos que deben ser numéricos estrictamente enteros
    const camposNumericosEnteros = [
        'vida_util_anios', 'periodicidad_mantenimiento_km'
    ];

    if (camposNumericosEnteros.includes(name)) {
        return value.replace(/\D/g, ''); // Solo números enteros
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