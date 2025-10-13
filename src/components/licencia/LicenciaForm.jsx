import { useForm } from 'react-hook-form'
import { useLicenciaPost } from '../../hooks/licencia/useLicenciaPost'
import { useLicenciaPut } from '../../hooks/licencia/useLicenciasPut'
import { ConductorActivos } from '../../hooks/conductor/useConductorQuery.js'

export function LicenciaForm ({ onSuccess, licenciaToEdit }) {
  const { data: conductores = [] } = ConductorActivos()
  const { register, formState: { errors }, handleSubmit, isPending: isPendingForm, watch } = useForm({ mode: 'onBlur' })
  const { mutateAsync: handlePost, isError: isErrorPost } = useLicenciaPost()
  const { mutateAsync: handlePut, isError: isErrorPut } = useLicenciaPut()
  
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
    return
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-3'>
        <label className='form-label'>Conductor:</label>
        <select
          {...register('idConductor', { required: 'El "Conductor" es requerido' })}
          className='form-control'
          defaultValue={licenciaToEdit?.conductor?.id || ''}
        >
          <option value=''>Selecciona un conductor</option>
          {conductores.map(c => (
            <option key={c.id} value={c.id}>
              {c.id}-{c.nombre} {c.apellido} {/* el usuario ve nombre completo */}
            </option>
          ))}
        </select>
        {errors.idConductor && <span className='text-danger'>{errors.idConductor.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='fechaHecho'>Fecha de hecho:</label>
        <input
          id='fechaHecho' type='date' {...register('fechaHecho', { required: 'La "Fecha de hecho" es requerida'})}
          className='form-control' placeholder='Fecha de hecho de la licencia'
          defaultValue={licenciaToEdit?.fechaHecho ? licenciaToEdit.fechaHecho.slice(0, 10): ''}
        />
        {errors.fechaHecho && <span className='text-danger'>{errors.fechaHecho.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='fechaVencimiento'>Fecha de vencimiento:</label>
        <input
          id='fechaVencimiento' type='date' {...register('fechaVencimiento', { required: 'La "Fecha de vencimiento" es requerida', 
            validate: (value) => {
                const fechaHecho = new Date(watch('fechaHecho'));
                const fechaVencimiento = new Date(value);
                return fechaVencimiento >= fechaHecho || 'La "Fecha de vencimiento" debe ser posterior o igual a la de hecho';
          }})}
          className='form-control' placeholder='Fecha de vencimiento de la licencia'
          defaultValue={licenciaToEdit?.fechaVencimiento ? licenciaToEdit.fechaVencimiento.slice(0, 10): ''}

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
