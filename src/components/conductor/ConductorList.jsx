import InfiniteScroll from 'react-infinite-scroll-component'
import { useState } from 'react'

export function ConductorList ({ conductores, fetchNextPage, hasNextPage, handleEdit, deleteMutation, handleAscOrder, ascOrder }) {
  
  const [filtros, setFiltros] = useState({
    id: '',
    nombre: '',
    apellido: '',
    email: '',
    fecha: '',
    estado: '',
  })

  // Contar estados fuera del componente EstadoBadgeConductor
  const estadosContados = conductores.reduce((acc, conductor) => {
    const estado = conductor.estado ?? 'Sin estado'
    acc[estado] = (acc[estado] || 0) + 1
    return acc
  }, {})

  const conductoresFiltrados = conductores.filter((c) => {
    return (
      (!filtros.id || c.id.toString().includes(filtros.id)) &&
      (!filtros.nombre || c.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase())) &&
      (!filtros.apellido || c.apellido?.toLowerCase().includes(filtros.apellido.toLowerCase())) &&
      (!filtros.email || c.email?.toLowerCase().includes(filtros.email.toLowerCase())) &&
      (!filtros.fecha || c.createdAt?.startsWith(filtros.fecha)) &&
      (!filtros.estado || c.estado === filtros.estado)
    )
  })

  const EstadoBadgeConductor = ({ estado }) => {
    let estadoTexto = 'Sin estado';

    if (estado === 'Activo') {
      estadoTexto = 'Activo';
    } else if (estado === 'Inactivo') {
      estadoTexto = 'Inactivo';
    } else if (estado === 'Pendiente') {
      estadoTexto = 'Pendiente';
    }

    const map = {
      'Activo': 'success',
      'Inactivo': 'danger',
      'Pendiente': 'warning',
      'Sin estado': 'secondary',
    };

    const variant = map[estadoTexto];

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
      dataLength={conductores.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<h4 className='text-center'>Cargando más conductores...</h4>}
      endMessage={<p className='text-center'>No hay más conductores</p>}
      scrollThreshold={1}
      scrollableTarget='scrollableDiv'
    >
      
  <div className="mb-3">
          <h5>Filtrar conductores</h5>
          <div className="row g-2">
            <div className="col"><input className="form-control" placeholder="ID" onChange={(e) => setFiltros({ ...filtros, id: e.target.value })} /></div>
            <div className="col"><input className="form-control" placeholder="Nombre" onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })} /></div>
            <div className="col"><input className="form-control" placeholder="Apellido" onChange={(e) => setFiltros({ ...filtros, apellido: e.target.value })} /></div>
            <div className="col"><input className="form-control" placeholder="Email" onChange={(e) => setFiltros({ ...filtros, email: e.target.value })} /></div>
            <div className="col"><input type="date" className="form-control" onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })} /></div>
            <div className="col">
              <select className="form-select" onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}>
                <option value="">Estado ({conductores.length})</option>
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
              <td style={{ borderRightWidth: 1 }} onClick={handleAscOrder} role='button'>
                ID <span className='text-info'>{ascOrder ? '⋀' : '⋁'}</span>
              </td>
              <td className='text-center'>Nombre</td>
              <td className='text-center'>Apellido</td>
              <td className='text-center'>Email</td>
              
              <td className='text-center'>Fecha de creación</td>
              <td className='text-center'>Estado</td>
              <td className='text-end' style={{ paddingRight: 75 }}>Acción</td>
            </tr>
          </thead>

          <tbody>
            {conductoresFiltrados
              .filter(conductor => conductor) // <-- elimina undefined
              .map(conductor => (
                <tr key={conductor.id}>
                  <td className='border-dark' style={{ borderRightWidth: 1 }}>{conductor.id}</td>
                  <td className='text-center'>{conductor.nombre? conductor.nombre : 'Sin nombre'}</td>
                  <td className='text-center'>{conductor.apellido? conductor.apellido : 'Sin apellido'}</td>
                  <td className='text-center'>{conductor.email? conductor.email : 'Sin email'}</td>
                  
                  <td className='text-center'>{conductor.createdAt? new Date(new Date(conductor.createdAt).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR'): 'Sin fecha'}</td>
                  
                  <td className='text-center'>
                    <EstadoBadgeConductor estado={conductor.estado} />
                  </td>

                  <td className='text-end'>
                    <button style={{ marginTop: '-10px'}} className='btn btn-sm bg-info text-white me-2' onClick={() => handleEdit(conductor)}>
                      Editar
                    </button>
                    <button style={{ marginTop: '-10px'}} className='btn btn-sm bg-danger text-white' onClick={async () => deleteMutation(conductor.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </InfiniteScroll>
  )
}
