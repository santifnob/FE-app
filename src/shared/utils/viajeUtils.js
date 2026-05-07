
export function getEstadoInferido(viaje) {
  if (!viaje) return 'Sin Estado';

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaIni = viaje.fechaIni ? new Date(viaje.fechaIni) : null;
  const fechaFin = viaje.fechaFin ? new Date(viaje.fechaFin) : null;

  if (!fechaIni || !fechaFin) return viaje.estado || 'Sin Estado';

  if (viaje.estado === 'Inactivo') {
    return 'Cancelado/Suspendido';
  }
  if (viaje.estado === 'Rechazado') {
    return 'Rechazado';
  }
  if (viaje.estado === 'Pendiente') {
    return fechaIni >= hoy ? 'Pendiente' : 'Viaje no aceptado';
  }

  if (fechaFin < hoy) return 'Finalizado';
  if (fechaIni > hoy) return 'Programado';
  if (fechaIni <= hoy && fechaFin >= hoy) return 'En curso';

  return 'Sin Estado';
}