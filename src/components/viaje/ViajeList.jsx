import InfiniteScroll from "react-infinite-scroll-component"
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

export function ViajeList({ viajes, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {

  const getEstadoTexto = (viaje) => {
    const hoy = new Date();
    const fechaIni = new Date(viaje.fechaIni);
    const fechaFin = new Date(viaje.fechaFin);

    if (viaje.estado === 'Inactivo') {
      return 'Cancelado/Suspendido';
    }
    if (viaje.estado === 'Rechazado') {
      return 'Rechazado';
    }
    if (viaje.estado === 'Pendiente') {
      return fechaIni > hoy ? 'Pendiente' : 'Viaje no aceptado';
    }

    if (fechaFin < hoy) return 'Finalizado';
    if (fechaIni > hoy) return 'Programado';
    if (fechaIni <= hoy && fechaFin >= hoy) return 'En curso';

    return 'Sin Estado';
  };

  const estadosContados = viajes.reduce((acc, viaje) => {
    const estadoTexto = getEstadoTexto(viaje);
    acc[estadoTexto] = (acc[estadoTexto] || 0) + 1;
    return acc;
  }, {});

  const [filtros, setFiltros] = useState({
    id: '',
    conductor: '',
    tren: '',
    recorrido: '',
    fechaIni: '',
    fechaFin: '',
    estado: '',
  });

  const viajesFiltrados = viajes.filter((viaje) => {
    const estadoTexto = getEstadoTexto(viaje);
    return (
      (!filtros.id || viaje.id.toString().includes(filtros.id)) &&
      (!filtros.conductor || `${viaje.conductor.nombre} ${viaje.conductor.apellido}`.toLowerCase().includes(filtros.conductor.toLowerCase())) &&
      (!filtros.tren || `${viaje.tren.modelo} ${viaje.tren.color}`.toLowerCase().includes(filtros.tren.toLowerCase())) &&
      (!filtros.recorrido || `${viaje.recorrido.ciudadSalida} ${viaje.recorrido.ciudadLlegada}`.toLowerCase().includes(filtros.recorrido.toLowerCase())) &&
      (!filtros.fechaIni || viaje.fechaIni?.startsWith(filtros.fechaIni)) &&
      (!filtros.fechaFin || viaje.fechaFin?.startsWith(filtros.fechaFin)) &&
      (!filtros.estado || estadoTexto === filtros.estado)
    );
  });

  const navigate = useNavigate();

  const EstadoBadge = ({ viaje }) => {
    const estadoTexto = getEstadoTexto(viaje);

    const map = {
      'Finalizado': 'success',
      'En curso': 'warning',
      'Cancelado/Suspendido': 'danger',
      'Programado': 'info',
      'Pendiente': 'dark',
      'Viaje no aceptado': 'danger',
      'Rechazado': 'danger',
      'Sin Estado': 'secondary',
    };

    const variant = map[estadoTexto] || 'secondary';

    return (
      <span
        className={`btn btn-sm bg-${variant} text-white me-2`}
        style={{
          pointerEvents: 'none',
          marginTop: '-10px',
          minWidth: '180px',
          textAlign: 'center',
          fontWeight: '500',
          lineHeight: '2.5',
        }}
      >
        {estadoTexto}
      </span>
    );
  };

  return (
    <InfiniteScroll
      dataLength={viajes.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>Cargando más viajes...</h4>}
      endMessage={<p className='text-center'>No hay más viajes</p>}
      scrollThreshold={1}
      scrollableTarget='scrollableDiv'
    >
      
      <div className="mb-3">
        <h5>Filtrar viajes</h5>
        <div className="row g-2">
          <div className="col"><input className="form-control" placeholder="ID" onChange={(e) => setFiltros({ ...filtros, id: e.target.value })} /></div>
          <div className="col"><input className="form-control" placeholder="Conductor" onChange={(e) => setFiltros({ ...filtros, conductor: e.target.value })} /></div>
          <div className="col"><input className="form-control" placeholder="Tren" onChange={(e) => setFiltros({ ...filtros, tren: e.target.value })} /></div>
          <div className="col"><input className="form-control" placeholder="Recorrido" onChange={(e) => setFiltros({ ...filtros, recorrido: e.target.value })} /></div>
          <div className="col"><input type="date" className="form-control" onChange={(e) => setFiltros({ ...filtros, fechaIni: e.target.value })} /></div>
          <div className="col"><input type="date" className="form-control" onChange={(e) => setFiltros({ ...filtros, fechaFin: e.target.value })} /></div>
          <div className="col">
            <select className="form-select" onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}>
              <option value="">Estado ({viajes.length})</option>
              {Object.entries(estadosContados).map(([estado, cantidad]) => (
                <option key={estado} value={estado}>{estado} ({cantidad})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className='table-responsive'>
        <table className='table'>
          <thead className='border-info fw-bold'>
            <tr>
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role="button">
                ID <span className="text-info">{ascOrder ? "⋀" : "⋁"}</span>
              </td>
              <td className='text-center'>Conductor</td>
              <td className='text-center'>Tren</td>
              <td className='text-center'>Recorrido</td>
              <td className='text-center'>Inicio</td>
              <td className='text-center'>Fin</td>
              <td className='text-center'>Estado</td>
              <td className='text-center' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {viajesFiltrados.map((viaje) => (
              <tr key={viaje.id}>
                <td className='border-dark-center' style={{ borderRightWidth: 1 }}>{viaje.id}</td>
                <td className='text-center'>
                  {viaje.conductor.nombre ? viaje.conductor.nombre : 'Sin Conductor'} {viaje.conductor.apellido ? viaje.conductor.apellido : ''}
                </td>
                <td className='text-center'>
                  {viaje.tren.modelo ? viaje.tren.modelo : 'Sin modelo'} (color: {viaje.tren.color ? viaje.tren.color : 'Sin color'})
                </td>
                <td className='text-center'>
                  {viaje.recorrido.ciudadSalida ? viaje.recorrido.ciudadSalida : 'Sin ciudad de salida'} -
                  {viaje.recorrido.ciudadLlegada ? viaje.recorrido.ciudadLlegada : 'Sin ciudad de llegada'}
                </td>
                <td className='text-center'>
                  {viaje.fechaIni ? new Date(new Date(viaje.fechaIni).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}
                </td>
                <td className='text-center'>
                  {viaje.fechaFin ? new Date(new Date(viaje.fechaFin).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'}
                </td>
                <td className="text-center">
                  <EstadoBadge viaje={viaje} />
                </td>
                <td className='text-center'>
                  <button
                    className='btn btn-sm text-white me-2'
                    style={{ backgroundColor: '#009e00ff', marginTop: '-10px' }}
                    onClick={() => navigate(`/admin/lineaCargas?viajeId=${viaje.id}`)}
                  >
                    Ver Cargas
                  </button>
                  <button
                    className='btn btn-sm text-white me-2'
                    style={{ backgroundColor: '#009e00ff', marginTop: '-10px' }}
                    onClick={() => navigate(`/admin/observaciones?viajeId=${viaje.id}`)}
                  >
                    Ver Observaciones
                  </button>
                  <button
                    className='btn btn-sm bg-info text-white me-2'
                    style={{ marginTop: '-10px' }}
                    onClick={handleEdit.bind(this, viaje)}
                  >
                    Editar
                  </button>
                  <button
                    className='btn btn-sm bg-danger text-white'
                    onClick={async () => deleteMutation(viaje.id)}
                    style={{ marginTop: '-10px' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </InfiniteScroll>
  );
}