import InfiniteScroll from 'react-infinite-scroll-component'
import { useState } from 'react'

export function LicenciaList ({ licencias, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
  const [filtros, setFiltros] = useState({
  id: '',
  conductor: '',
  fechaHecho: '',
  fechaVencimiento: '',
  estado: '',
})  

  // Contar estados fuera del componente EstadoBadgeConductor
  const estadosContados = licencias.reduce((acc, conductor) => {
    const estado = conductor.estado ?? 'Sin estado'
    acc[estado] = (acc[estado] || 0) + 1
    return acc
  }, {})

  const licenciasFiltrados = licencias.filter((c) => {
    return (
      (!filtros.id || c.id.toString().includes(filtros.id)) &&
      (!filtros.conductor || `${c.conductor?.nombre ?? ''} ${c.conductor?.apellido ?? ''}`.toLowerCase().includes(filtros.conductor.toLowerCase())) &&
      (!filtros.fechaHecho || c.fechaHecho?.startsWith(filtros.fechaHecho)) &&
      (!filtros.fechaVencimiento || c.fechaVencimiento?.startsWith(filtros.fechaVencimiento)) &&
      (!filtros.estado || c.estado === filtros.estado)
    )
  })

  const EstadoBadge = ({ estado }) => {
    let estadoTexto = 'Sin estado';

    if (estado === 'Activo') {
      estadoTexto = 'Activo';
    } else if (estado === 'Inactivo') {
      estadoTexto = 'Inactivo';
    }

    const map = {
      'Activo': 'success',
      'Inactivo': 'danger',
      'Sin estado': 'secondary',
    };

    const variant = map[estadoTexto];

    return (
      <span className={`btn btn-sm bg-${variant} text-white me-2`} style={{ pointerEvents: 'none', marginTop: '-10px',
        minWidth: '180px',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: '2.5',
        
 }}>
        {estadoTexto}
      </span>
    );
  };
  return (
    <InfiniteScroll
      dataLength={licencias.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>Cargando más licencias...</h4>}
      endMessage={<p className='text-center'>No hay más licencias</p>}
      scrollThreshold={1}
      scrollableTarget='scrollableDiv'
    >
  <div className="mb-3">
          <h5>Filtrar licencias</h5>
          <div className="row g-2">
            <div className="col"><input className="form-control" placeholder="ID" onChange={(e) => setFiltros({ ...filtros, id: e.target.value })} /></div>
            <div className="col"><input className="form-control" placeholder="Conductor" onChange={(e) => setFiltros({ ...filtros, conductor: e.target.value })} /></div>
            <div className="col"><input type="date" className="form-control" onChange={(e) => setFiltros({ ...filtros, fechaHecho: e.target.value })} /></div>
            <div className="col"><input type="date" className="form-control" onChange={(e) => setFiltros({ ...filtros, fechaVencimiento: e.target.value })} /></div>
            <div className="col">
              <select className="form-select" onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}>
                <option value="">Estado ({licencias.length})</option>
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
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role='button'>ID <span className='text-info'>{ascOrder ? '⋀' : '⋁'}</span></td>
              <td className='text-center'>Conductor</td>
              <td className='text-center'>Fecha de hecho</td>
              <td className='text-center'>Fecha de vencimiento</td>
              <td className='text-center'>Estado</td>

              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {licenciasFiltrados
            .filter(licencia => licencia) // <-- elimina undefined
            .map((licencia) => {
              return (
                <tr key={licencia.id}>
                  <td className='border-dark' style={{ borderRightWidth: 1 }}>{licencia.id}</td>
                  <td className='text-center'>{licencia.conductor.nombre ? licencia.conductor.nombre : 'Sin nombre'} {licencia.conductor.apellido?licencia.conductor.apellido:'Sin apellido'}</td>
                  <td className='text-center'>{licencia.fechaHecho? new Date(new Date(licencia.fechaHecho).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR'): 'Sin fecha'}</td>
                  <td className='text-center'>{licencia.fechaVencimiento? new Date(new Date(licencia.fechaVencimiento).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR'): 'Sin fecha'}</td>
                  <td className='text-center'>
                    <EstadoBadge estado={licencia.estado} />
                  </td>
                  <td className='text-end'>
                    <button style={{ marginTop: '-10px'}}
                      className='btn btn-sm bg-info text-white me-2'
                      onClick={handleEdit.bind(this, licencia)}
                    >
                      Editar
                    </button>
                    <button style={{ marginTop: '-10px'}} className='btn btn-sm bg-danger text-white' onClick={async () => deleteMutation(licencia.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            })}

          </tbody>
        </table>
      </div>
    </InfiniteScroll>
  )
}
