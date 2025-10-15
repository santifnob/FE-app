import React, { useState, useEffect } from 'react'
import { ObservacionFindAll } from '../../hooks/observacion/useObservacionQuery.js'
import { LineaCargaFindAll } from '../../hooks/lineaCarga/useLineaCargaQuery.js'
import { CargaFindAll } from '../../hooks/carga/useCargaQuery.js'
import { CategoriaDenunciaFindAll, CategoriaDenunciaGetOne } from '../../hooks/categoriaDenuncia/useCategoriaDenunciaQuery.js'

export function ViajeDetails ({ viaje }) {
  if (!viaje) return null
  // robust id equality: compare as strings to avoid type mismatch
  const sameId = (a, b) => {
    try { return String(a) === String(b) } catch (e) { return false }
  }
  // try to load related lists if the viaje object doesn't include them
  const { data: allObservaciones, isLoading: obsLoading } = ObservacionFindAll()
  const { data: allLineas, isLoading: lineasLoading } = LineaCargaFindAll()
  const { data: allCategorias } = CategoriaDenunciaFindAll()
  const { mutateAsync: fetchCategoriaById } = CategoriaDenunciaGetOne()
  const [categoriaMap, setCategoriaMap] = useState({})
  // Prepare lists (prefer embedded relations on viaje; otherwise use fetched lists filtered by viaje id)
  const providedObs = Array.isArray(viaje.observaciones) && viaje.observaciones.length > 0 ? viaje.observaciones : []
  const fetchedObs = Array.isArray(allObservaciones)
    ? allObservaciones.filter((o) => {
      const v = o.viaje?.id ?? o.viaje ?? o.viajeId
      return sameId(v, viaje.id)
    })
    : []

  const observaciones = providedObs.length > 0 ? providedObs : fetchedObs

  // If observaciones reference categoriaDenuncia by id, fetch missing categorias individually
  useEffect(() => {
    let mounted = true
    const ids = new Set()
      ; (observaciones || []).forEach((o) => {
      const maybe = o.categoriaDenuncia ?? o.categoria ?? o.categoriaDenunciaId ?? o.categoriaId
      if (maybe && (typeof maybe === 'number' || (typeof maybe === 'string' && /^[0-9]+$/.test(maybe)))) {
        ids.add(String(maybe))
      }
    })

    if (ids.size === 0) return undefined

    ; (async () => {
      for (const id of Array.from(ids)) {
        if (allCategorias && Array.isArray(allCategorias) && allCategorias.find((c) => String(c.id) === id)) continue
        if (categoriaMap[id]) continue
        try {
          const res = await fetchCategoriaById(id)
          // mutation returns items (array) per hook convention
          const item = Array.isArray(res) ? res[0] : res
          if (mounted && item) {
            setCategoriaMap((m) => ({ ...m, [id]: item }))
          }
        } catch (e) {
          // ignore individual fetch failures
        }
      }
    })()

    return () => { mounted = false }
  }, [observaciones, allCategorias, fetchCategoriaById, categoriaMap])
  const { data: allCargas } = CargaFindAll()
  // debug: print shapes to console to verify runtime data
  try {
    console.debug('ViajeDetails - viaje:', viaje)
    console.debug('ViajeDetails - allObservaciones:', allObservaciones)
    console.debug('ViajeDetails - allLineas:', allLineas)
  } catch (e) {
    // ignore
  }
  const [showRaw, setShowRaw] = useState(false)

  // Prepare lists (prefer embedded relations on viaje; otherwise use fetched lists filtered by viaje id)
  const providedLineas = Array.isArray(viaje.lineasCarga) && viaje.lineasCarga.length > 0
    ? viaje.lineasCarga
    : (Array.isArray(viaje.lineasCarga) ? viaje.lineasCarga : (Array.isArray(viaje.lineasCarga) ? viaje.lineasCarga : (Array.isArray(viaje.lineaCargas) && viaje.lineaCargas.length > 0 ? viaje.lineaCargas : (Array.isArray(viaje.cargas) ? viaje.cargas : []))))

  const fetchedLineas = Array.isArray(allLineas)
    ? allLineas.filter((l) => {
      const v = l.viaje?.id ?? l.viaje ?? l.viajeId
      return sameId(v, viaje.id)
    })
    : []

  const lineas = providedLineas.length > 0 ? providedLineas : fetchedLineas

  let debugFilteredObservaciones = []
  if (Array.isArray(allObservaciones)) {
    debugFilteredObservaciones = allObservaciones.filter((o) => {
      const v = o.viaje?.id ?? o.viaje ?? o.viajeId
      return String(v) === String(viaje.id)
    })
  }

  let debugFilteredLineas = []
  if (Array.isArray(allLineas)) {
    debugFilteredLineas = allLineas.filter((l) => {
      const v = l.viaje?.id ?? l.viaje ?? l.viajeId
      return String(v) === String(viaje.id)
    })
  }

  return (
    <div>
      <h6>Información general</h6>
      <div className='mb-2'>
        <strong>ID:</strong> {viaje.id}
      </div>
      <div className='mb-2'>
        <strong>Tren:</strong> {viaje.tren?.modelo ?? 'Sin modelo'} (color: {viaje.tren?.color ?? 'Sin color'})
      </div>
      <div className='mb-2'>
        <strong>Conductor:</strong> {viaje.conductor ? `${viaje.conductor.nombre ?? ''} ${viaje.conductor.apellido ?? ''}` : 'Sin conductor'}
      </div>
      <div className='mb-2'>
        <strong>Recorrido:</strong> {viaje.recorrido ? `${viaje.recorrido.ciudadSalida ?? ''} - ${viaje.recorrido.ciudadLlegada ?? ''}` : 'Sin recorrido'}
      </div>
      <div className='mb-2'>
        <strong>Inicio:</strong> {viaje.fechaIni ? new Date(new Date(viaje.fechaIni).getTime() + 3 * 60 * 60 * 1000).toLocaleString('es-AR') : 'Sin fecha'}
      </div>
      <div className='mb-2'>
        <strong>Fin:</strong> {viaje.fechaFin ? new Date(new Date(viaje.fechaFin).getTime() + 3 * 60 * 60 * 1000).toLocaleString('es-AR') : 'Sin fecha'}
      </div>
      <div className='mb-2'>
        <strong>Estado:</strong> {viaje.estado ?? 'Sin estado'}
      </div>

      <h6 className='mt-3'>Líneas de cargas</h6>
      {lineas.length > 0 && (
        <div>
          {lineas.map((l) => {
            const cantidad = l.cantidadVagon ?? l.cantidadVagones ?? l.cantidad ?? null
            // resolve carga name: l.carga may be an id or an object
            const cargaField = l.carga ?? null
            let cargaNombre = ''
            if (cargaField && typeof cargaField === 'object') {
              cargaNombre = cargaField.name ?? cargaField.descripcion ?? cargaField.nombre ?? `Carga #${cargaField.id ?? 'sin id'}`
            } else if (cargaField) {
              // attempt to resolve by id from allCargas
              if (Array.isArray(allCargas)) {
                const found = allCargas.find((c) => String(c.id) === String(cargaField) || String(c.id) === String(cargaField?.id))
                if (found) cargaNombre = found.name ?? found.descripcion ?? found.nombre ?? `Carga #${found.id}`
                else cargaNombre = `Carga #${cargaField}`
              } else {
                cargaNombre = `Carga #${cargaField}`
              }
            } else {
              cargaNombre = `Carga #${l.id ?? 'sin id'}`
            }

            const cantidadText = (typeof cantidad === 'number' || (typeof cantidad === 'string' && /^[0-9]+$/.test(cantidad)))
              ? `x${cantidad}`
              : (cantidad ?? 'x?')

            return (
              <div key={l.id ?? cargaNombre ?? Math.random()} className='mb-2'>
                <div><strong>Carga:</strong> {cargaNombre} {cantidadText}</div>
              </div>
            )
          })}
        </div>
      )}
      {lineas.length === 0 && <p>Sin líneas de cargas</p>}

      <h6 className='mt-3'>Observaciones</h6>
      {(obsLoading || lineasLoading) && <p>Cargando detalles...</p>}
      {!obsLoading && !lineasLoading && observaciones.length > 0 && (
        <ul className='list-group'>
          {observaciones.map((o) => {
            // permissive category detection: the API sometimes returns different shapes
            const categoriaNombre = (() => {
              const maybe = o.categoriaDenuncia ?? o.categoria ?? o.categoriaNombre ?? o.categoriaTitulo ?? o.categoriaDenunciaId ?? o.categoriaId ?? null
              if (!maybe) return 'Sin categoría'
              if (typeof maybe === 'string' && maybe.trim()) return maybe
              const tryResolveById = (id) => {
                if (!id && id !== 0) return null
                const sid = String(id)
                // check locally fetched map first
                if (categoriaMap && categoriaMap[sid]) {
                  const c = categoriaMap[sid]
                  return c.titulo ?? c.nombre ?? c.label ?? (c.descripcion ? String(c.descripcion).slice(0, 200) : null)
                }
                if (!Array.isArray(allCategorias)) return null
                const found = allCategorias.find((c) => {
                  const cid = c.id ?? c._id ?? c.categoriaId
                  try { return String(cid) === sid } catch (e) { return false }
                })
                if (found) return found.titulo ?? found.nombre ?? found.label ?? (found.descripcion ? String(found.descripcion).slice(0, 200) : null)
                return null
              }
              if (typeof maybe === 'number' || (typeof maybe === 'string' && maybe.match && maybe.match(/^[0-9]+$/))) {
                const resolved = tryResolveById(maybe)
                if (resolved) return resolved
                return `#${maybe}`
              }
              if (typeof maybe === 'object') {
                if (maybe.titulo) return maybe.titulo
                if (maybe.nombre) return maybe.nombre
                for (const k of ['titulo', 'nombre', 'label', 'descripcion']) {
                  if (typeof maybe[k] === 'string' && maybe[k].trim()) return maybe[k]
                }
                const mid = maybe.id ?? maybe._id ?? maybe.categoriaId
                if (mid) {
                  const resolved = tryResolveById(mid)
                  if (resolved) return resolved
                  return `#${mid}`
                }
              }
              return 'Sin categoría'
            })()

            const descripcion = o.observaciones ?? o.descripcion ?? o.texto ?? o.detalle ?? o.descripcionObservacion ?? 'Sin descripción'
            return (
              <li key={o.id ?? Math.random()} className='list-group-item'>
                <div style={{ fontWeight: 600 }}>{categoriaNombre}</div>
                <div style={{ marginTop: 4 }}>{descripcion}</div>
              </li>
            )
          })}
        </ul>
      )}
      {!obsLoading && !lineasLoading && observaciones.length === 0 && <p>Sin observaciones</p>}

      {/* Debug: show raw shapes to help map properties when relations are missing */}
      <div className='mt-3'>
        <button type='button' className='btn btn-sm btn-outline-secondary' onClick={() => setShowRaw((s) => !s)}>
          {showRaw ? 'Ocultar raw data' : 'Mostrar raw data (debug)'}
        </button>
        {showRaw && (
          <div className='mt-2'>
            <h6>Raw viaje</h6>
            <pre style={{ maxHeight: 300, overflow: 'auto', background: '#f8f9fa', padding: 8 }}>
              {JSON.stringify(viaje, null, 2)}
            </pre>
            <h6>Raw observaciones (filtro / fetched)</h6>
            <pre style={{ maxHeight: 200, overflow: 'auto', background: '#f8f9fa', padding: 8 }}>
              {JSON.stringify(debugFilteredObservaciones, null, 2)}
            </pre>
            <h6>Raw lineas (filtro / fetched)</h6>
            <pre style={{ maxHeight: 200, overflow: 'auto', background: '#f8f9fa', padding: 8 }}>
              {JSON.stringify(debugFilteredLineas, null, 2)}
            </pre>
          </div>
        )}

      </div>

    </div>
  )
}
