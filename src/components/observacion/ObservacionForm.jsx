import { useForm, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useObservacionPost } from '../../hooks/observacion/useObservacionPost.js'
import { useObservacionPut } from '../../hooks/observacion/useObservacionesPut.js'
import { useCategoriaDenunciasInfinite } from '../../hooks/categoriaDenuncia/useCategoriaDenunciaInfinite.js'
import { useViajesInfinite } from '../../hooks/viaje/useViajeInfinite.js'
import { EntitySelector } from '../shared/EntitySelector.jsx'

export function ObservacionForm({ onSuccess, observacionToEdit }) {
  const { data: dataCategoriaDenuncias, fetchNextPage: nextCategoriaDenuncias, hasNextPage: hasNextCategoriaDenuncias } = useCategoriaDenunciasInfinite({ filters: { estado: 'Activo' } })
  const { data: dataViajes, fetchNextPage: nextViajes, hasNextPage: hasNextViajes } = useViajesInfinite({})
  const [categoriaDenuncias, setCategoriaDenuncias] = useState([])
  const [viajes, setViajes] = useState([])

  const { register, formState: { errors }, handleSubmit, isPending: isPendingForm, control } = useForm({
    mode: 'onBlur',
    defaultValues: observacionToEdit
      ? {
        observaciones: observacionToEdit.observaciones,
        estado: observacionToEdit.estado,
        idViaje: observacionToEdit.viaje?.id,
        idCategoria: observacionToEdit.categoriaDenuncia?.id
      }
      : {}
  })

  const { mutateAsync: handlePost, isError: isErrorPost } = useObservacionPost()
  const { mutateAsync: handlePut, isError: isErrorPut } = useObservacionPut()

  // Cargar datos de los hooks infinitos
  useEffect(() => {
    setCategoriaDenuncias(dataCategoriaDenuncias?.pages.flatMap(p => p.items) ?? [])
    setViajes(dataViajes?.pages.flatMap(p => p.items) ?? [])
  }, [dataCategoriaDenuncias, dataViajes])

  const onSubmit = async (formData) => {
    const observacion = {
      observaciones: formData.observaciones,
      estado: formData.estado,
      idViaje: Number(formData.idViaje),
      idCategoria: Number(formData.idCategoria)
    }

    if (observacionToEdit) {
      observacion.id = observacionToEdit.id
      await handlePut(observacion)

      if (!isErrorPut) onSuccess()
      return
    }

    await handlePost(observacion)

    if (!isErrorPost) onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className='mb-3'>
        <label className='form-label'>Viaje:</label>
        <Controller
          name='idViaje'
          control={control}
          rules={{ required: 'El "Viaje" es requerido' }}
          render={({ field }) => (
            <EntitySelector value={field.value} onChange={field.onChange} entityList={viajes} fetchNextPage={nextViajes} hasNextPage={hasNextViajes} entityName='viaje' />
          )}
        />
        {errors.idViaje && <span className='text-danger'>{errors.idViaje.message}</span>}
      </div>

      <div className='mb-3'>
        <label className='form-label'>Categoria:</label>
        <Controller
          name='idCategoria'
          control={control}
          rules={{ required: 'La "Categoria" es requerida' }}
          render={({ field }) => (
            <EntitySelector value={field.value} onChange={field.onChange} entityList={categoriaDenuncias} fetchNextPage={nextCategoriaDenuncias} hasNextPage={hasNextCategoriaDenuncias} entityName='categoriaDenuncia' />
          )}
        />
        {errors.idCategoria && <span className='text-danger'>{errors.idCategoria.message}</span>}
      </div>

      <div className='mb-3'>
        <label className='form-label' htmlFor='observaciones'>Observaciones:</label>
        <textarea
          id='observaciones'
          {...register('observaciones', {
            required: 'La "Observación" es requerida',
            value: observacionToEdit ? observacionToEdit.observaciones : ''
          })}
          className='form-control'
          placeholder='Observación del viaje'
          rows={6}
          style={{ resize: 'vertical' }}
        />
        {errors.observaciones && <span className='text-danger'>{errors.observaciones.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='estado'>Estado:</label>
        <select
          id='estado' {...register('estado', {
            required: 'El "Estado" es requerido',
            value: observacionToEdit ? observacionToEdit.estado : ''
          })}
          className='form-select'
        >
          <option value=''>Seleccione un estado</option>
          <option value='Activo'>Activo</option>
          <option value='Inactivo'>Inactivo</option>
        </select>
        {errors.estado && <span className='text-danger'>{errors.estado.message}</span>}
      </div>

      <div className='d-flex justify-content-between'>
        <button type='button' className='btn btn-secondary' onClick={onSuccess}>
          Volver
        </button>

        <button type='submit' className='btn btn-success d-block mt-2' style={{ backgroundColor: '#002050ff', color: '#fff' }}>
          {isPendingForm ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {isErrorPost && <span className='text-danger'>Error al crear la observacion</span>}
      {isErrorPut && <span className='text-danger'>Error al actualizar la observacion</span>}
    </form>
  )
}
