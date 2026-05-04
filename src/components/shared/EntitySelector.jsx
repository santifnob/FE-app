import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

export function EntitySelector({ value, onChange, entityList, fetchNextPage, hasNextPage, entityName }) {
  const [isOpen, setIsOpen] = useState(false)
  const [chosedItem, setchosedItem] = useState(undefined)

  useEffect(() => {
    setchosedItem(entityList.find(c => c.id === value))
  }, [value, entityList, entityName])

  function defineEntityDisplay(entity) {
    switch (entityName) {
      case 'conductor':
        return `${entity.id} - ${entity.nombre} ${entity.apellido}`
      case 'recorrido':
        return `${entity.id} - ${entity.ciudadSalida} -> ${entity.ciudadLlegada}`
      case 'tren':
        return `${entity.id} - ${entity.modelo}`
      case 'tipoCarga':
        return `${entity.id} - ${entity.name}`
      case 'categoriaDenuncia':
        return `${entity.id} - ${entity.titulo}`
      case 'licencia':
        return `${entity.id} - ${entity.numero}`
      case 'lineaCarga':
        return `${entity.id} - ${entity.nombre}`
      case 'observacion':
        return `${entity.id} - ${entity.observaciones?.slice(0, 20)}...`
      case 'viaje':
        return `${entity.id} - ${entity.recorrido?.ciudadSalida} -> ${entity.recorrido?.ciudadLlegada} (${entity.fechaIni ? new Date(new Date(entity.fechaIni).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR') : 'Sin fecha'})`
      case 'carga':
        return `${entity.id} - ${entity.name}`
      default:
        return `${entity.id} - Entidad`
    }
  }

  return (
    <div className='position-relative'>
      <button type='button' className='form-control text-start' onClick={() => setIsOpen(!isOpen)}>
        {chosedItem ? defineEntityDisplay(chosedItem) : 'Selecciona una entidad'}
      </button>

      {isOpen && (
        <div
          id='scrollableDropdown'
          className='border rounded mt-1 bg-white position-absolute w-100'
          style={{ maxHeight: 200, overflowY: 'auto', zIndex: 1050 }}
        >
          <InfiniteScroll
            dataLength={entityList.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            scrollableTarget='scrollableDropdown'
            loader={<div className='p-2 text-center'>Cargando...</div>}
          >
            {entityList.map(c => (
              <div
                key={c.id}
                className={`p-2 dropdown-item ${c.id === value ? 'bg-primary text-white' : ''}`}
                onClick={() => {
                  onChange(c.id)
                  setIsOpen(false)
                }}
                style={{ cursor: 'pointer' }}
              >
                {defineEntityDisplay(c)}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      )}
    </div>
  )
}
