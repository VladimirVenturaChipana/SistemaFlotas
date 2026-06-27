// Mapeos limpios usando diccionarios
export const CLASE_MAP = {
  'Terrestre': '01',
  'Acuático': '02',
  'Aéreo': '03'
};

export const CATEGORIA_MAP = {
  'Pasajeros': '1',
  'Carga': '2',
  'Especial': '3'
};

/**
 * Calcula el siguiente secuencial disponible y el código patrimonial final.
 * @param {string} clase - Ej: 'Terrestre'
 * @param {string} categoria - Ej: 'Carga'
 * @param {Array} vehiculosExistentes - Lista de vehículos actuales en el sistema
 * @returns {Object} { secuencial: string, codigo_patrimonial: string }
 */
export const generarCodigoPatrimonial = (clase, categoria, vehiculosExistentes = []) => {
  const claseCod = CLASE_MAP[clase] || '01';
  const catCod = CATEGORIA_MAP[categoria] || '1';

  const vehiculosMismoTipo = vehiculosExistentes.filter(v => {
    const vClase = v.clase_patrimonial?.includes(' ') ? v.clase_patrimonial.split(' ')[0] : CLASE_MAP[v.clase_patrimonial];
    const vCat = CATEGORIA_MAP[v.categoria_patrimonial] || v.categoria_patrimonial;
    return vClase === claseCod && vCat === catCod;
  });

  let siguienteNumero = 1;

  if (vehiculosMismoTipo.length > 0) {
    const secuenciales = vehiculosMismoTipo.map(v => parseInt(v.secuencial || 0, 10));
    const maxSecuencial = Math.max(...secuenciales);
    siguienteNumero = maxSecuencial + 1;
  }

  const secuencialFormateado = siguienteNumero.toString().padStart(3, '0');

  const codigoFinal = `${claseCod}${catCod}${secuencialFormateado}`;

  return {
    secuencial: secuencialFormateado,
    codigo_patrimonial: codigoFinal
  };
};