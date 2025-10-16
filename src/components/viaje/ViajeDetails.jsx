import React from 'react'
import { ObservacionFindAll } from '../../hooks/observacion/useObservacionQuery.js'
import { LineaCargaFindAll } from '../../hooks/lineaCarga/useLineaCargaQuery.js'
import { CargaFindAll } from '../../hooks/carga/useCargaQuery.js'
import { CategoriaDenunciaFindAll } from '../../hooks/categoriaDenuncia/useCategoriaDenunciaQuery.js'

export function ViajeDetails({ viaje }) {
  if (!viaje) return null

  const { data: allObservaciones, isLoading: obsLoading } = ObservacionFindAll()
  const { data: allLineas, isLoading: lineasLoading } = LineaCargaFindAll()
  const { data: allCargas } = CargaFindAll()
  const { data: allCategorias } = CategoriaDenunciaFindAll()

  // Prefer embedded relations on the viaje; otherwise filter the fetched lists by viaje id
  const observaciones = (viaje.observaciones && viaje.observaciones.length)
    ? viaje.observaciones
    : (allObservaciones || []).filter(o => String(o.viaje?.id ?? o.viaje ?? o.viajeId) === String(viaje.id))

  const lineas = (viaje.lineasCarga && viaje.lineasCarga.length)
    ? viaje.lineasCarga
    : (allLineas || []).filter(l => String(l.viaje?.id ?? l.viaje ?? l.viajeId) === String(viaje.id))

  const formatDate = (d) => d ? new Date(new Date(d).getTime() + 3 * 60 * 60 * 1000).toLocaleString('es-AR') : 'Sin fecha'

  const resolveCategoria = (o) => {
    const maybe = o.categoriaDenuncia ?? o.categoria ?? o.categoriaId ?? o.categoriaDenunciaId
    if (!maybe) return 'Sin categoría'
    if (typeof maybe === 'string' && maybe.trim()) return maybe
    if (typeof maybe === 'object') return maybe.titulo ?? maybe.nombre ?? 'Sin categoría'
    // numeric id: try to find in allCategorias
    const found = (allCategorias || []).find(c => String(c.id ?? c._id ?? c.categoriaId) === String(maybe))
    return found ? (found.titulo ?? found.nombre ?? `#${maybe}`) : `#${maybe}`
  }

  const resolveCargaNombre = (l) => {
    const cargaField = l.carga
    if (!cargaField) return `Carga #${l.id ?? 'sin id'}`
    if (typeof cargaField === 'object') return cargaField.nombre ?? cargaField.name ?? cargaField.descripcion ?? `Carga #${cargaField.id ?? 'sin id'}`
    const found = (allCargas || []).find(c => String(c.id) === String(cargaField))
    return found ? (found.nombre ?? found.name ?? found.descripcion ?? `Carga #${found.id}`) : `Carga #${cargaField}`
  }

  return (
    <div>
      <h6>Información general</h6>
      <div className='mb-2'><strong>ID:</strong> {viaje.id}</div>
      <div className='mb-2'><strong>Tren:</strong> {viaje.tren?.modelo ?? 'Sin modelo'} (color: {viaje.tren?.color ?? 'Sin color'})</div>
      <div className='mb-2'><strong>Conductor:</strong> {viaje.conductor ? `${viaje.conductor.nombre ?? ''} ${viaje.conductor.apellido ?? ''}` : 'Sin conductor'}</div>
      <div className='mb-2'><strong>Recorrido:</strong> {viaje.recorrido ? `${viaje.recorrido.ciudadSalida ?? ''} - ${viaje.recorrido.ciudadLlegada ?? ''}` : 'Sin recorrido'}</div>
      <div className='mb-2'><strong>Inicio:</strong> {formatDate(viaje.fechaIni)}</div>
      <div className='mb-2'><strong>Fin:</strong> {formatDate(viaje.fechaFin)}</div>
      <div className='mb-2'><strong>Estado:</strong> {viaje.estado ?? 'Sin estado'}</div>

      <h6 className='mt-3'>Líneas de cargas</h6>
      {lineas && lineas.length > 0 && (
        <div>
          {lineas.map(l => (
            <div key={l.id ?? Math.random()} className='mb-2'>
              <div>
                <strong>Carga:</strong> {resolveCargaNombre(l)} {l.cantidad ? `x${l.cantidad}` : (l.cantidadVagon || l.cantidadVagones ? `x${l.cantidadVagon ?? l.cantidadVagones}` : '')}
              </div>
            </div>
          ))}
        </div>
      )}
      {(!lineas || lineas.length === 0) && <p>Sin líneas de cargas</p>}

      <h6 className='mt-3'>Observaciones</h6>
      {(obsLoading || lineasLoading) && <p>Cargando detalles...</p>}
      {!obsLoading && !lineasLoading && observaciones && observaciones.length > 0 && (
        <ul className='list-group'>
          {observaciones.map(o => (
            <li key={o.id ?? Math.random()} className='list-group-item'>
              <div style={{ fontWeight: 600 }}>{resolveCategoria(o)}</div>
              <div style={{ marginTop: 4 }}>{o.descripcion ?? o.observaciones ?? o.texto ?? 'Sin descripción'}</div>
            </li>
          ))}
        </ul>
      )}
      {!obsLoading && !lineasLoading && (!observaciones || observaciones.length === 0) && <p>Sin observaciones</p>}
    </div>
  )
}
