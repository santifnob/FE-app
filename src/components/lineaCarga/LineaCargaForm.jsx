import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useLineaCargaPost } from '../../hooks/lineaCarga/useLineaCargaPost.js'
import { useLineaCargaPut } from '../../hooks/lineaCarga/useLineaCargasPut.js'
import { useViajesInfinite } from '../../hooks/viaje/useViajeInfinite.js'
import { useCargasInfinite } from '../../hooks/carga/useCargaInfinite.js'
import { LineaCargaFindAll } from '../../hooks/lineaCarga/useLineaCargaQuery.js'
import { EntitySelector } from '../shared/EntitySelector.jsx'

export function LineaCargaForm({ onSuccess, lineaCargaToEdit }) {
  const { data: dataCargas, fetchNextPage: nextCargas, hasNextPage: hasNextCargas } = useCargasInfinite({ filters: { estado: 'Activo' } })
  const { data: dataViajes, fetchNextPage: nextViajes, hasNextPage: hasNextViajes } = useViajesInfinite({})
  const [cargas, setCargas] = useState([])
  const [viajes, setViajes] = useState([])
  const { data: todasLasLineas = [] } = LineaCargaFindAll()

  const [yaExisteError, setYaExisteError] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control
  } = useForm({
    mode: 'onBlur',
    defaultValues: lineaCargaToEdit
      ? {
        estado: lineaCargaToEdit.estado,
        idViaje: lineaCargaToEdit.viaje?.id,
        idCarga: lineaCargaToEdit.carga?.id,
        cantidadVagon: lineaCargaToEdit.cantidadVagon
      }
      : {}
  })

  const idViaje = watch('idViaje')
  const idCarga = watch('idCarga')

  // Cargar datos de los hooks infinitos
  useEffect(() => {
    let newCargas = dataCargas?.pages.flatMap(p => p.items) ?? []
    let newViajes = dataViajes?.pages.flatMap(p => p.items) ?? []

    // Prepend selected entities for editing to ensure they are available in selectors
    if (lineaCargaToEdit) {
      if (lineaCargaToEdit.carga && !newCargas.find(c => c.id === lineaCargaToEdit.carga.id)) {
        newCargas = [lineaCargaToEdit.carga, ...newCargas]
      }
      if (lineaCargaToEdit.viaje && !newViajes.find(v => v.id === lineaCargaToEdit.viaje.id)) {
        newViajes = [lineaCargaToEdit.viaje, ...newViajes]
      }
    }

    setCargas(newCargas)
    setViajes(newViajes)
  }, [dataCargas, dataViajes, lineaCargaToEdit])

  useEffect(() => {
    if (!lineaCargaToEdit && idViaje && idCarga) {
      const existe = todasLasLineas.some(
        (lc) => lc.viaje?.id === Number(idViaje) && lc.carga?.id === Number(idCarga)
      )
      setYaExisteError(existe)
    } else {
      setYaExisteError(false)
    }
  }, [idViaje, idCarga, todasLasLineas, lineaCargaToEdit])

  const { mutateAsync: handlePost, isError: isErrorPost, isPending: isPendingPost } = useLineaCargaPost()
  const { mutateAsync: handlePut, isError: isErrorPut, isPending: isPendingPut } = useLineaCargaPut()

  const onSubmit = async (formData) => {
    const lineaCarga = {
      estado: formData.estado,
      idViaje: Number(formData.idViaje),
      idCarga: Number(formData.idCarga),
      cantidadVagon: Number(formData.cantidadVagon)
    }

    if (lineaCargaToEdit) {
      lineaCarga.id = lineaCargaToEdit.id
      await handlePut(lineaCarga)
      if (!isErrorPut) onSuccess()
      return
    }

    await handlePost(lineaCarga)
    if (!isErrorPost) onSuccess()
  }

  const isPendingForm = isPendingPost || isPendingPut

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-1'>
        <label>Viaje:</label>
        <Controller
          name='idViaje'
          control={control}
          rules={{ required: 'El "Viaje" es requerido' }}
          render={({ field }) => (
            <EntitySelector value={field.value} onChange={field.onChange} entityList={viajes} fetchNextPage={nextViajes} hasNextPage={hasNextViajes} entityName='viaje' />
          )}
        />
        {errors.idViaje && <p style={{ color: 'red' }}>{errors.idViaje.message}</p>}
      </div>

      <div className='mb-1'>
        <label>Carga:</label>
        <Controller
          name='idCarga'
          control={control}
          rules={{ required: 'La "Carga" es requerida' }}
          render={({ field }) => (
            <EntitySelector value={field.value} onChange={field.onChange} entityList={cargas} fetchNextPage={nextCargas} hasNextPage={hasNextCargas} entityName='carga' />
          )}
        />
        {errors.idCarga && <p style={{ color: 'red' }}>{errors.idCarga.message}</p>}
      </div>

      <div className='mb-1'>
        <label>Cantidad de vagones:</label>
        <input
          type='text'
          {...register('cantidadVagon', {
            required: 'La "Cantidad de vagones" es requerida',
            pattern: {
              value: /^[1-9][0-9]*$/,
              message: 'La "Cantidad de vagones" debe ser un número entero mayor a 0'
            }
          })}
          className='form-control'
          placeholder='La cantidad de vagones de la carga'
          disabled={yaExisteError}
        />
        {errors.cantidadVagon && <p style={{ color: 'red' }}>{errors.cantidadVagon.message}</p>}
      </div>

      <div className='mb-1'>
        <label>Estado:</label>
        <select
          {...register('estado', { required: "El 'Estado' es requerido" })}
          className='form-control'
          disabled={yaExisteError}
        >
          <option value=''>Seleccione un estado</option>
          <option value='Activo'>Activo</option>
          <option value='Inactivo'>Inactivo</option>
        </select>
        {errors.estado && <p style={{ color: 'red' }}>{errors.estado.message}</p>}
      </div>

      {yaExisteError && (
        <p style={{ color: 'red' }} className='mt-2'>
          Ya existe una línea de carga con ese viaje y carga.
        </p>
      )}

      <div className='d-flex justify-content-between mt-3'>
        <button type='button' className='btn btn-secondary' onClick={() => onSuccess()}>
          Volver
        </button>
        <button type='submit' className='btn btn-primary' disabled={isPendingForm || yaExisteError}>
          {isPendingForm ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {isErrorPost && <p style={{ color: 'red' }} className='mt-2'>Error al crear la línea de carga</p>}
      {isErrorPut && <p style={{ color: 'red' }} className='mt-2'>Error al actualizar la línea de carga</p>}
    </form>
  )
}
