import { useForm, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useLicenciaPost } from '../../hooks/licencia/useLicenciaPost'
import { useLicenciaPut } from '../../hooks/licencia/useLicenciasPut'
import { useConductoresInfinite } from '../../hooks/conductor/useConductorInfinite.js'
import { EntitySelector } from '../shared/EntitySelector.jsx'

export function LicenciaForm({ onSuccess, licenciaToEdit }) {
  const { data: dataConductores, fetchNextPage: nextConductores, hasNextPage: hasNextConductores } = useConductoresInfinite({ filterColumn: 'estado', filterValue: 'Activo' })
  const [conductores, setConductores] = useState([])
  const { register, formState: { errors }, handleSubmit, isPending: isPendingForm, watch, control } = useForm({ 
    mode: 'onBlur',
    defaultValues: licenciaToEdit ? { idConductor: licenciaToEdit.conductor?.id } : {}
  })
  const { mutateAsync: handlePost, isError: isErrorPost } = useLicenciaPost()
  const { mutateAsync: handlePut, isError: isErrorPut } = useLicenciaPut()

  // Cargar datos de los hooks infinitos
  useEffect(() => {
    let newConductores = dataConductores?.pages.flatMap(p => p.items) ?? []

    // Prepend selected entity for editing to ensure it is available in selector
    if (licenciaToEdit && licenciaToEdit.conductor && !newConductores.find(c => c.id === licenciaToEdit.conductor.id)) {
      newConductores = [licenciaToEdit.conductor, ...newConductores]
    }

    setConductores(newConductores)
  }, [dataConductores, licenciaToEdit])

  const onSubmit = async (formData) => {
    const licencia = {
      estado: formData.estado,
      fechaHecho: formData.fechaHecho,
      fechaVencimiento: formData.fechaVencimiento,
      idConductor: Number(formData.idConductor)
    }

    if (licenciaToEdit) {
      licencia.id = licenciaToEdit.id
      await handlePut(licencia)

      if (!isErrorPut) onSuccess()
      return
    }

    await handlePost(licencia)

    if (!isErrorPost) onSuccess()

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-3'>
        <label className='form-label'>Conductor:</label>
        <Controller
          name='idConductor'
          control={control}
          rules={{ required: 'El "Conductor" es requerido' }}
          render={({ field }) => (
            <EntitySelector value={field.value} onChange={field.onChange} entityList={conductores} fetchNextPage={nextConductores} hasNextPage={hasNextConductores} entityName="conductor" />
          )}
        />
        {errors.idConductor && <span className='text-danger'>{errors.idConductor.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='fechaHecho'>Fecha de hecho:</label>
        <input
          id='fechaHecho' type='date' {...register('fechaHecho', { required: 'La "Fecha de hecho" es requerida' })}
          className='form-control' placeholder='Fecha de hecho de la licencia'
          defaultValue={licenciaToEdit?.fechaHecho ? licenciaToEdit.fechaHecho.slice(0, 10) : ''}
        />
        {errors.fechaHecho && <span className='text-danger'>{errors.fechaHecho.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='fechaVencimiento'>Fecha de vencimiento:</label>
        <input
          id='fechaVencimiento' type='date' {...register('fechaVencimiento', {
            required: 'La "Fecha de vencimiento" es requerida',
            validate: (value) => {
              const fechaHecho = new Date(watch('fechaHecho'))
              const fechaVencimiento = new Date(value)
              return fechaVencimiento >= fechaHecho || 'La "Fecha de vencimiento" debe ser posterior o igual a la de hecho'
            }
          })}
          className='form-control' placeholder='Fecha de vencimiento de la licencia'
          defaultValue={licenciaToEdit?.fechaVencimiento ? licenciaToEdit.fechaVencimiento.slice(0, 10) : ''}

        />
        {errors.fechaVencimiento && <span className='text-danger'>{errors.fechaVencimiento.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='estado'>Estado:</label>
        <select
          id='estado' {...register('estado', {
            required: 'El "Estado" es requerido',
            value: licenciaToEdit ? licenciaToEdit.estado : ''
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

      {isErrorPost && <span className='text-danger'>Error al crear la licencia</span>}
      {isErrorPut && <span className='text-danger'>Error al actualizar la licencia</span>}
    </form>
  )
}
