import { useForm } from 'react-hook-form'
import { useObservacionPost } from '../../hooks/observacion/useObservacionPost.js'
import { useObservacionPut } from '../../hooks/observacion/useObservacionesPut.js'
import { CategoriaDenunciaActivas } from '../../hooks/categoriaDenuncia/useCategoriaDenunciaQuery.js'
import { ViajeFindAll } from '../../hooks/viaje/useViajeQuery.js'

export function ObservacionForm ({ onSuccess, observacionToEdit }) {
  const { data: categoriaDenuncias = [] } = CategoriaDenunciaActivas()

  const { register, formState: { errors }, handleSubmit, isPending: isPendingForm } = useForm({
    mode: 'onBlur',
    defaultValues: observacionToEdit
      ? {
          observaciones: observacionToEdit.observaciones,
          estado: observacionToEdit.estado,
          idViaje: observacionToEdit.viaje?.id,
          idCategoria: observacionToEdit.categoriaDenuncia?.id,
        }
      : {},
  });

  const { mutateAsync: handlePost, isError: isErrorPost } = useObservacionPost()
  const { mutateAsync: handlePut, isError: isErrorPut } = useObservacionPut()
  const { data: viajes = [] } = ViajeFindAll()
  
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
    return
  }

  return (
    console.log(viajes),
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className='mb-3'>
        <label className='form-label'>Viaje:</label>
        <select
          {...register('idViaje', { required: 'El "Viaje" es requerido' })}
          className='form-control'
          defaultValue={observacionToEdit?.viaje?.id || ''}
        >
          <option value=''>Selecciona un viaje</option>
          {viajes.map(c => (
            <option key={c.id} value={c.id}>
              {c.id}-{c.recorrido.ciudadSalida}/{c.recorrido.ciudadLlegada} ({c.fechaIni? new Date(new Date(c.fechaIni).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR'): 'Sin fecha'})
            </option>
          ))}
        </select>
        {errors.idViaje && <span className='text-danger'>{errors.idViaje.message}</span>}
      </div>

      <div className='mb-3'>
        <label className='form-label'>Categoria:</label>
        <select
          {...register('idCategoria', { required: 'La "Categoria" es requerida' })}
          className='form-control'
          defaultValue={observacionToEdit?.categoria?.id || ''}
        >
          <option value=''>Selecciona una categoria</option>
          {categoriaDenuncias.map(c => (
            <option key={c.id} value={c.id}>
              {c.id}-{c.titulo} {/* el usuario ve nombre completo */}
            </option>
          ))}
        </select>
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
