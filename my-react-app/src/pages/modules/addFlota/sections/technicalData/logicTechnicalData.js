export const LIMITES_TECNICOS = {
  numero_motor: 50,
  numero_chasis: 50,
  configuracion_ejes: 30
};

export const filtrarEntradaTecnica = (name, value) => {
  let valorLimpio = value;

  // 1. Enteros puros
  if (['potencia_hp', 'capacidad_pasajeros', 'numero_ejes'].includes(name)) {
    return value.replace(/\D/g, '');
  }

  // 2. Decimales (Capacidad de carga - permite un solo punto)
  if (name === 'capacidad_carga_kg') {
    let filtrado = value.replace(/[^0-9.]/g, '');
    const partes = filtrado.split('.');
    if (partes.length > 2) {
      filtrado = partes[0] + '.' + partes.slice(1).join('');
    }
    return filtrado;
  }

  // 3. Textos en mayúsculas sin espacios
  if (['numero_motor', 'numero_chasis'].includes(name)) {
    valorLimpio = value.replace(/\s/g, '').toUpperCase();
  }

  // 4. Solo números y la letra X para configuración de ejes
  // Ajuste estricto: Máximo 2 dígitos antes y después de la X (Ej: 10X4, 12X12, 8X2)
  if (name === 'configuracion_ejes') {
    // 1. Permitimos solo números y X, convertimos a mayúsculas
    let temp = value.toUpperCase().replace(/[^0-9X]/g, '');

    // 2. Explicación del Regex:
    // ^(\d{1,2})       -> Captura de 1 a 2 números al inicio
    // (?:X(\d{0,2}))?  -> Grupo opcional: una X seguida de 0 a 2 números
    const match = temp.match(/^(\d{1,2})(?:X(\d{0,2}))?/);

    valorLimpio = match ? match[0] : '';
  }

  // 5. Límite de caracteres de Prisma
  if (LIMITES_TECNICOS[name]) {
    valorLimpio = valorLimpio.slice(0, LIMITES_TECNICOS[name]);
  }

  return valorLimpio;
};

export const obtenerErrorTecnico = (name, value) => {
  // El único obligatorio según Prisma es el tipo de combustible (tiene @map pero no ?)
  if (name === 'tipo_combustible' && (!value || value.toString().trim() === '')) {
    return 'Este campo es obligatorio.';
  }

  // Opcionales: pero si escriben algo, que tenga sentido
  if ((name === 'numero_motor' || name === 'numero_chasis') && value && value.length < 4) {
    return 'Debe tener al menos 4 caracteres.';
  }

  return '';
};