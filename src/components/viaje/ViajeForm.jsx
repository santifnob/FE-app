import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useViajePost, useValidationCheck } from '../../hooks/viaje/useViajePost'
import { useViajePut } from '../../hooks/viaje/useViajesPut'
import { useRecorridosInfinite } from '../../hooks/recorrido/useRecorridoInfinite.js'
import { useConductoresInfinite } from '../../hooks/conductor/useConductorInfinite.js'
import { useTrenesInfinite } from '../../hooks/tren/useTrenInfinite.js'
import { EntitySelector } from '../shared/EntitySelector.jsx'

export function ViajeForm({ onSuccess, viajeToEdit }) {
  // Hooks de datos de react query para los infinite scrolls
  const { data: dataRecorridos, fetchNextPage: nextRecorridos, hasNextPage: hasNextRecorridos } = useRecorridosInfinite({ filterColumn: 'estado', filterValue: 'Activo' })
  const { data: dataConductores, fetchNextPage: nextConductor, hasNextPage: hasNextConductor } = useConductoresInfinite({ filterColumn: 'estado', filterValue: 'Activo' })
  const { data: dataTrenes, fetchNextPage: nextTrenes, hasNextPage: hasNextTrenes } = useTrenesInfinite({})

  const [recorridos, setRecorridos] = useState([])
  const [conductores, setConductores] = useState([])
  const [trenes, setTrenes] = useState([])

  // Mutaciones de react query (crear / editar viaje)
  const { mutateAsync: handlePost, isError: isErrorPost, isPending: isPendingPost, error: errorPost } = useViajePost()
  const { mutateAsync: handlePut, isError: isErrorPut, isPending: isPendingPut, error: errorPut } = useViajePut()
  const isPendingForm = isPendingPost || isPendingPut
  // Setup del formulario
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    mode: 'onBlur',
    defaultValues: viajeToEdit
      ? {
        fechaIni: viajeToEdit.fechaIni?.slice(0, 16),
        fechaFin: viajeToEdit.fechaFin?.slice(0, 16),
        estado: viajeToEdit.estado,
        idTren: viajeToEdit.tren?.id,
        idRecorrido: viajeToEdit.recorrido?.id,
        idConductor: viajeToEdit.conductor?.id
      }
      : {}
  })

  const watchIdConductor = watch('idConductor')
  const watchIdTren = watch('idTren')
  const watchFechaIni = watch('fechaIni')
  const watchFechaFin = watch('fechaFin')

  const { isPending: isValidando, isError: isValidateError, error: validateError } = useValidationCheck(watchIdTren, watchIdConductor, watchFechaFin, watchFechaIni, viajeToEdit?.id)

  const isSubmitDisabled = isPendingForm || isValidando || !!isValidateError

  // Cargar datos de los hooks infinitos 
  useEffect(() => {
    let newRecorridos = dataRecorridos?.pages.flatMap(p => p.items) ?? []
    let newConductores = dataConductores?.pages.flatMap(p => p.items) ?? []
    let newTrenes = dataTrenes?.pages.flatMap(p => p.items) ?? []

    if (viajeToEdit) {
      if (viajeToEdit.recorrido && !newRecorridos.find(r => r.id === viajeToEdit.recorrido.id)) {
        newRecorridos = [viajeToEdit.recorrido, ...newRecorridos]
      }
      if (viajeToEdit.conductor && !newConductores.find(c => c.id === viajeToEdit.conductor.id)) {
        newConductores = [viajeToEdit.conductor, ...newConductores]
      }
      if (viajeToEdit.tren && !newTrenes.find(t => t.id === viajeToEdit.tren.id)) {
        newTrenes = [viajeToEdit.tren, ...newTrenes]
      }
    }

    setRecorridos(newRecorridos)
    setConductores(newConductores)
    setTrenes(newTrenes)
  }, [dataRecorridos, dataConductores, dataTrenes, viajeToEdit])

  // Envío del formulario
  const onSubmit = async (formData) => {
    const viaje = {
      fechaIni: formData.fechaIni,
      fechaFin: formData.fechaFin,
      estado: formData.estado,
      idTren: Number(formData.tren.id),
      idRecorrido: Number(formData.recorrido.id),
      idConductor: Number(formData.conductor.id)
    }

    if (viajeToEdit) {
      viaje.id = viajeToEdit.id
      await handlePut(viaje)
      if (!isErrorPut) onSuccess()
    } else {
      await handlePost(viaje)
      if (!isErrorPost) onSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Conductor con scroll infinito */}
      <div className='mb-3'>
        <label className='form-label'>Conductor:</label>
        <Controller
          name='idConductor'
          control={control}
          rules={{ required: 'El "Conductor" es requerido' }}
          render={({ field }) => (
            <EntitySelector value={field.value} onChange={field.onChange} entityList={conductores} fetchNextPage={nextConductor} hasNextPage={hasNextConductor} entityName="conductor" />
          )}
        />
        {errors.idConductor && <span className='text-danger'>{errors.idConductor.message}</span>}
      </div>

      {/* Tren */}
      <div className='mb-3'>
        <label className='form-label'>Tren:</label>
        <Controller
          name='idTren'
          control={control}
          rules={{ required: 'El "Tren" es requerido' }}
          render={({ field }) => (
            <EntitySelector value={field.value} onChange={field.onChange} entityList={trenes} fetchNextPage={nextTrenes} hasNextPage={hasNextTrenes} entityName="tren" />
          )}
        />
        {errors.idTren && <span className='text-danger'>{errors.idTren.message}</span>}
      </div>

      {/* Recorrido */}
      <div className='mb-3'>
        <label className='form-label'>Recorrido:</label>
        <Controller
          name='idRecorrido'
          control={control}
          rules={{ required: 'El "Recorrido" es requerido' }}
          render={({ field }) => (
            <EntitySelector value={field.value} onChange={field.onChange} entityList={recorridos} fetchNextPage={nextRecorridos} hasNextPage={hasNextRecorridos} entityName="recorrido" />
          )}
        />
        {errors.idRecorrido && <span className='text-danger'>{errors.idRecorrido.message}</span>}
      </div>

      {/* Fechas */}
      <div className='mb-2'>
        <label className='form-label'>Fecha de inicio:</label>
        <input
          type='datetime-local'
          {...register('fechaIni', { required: 'La "Fecha de inicio" es requerida' })}
          className='form-control'
        />
        {errors.fechaIni && <span className='text-danger'>{errors.fechaIni.message}</span>}
      </div>

      <div className='mb-2'>
        <label className='form-label'>Fecha de llegada:</label>
        <input
          type='datetime-local'
          {...register('fechaFin', {
            required: 'La "Fecha de llegada" es requerida',
            validate: (value) => new Date(value) >= new Date(watch('fechaIni')) || 'La fecha de llegada debe ser posterior a la de inicio'
          })}
          className='form-control'
        />
        {errors.fechaFin && <span className='text-danger'>{errors.fechaFin.message}</span>}
      </div>

      {/* Estado */}
      <div className='mb-2'>
        <label className='form-label'>Estado:</label>
        <select {...register('estado', { required: 'El "Estado" es requerido' })} className='form-select'>
          <option value=''>Seleccione un estado</option>
          <option value='Activo'>Activo</option>
          <option value='Pendiente'>Pendiente</option>
          <option value='Rechazado'>Rechazado</option>
          <option value='Inactivo'>Inactivo</option>
        </select>
      </div>

      {/* {mensajeError && <p className='text-danger mt-2'>{mensajeError}</p>} */}

      {isErrorPost && <p className='text-danger mt-2'>{errorPost.response?.data?.message || errorPost.message}</p>}
      {isErrorPut && <p className='text-danger mt-2'>{errorPut.response?.data?.message || errorPut.message}</p>}

      {isValidateError && (
        <div className='alert alert-warning mt-3'>
          ⚠️ {validateError.response?.data?.message || validateError.message}
        </div>
      )}

      <div className='d-flex justify-content-between mt-3'>
        <button type='button' className='btn btn-secondary' onClick={onSuccess}>
          Volver
        </button>
        <button type='submit' className='btn btn-success' disabled={isSubmitDisabled}>
          {isPendingForm ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

    </form>
  )
}
