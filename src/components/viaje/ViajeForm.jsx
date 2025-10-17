import { useForm, Controller } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useViajePost } from '../../hooks/viaje/useViajePost'
import { useViajePut } from '../../hooks/viaje/useViajesPut'
import { useRecorridosInfinite } from '../../hooks/recorrido/useRecorridoInfinite.js'
import { useConductoresInfinite } from '../../hooks/conductor/useConductorInfinite.js'
import { useTrenesInfinite } from '../../hooks/tren/useTrenInfinite.js'
import { EntitySelector } from './EntitySelector.jsx'

export function ViajeForm({ onSuccess, viajeToEdit }) {
  // --- Hooks de datos ---
  const { data: dataRecorridos, fetchNextPage: nextRecorridos, hasNextPage: hasNextRecorridos } = useRecorridosInfinite({ filterColumn: 'estado', filterValue: 'Activo' })
  const { data: dataConductores, fetchNextPage: nextConductor, hasNextPage: hasNextConductor } = useConductoresInfinite({ filterColumn: 'estado', filterValue: 'Activo' })
  const { data: dataTrenes, fetchNextPage: nextTrenes, hasNextPage: hasNextTrenes } = useTrenesInfinite({ filterColumn: 'estado', filterValue: 'Activo' })

  const [recorridos, setRecorridos] = useState([])
  const [conductores, setConductores] = useState([])
  const [trenes, setTrenes] = useState([])
  // const [mensajeError, setMensajeError] = useState('')

  // --- Mutaciones (crear / editar viaje) ---
  const { mutateAsync: handlePost, isError: isErrorPost, isPending: isPendingPost } = useViajePost()
  const { mutateAsync: handlePut, isError: isErrorPut, isPending: isPendingPut } = useViajePut()
  const isPendingForm = isPendingPost || isPendingPut

  // --- Form setup ---
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
          fechaIni: viajeToEdit.fechaIni?.slice(0, 10),
          fechaFin: viajeToEdit.fechaFin?.slice(0, 10),
          estado: viajeToEdit.estado,
          idTren: viajeToEdit.tren?.id,
          idRecorrido: viajeToEdit.recorrido?.id,
          idConductor: viajeToEdit.conductor?.id
        }
      : {}
  })

  // const idConductor = watch('idConductor')
  // const idTren = watch('idTren')
  // const fechaIni = watch('fechaIni')
  // const fechaFin = watch('fechaFin')

  // --- Cargar datos de los hooks infinitos ---
  useEffect(() => {
    setRecorridos(dataRecorridos?.pages.flatMap(p => p.items) ?? [])
    setConductores(dataConductores?.pages.flatMap(p => p.items) ?? [])
    setTrenes(dataTrenes?.pages.flatMap(p => p.items) ?? [])
  }, [dataRecorridos, dataConductores, dataTrenes])

  // --- Validaciones de solapamientos y licencias ---
  // useEffect(() => {
  //   setMensajeError('')
  //   if (!idConductor || !fechaIni || !fechaFin || !idTren) return

  //   const conductor = conductores.find(c => c.id === Number(idConductor))
  //   const tren = trenes.find(t => t.id === Number(idTren))
  //   if (!conductor || !tren) return

  //   const inicio = new Date(fechaIni)
  //   const fin = new Date(fechaFin)

  //   const conductorOcupado = conductor.viajes
  //     .filter(v => v.estado === 'Activo' && (!viajeToEdit || v.id !== viajeToEdit.id))
  //     .some(v => {
  //       const vi = new Date(v.fechaIni)
  //       const vf = new Date(v.fechaFin)
  //       return (vi <= fin && vf >= inicio) || (vi <= inicio && vf >= fin)
  //     })

  //   if (conductorOcupado) {
  //     setMensajeError('El conductor ya tiene un viaje en ese rango de fechas')
  //     return
  //   }

  //   const licenciaValida = conductor.licencias.some(l => {
  //     const li = new Date(l.fechaHecho)
  //     const lf = new Date(l.fechaVencimiento)
  //     return li <= inicio && lf >= fin
  //   })

  //   if (!licenciaValida) {
  //     setMensajeError('El conductor no tiene una licencia que cubra el rango de fechas')
  //     return
  //   }

  //   const trenOcupado = tren.viajes
  //     .filter(v => v.estado === 'Activo' && (!viajeToEdit || v.id !== viajeToEdit.id))
  //     .some(v => {
  //       const vi = new Date(v.fechaIni)
  //       const vf = new Date(v.fechaFin)
  //       return (vi <= fin && vf >= inicio) || (vi <= inicio && vf >= fin)
  //     })

  //   if (trenOcupado) {
  //     setMensajeError('El tren ya tiene un viaje en ese rango de fechas')
  //   }
  // }, [idConductor, idTren, fechaIni, fechaFin, conductores, trenes, viajeToEdit])

  // --- Envío del formulario ---
  const onSubmit = async (formData) => {
    const viaje = {
      fechaIni: formData.fechaIni,
      fechaFin: formData.fechaFin,
      estado: formData.estado,
      idTren: Number(formData.idTren),
      idRecorrido: Number(formData.idRecorrido),
      idConductor: Number(formData.idConductor)
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

  // --- Render ---
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
            <EntitySelector value={field.value} onChange={field.onChange} entityList={conductores} fetchNextPage={nextConductor} hasNextPage={hasNextConductor} entityName={'conductor'}/>
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
            <EntitySelector value={field.value} onChange={field.onChange} entityList={trenes} fetchNextPage={nextTrenes} hasNextPage={hasNextTrenes} entityName={'tren'}/>
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
            <EntitySelector value={field.value} onChange={field.onChange} entityList={recorridos} fetchNextPage={nextRecorridos} hasNextPage={hasNextRecorridos} entityName={'recorrido'}/>
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

      {/* Mensajes */}
      {/* {mensajeError && <p className='text-danger mt-2'>{mensajeError}</p>} */}

      <div className='d-flex justify-content-between mt-3'>
        <button type='button' className='btn btn-secondary' onClick={onSuccess}>
          Volver
        </button>
        <button type='submit' className='btn btn-success' disabled={isPendingForm /*|| mensajeError*/}>
          {isPendingForm ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {isErrorPost && <span className='text-danger'>Error al crear el viaje</span>}
      {isErrorPut && <span className='text-danger'>Error al actualizar el viaje</span>}
    </form>
  )
}