export const LIMITES_CARACTERES = {
  placa: 10,
  marca: 80,
  modelo: 80,
  color: 50,
  anio_fabricacion: 4
};

export const LIMITES_ANIO = {
  min: 1950,
  max: new Date().getFullYear() + 1,
};

// Se mantiene igual para modelo y color
const capitalizarTexto = (texto) => {
  if (!texto) return '';
  return texto
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
    .join(' ');
};

export const filtrarEntradaTexto = (name, value) => {
  let valorLimpio = value;

  if (name === 'placa') {
    return value.replace(/\s/g, '').toUpperCase().slice(0, LIMITES_CARACTERES.placa);
  }

  if (['marca', 'modelo', 'color'].includes(name)) {
    if (/^[0-9\s]/.test(valorLimpio)) {
      valorLimpio = valorLimpio.replace(/^[0-9\s]+/, '');
    }
  }

  if (name === 'marca' || name === 'color') {
    valorLimpio = valorLimpio.replace(/[0-9]/g, '');
  }

  if (['modelo', 'color'].includes(name)) {
    valorLimpio = capitalizarTexto(valorLimpio);
  } else if (name === 'marca') {
    if (valorLimpio) {
      valorLimpio = valorLimpio
        .split(' ')
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
        .join(' ');
    }
  }

  if (LIMITES_CARACTERES[name]) {
    valorLimpio = valorLimpio.slice(0, LIMITES_CARACTERES[name]);
  }

  return valorLimpio;
};


export const obtenerErrorCampo = (name, value) => {
  if (!value || value.toString().trim() === '') {
    return 'Este campo es obligatorio.';
  }

  if (name === 'anio_fabricacion') {
    const anio = parseInt(value, 10);
    if (isNaN(anio) || anio < LIMITES_ANIO.min || anio > LIMITES_ANIO.max) {
      return `El año debe estar entre ${LIMITES_ANIO.min} y ${LIMITES_ANIO.max}.`;
    }
  }

  if (name === 'placa' && value.length < 6) {
    return 'La placa debe tener al menos 6 caracteres.';
  }

  return '';
};