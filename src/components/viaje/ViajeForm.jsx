import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useViajePost } from '../../hooks/viaje/useViajePost'
import { useViajePut } from '../../hooks/viaje/useViajesPut'
import { RecorridoActivos } from '../../hooks/recorrido/useRecorridoQuery.js'
import { TrenActivos } from '../../hooks/tren/useTrenQuery.js'
import { ConductorFindAll } from '../../hooks/conductor/useConductorQuery.js'

export function ViajeForm({ onSuccess, viajeToEdit }) {
  
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    mode: 'onBlur',
    defaultValues: viajeToEdit
      ? {
          fechaIni: viajeToEdit.fechaIni?.slice(0, 10),
          fechaFin: viajeToEdit.fechaFin?.slice(0, 10),
          estado: viajeToEdit.estado,
          idTren: viajeToEdit.tren?.id,
          idRecorrido: viajeToEdit.recorrido?.id,
          idConductor: viajeToEdit.conductor?.id,
        }
      : {},
  })

  const { mutateAsync: handlePost, isError: isErrorPost, isPending: isPendingPost } = useViajePost()
  const { mutateAsync: handlePut, isError: isErrorPut, isPending: isPendingPut } = useViajePut()
  const { data: recorridos = [] } = RecorridoActivos()
  const { data: conductores = [] } = ConductorFindAll()
  const { data: trenes = [] } = TrenActivos()

  const [mensajeError, setMensajeError] = useState('')
  const idConductor = watch('idConductor')
  const idTren = watch('idTren')
  const fechaIni = watch('fechaIni')
  const fechaFin = watch('fechaFin')

  useEffect(() => {
    setMensajeError('')

    if (!idConductor || !fechaIni || !fechaFin || !idTren) return

    const conductor = conductores.find(c => c.id === Number(idConductor))
    if (!conductor) return

    const inicio = new Date(fechaIni)
    const fin = new Date(fechaFin)

    const tieneViajeEnRango = conductor.viajes
      .filter(c => c.estado === 'Activo' && (!viajeToEdit || c.id !== viajeToEdit.id))
      .some(v => {
        const vi = new Date(v.fechaIni)
        const vf = new Date(v.fechaFin)
        return (vi <= fin && vf >= inicio) || (vi <= inicio && vf >= fin)
      })

    if (tieneViajeEnRango) {
      setMensajeError('El conductor ya tiene un viaje en ese rango de fechas')
      return
    }

    const tieneLicenciaQueCubreRango = conductor.licencias.some(l => {
      const li = new Date(l.fechaHecho)
      const lf = new Date(l.fechaVencimiento)
      return li <= inicio && lf >= fin
    })

    if (!tieneLicenciaQueCubreRango) {
      setMensajeError('El conductor no tiene una licencia que cubra el rango de fechas del viaje')
      return
    }

    const tren = trenes.find(t => t.id === Number(idTren))
    if (!tren) return

    const tieneTrenViajeEnRango = tren.viajes
      .filter(v => v.estado === 'Activo' && (!viajeToEdit || v.id !== viajeToEdit.id))
      .some(v => {
        const vi = new Date(v.fechaIni)
        const vf = new Date(v.fechaFin)
        return (vi <= fin && vf >= inicio) || (vi <= inicio && vf >= fin)
      })

    if (tieneTrenViajeEnRango) {
      setMensajeError('El Tren ya tiene un viaje en ese rango de fechas')
      return
    }
  }, [idConductor, idTren, fechaIni, fechaFin, conductores, trenes, viajeToEdit])

  const onSubmit = async (formData) => {
    const viaje = {
      fechaIni: formData.fechaIni,
      fechaFin: formData.fechaFin,
      estado: formData.estado,
      idTren: Number(formData.idTren),
      idRecorrido: Number(formData.idRecorrido),
      idConductor: Number(formData.idConductor),
    }

    if (viajeToEdit) {
      viaje.id = viajeToEdit.id
      await handlePut(viaje)
      if (!isErrorPut) onSuccess()
      return
    }

    await handlePost(viaje)
    if (!isErrorPost) onSuccess()
  }

  const isPendingForm = isPendingPost || isPendingPut

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-3'>
        <label className='form-label'>Conductor:</label>
        <select
          {...register('idConductor', { required: 'El "Conductor" es requerido' })}
          className='form-control'
          defaultValue={viajeToEdit?.conductor?.id ?? ''}
        >
          <option value=''>Selecciona un conductor</option>
          {conductores.map(c => (
            <option key={c.id} value={c.id}>
              {c.id}-{c.nombre} {c.apellido}
            </option>
          ))}
        </select>
        {errors.idConductor && <span className='text-danger'>{errors.idConductor.message}</span>}
      </div>

      <div className='mb-3'>
        <label className='form-label'>Tren:</label>
        <select
          {...register('idTren', { required: 'El "Tren" es requerido' })}
          className='form-control'
          defaultValue={viajeToEdit?.tren?.id ?? ''}
        >
          <option value=''>Selecciona un tren</option>
          {trenes.map(c => (
            <option key={c.id} value={c.id}>
              {c.id}-{c.modelo} (color: {c.color})
            </option>
          ))}
        </select>
        {errors.idTren && <span className='text-danger'>{errors.idTren.message}</span>}
      </div>

      <div className='mb-3'>
        <label className='form-label'>Recorrido:</label>
        <select
          {...register('idRecorrido', { required: 'El "Recorrido" es requerido' })}
          className='form-control'
          defaultValue={viajeToEdit?.recorrido?.id ?? ''}
        >
          <option value=''>Selecciona un recorrido</option>
          {recorridos.map(c => (
            <option key={c.id} value={c.id}>
              {c.id}-(Salida: {c.ciudadSalida}) (Llegada: {c.ciudadLlegada})
            </option>
          ))}
        </select>
        {errors.idRecorrido && <span className='text-danger'>{errors.idRecorrido.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='fechaIni'>Fecha de inicio:</label>
        <input
          id='fechaIni'
          type='date'
          {...register('fechaIni', { required: 'La "Fecha de inicio" es requerida' })}
          className='form-control'
          placeholder='Fecha de inicio del viaje'
          defaultValue={viajeToEdit?.fechaIni ? viajeToEdit.fechaIni.slice(0, 10) : ''}
        />
        {errors.fechaIni && <span className='text-danger'>{errors.fechaIni.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='fechaFin'>Fecha de llegada:</label>
        <input
          id='fechaFin'
          type='date'
          {...register('fechaFin', {
            required: 'La "Fecha de llegada" es requerida',
            validate: (value) => {
              const fechaIni = new Date(watch('fechaIni'))
              const fechaFin = new Date(value)
              return fechaFin >= fechaIni || 'La fecha de llegada debe ser posterior o igual a la de inicio'
            }
          })}
          className='form-control'
          placeholder='Fecha de llegada del viaje'
          defaultValue={viajeToEdit?.fechaFin ? viajeToEdit.fechaFin.slice(0, 10) : ''}
        />
        {errors.fechaFin && <span className='text-danger'>{errors.fechaFin.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='estado'>Estado:</label>
        <select
          id='estado'
          {...register('estado', { required: 'El "Estado" es requerido' })}
          className='form-select'
        >
          <option value=''>Seleccione un estado</option>
          <option value='Activo'>Activo</option>
          <option value='Pendiente'>Pendiente</option>
          <option value='Rechazado'>Rechazado</option>
          <option value='Inactivo'>Inactivo</option>
        </select>
      </div>

      {mensajeError && (
        <p className='text-danger mt-2'>{mensajeError}</p>
      )}

      <div className='d-flex justify-content-between'>
        <button type='button' className="btn btn-secondary" onClick={onSuccess}>
          Volver
        </button>
        <button
          type='submit'
          className='btn btn-success d-block mt-2'
          style={{ backgroundColor: '#002050ff', color: '#fff' }}
          disabled={isPendingForm || mensajeError}
        >
          {isPendingForm ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {isErrorPost && <span className='text-danger'>Error al crear el viaje</span>}
      {isErrorPut && <span className='text-danger'>Error al actualizar el viaje</span>}
    </form>
  )
}