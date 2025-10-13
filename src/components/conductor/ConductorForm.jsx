import { useForm } from 'react-hook-form'
import { useConductorPost } from '../../hooks/conductor/useConductorPost'
import { useConductorPut } from '../../hooks/conductor/useConductorPut'

export function ConductorForm ({ onSuccess, conductorToEdit }) {
  const { register, formState: { errors }, handleSubmit, isPending: isPendingForm } = useForm({ mode: 'onBlur' })
  const { mutateAsync: handlePost, isError: isErrorPost } = useConductorPost()
  const { mutateAsync: handlePut, isError: isErrorPut } = useConductorPut()

  const onSubmit = async (formData) => {
    const conductor = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      password: formData.password,
      estado: formData.estado
    }

    if (conductorToEdit) {
      conductor.id = conductorToEdit.id
      await handlePut(conductor)

      if (!isErrorPut) onSuccess()
      return
    }

    await handlePost(conductor)

    if (!isErrorPost) onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-1'>
        <label className='form-label' htmlFor='nombre'>Nombre:</label>
        <input
          id='nombre' type='text' {...register('nombre', {
            required: 'El "Nombre" es requerido',
            value: conductorToEdit ? conductorToEdit.nombre : ''
          })}
          className='form-control' placeholder='Nombre del conductor'
        />
        {errors.nombre && <span className='text-danger'>{errors.nombre.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='apellido'>Apellido:</label>
        <input
          id='apellido' type='text' {...register('apellido', {
            required: 'El "Apellido" es requerido',
            value: conductorToEdit ? conductorToEdit.apellido : ''
          })}
          className='form-control' placeholder='Apellido del conductor'
        />
        {errors.apellido && <span className='text-danger'>{errors.apellido.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='email'>Email:</label>
        <input
          id='email' type='email' {...register('email', {
            required: 'El "Email" es requerido',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'El formato del "Email" es incorrecto'
            },
            value: conductorToEdit ? conductorToEdit.email : ''
          })}
          className='form-control' placeholder='Email del conductor'
        />
        {errors.email && <span className='text-danger'>{errors.email.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='password'>Contraseña:</label>
        <input
          id='password' type='password' {...register('password', {
            required: 'La "Contraseña" es requerida',
            // minLength: { value: 8, message: 'El password debe tener al menos 8 caracteres' },
            value: conductorToEdit ? conductorToEdit.password : ''
          })}
          className='form-control' placeholder='Contraseña del conductor'
        />
        {errors.password && <span className='text-danger'>{errors.password.message}</span>}
      </div>

      <div className='mb-1'>
        <label className='form-label' htmlFor='estado'>Estado:</label>
        <select
          id='estado' {...register('estado', {
            required: 'El "Estado" es requerido',
            value: conductorToEdit ? conductorToEdit.estado : ''
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

      {isErrorPost && <span className='text-danger'>Error al crear el conductor</span>}
      {isErrorPut && <span className='text-danger'>Error al actualizar el conductor</span>}
    </form>
  )
}
