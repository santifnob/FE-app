import { Badge } from 'react-bootstrap';

export function LicenciaEstadoBadge({ licencia }) {
  if (!licencia) return <Badge bg="secondary">Sin datos</Badge>;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const vencimiento = new Date(licencia.fechaVencimiento);

  let variant = 'secondary';
  let text = licencia.estado || 'Desconocido';

  if (licencia.estado === 'Activo') {
    if (vencimiento >= today) {
      variant = 'success';
      text = 'Activa';
    } else {
      variant = 'warning';
      text = 'Vencida';
    }
  } else if (licencia.estado === 'Inactivo') {
    variant = 'danger';
    text = 'Suspendida';
  }

  return <Badge style={{
        pointerEvents: 'none',
        marginTop: '-10px',
        minWidth: '180px',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: '2.5'
      }} bg={variant}>{text}</Badge>;
}