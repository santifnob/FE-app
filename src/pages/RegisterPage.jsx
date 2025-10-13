import RailTrackerLogo from '../assets/RailTrackerImages/RailTrackerLogoRecorted.png'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useRegisterMutation } from '../hooks/useRegisterMutation.js'

export function RegisterPage () {
  const { register, formState: { errors }, handleSubmit } = useForm({ mode: 'onBlur' })
  const navigate = useNavigate()
  const { isError, mutateAsync: registerMutation, isPending } = useRegisterMutation()

  const onSubmit = async (formData) => {
    try {
    // Mapeo de los nombres al formato que espera el backend
      const conductorData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        estado: 'Pendiente' // Le falta la validacion por parte del admin
      }

      // const res = await fetch('http://localhost:3000/api/conductor', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(conductorData)
      // })

      // if (!res.ok) {
      //   const data = await res.json()
      //   throw new Error(data.error || 'Error en el registro')
      // }

      await registerMutation(conductorData)
      console.log(isError)
      if (isError) {
        throw new Error('Error en el registro')
      }

      alert('Cuenta creada con éxito')
      navigate('/')
    } catch (error) {
      alert('Hubo un problema con el registro')
      console.error(error)
    }
  }

  return (
    <div className='container d-flex justify-content-center align-items-center min-vh-100'>
      <div className='card p-4' style={{ maxWidth: '400px', width: '100%' }}>
        <div className='mb-4 text-center d-flex align-items-center justify-content-center gap-2' style={{ textTransform: 'none' }}>
          <img
            src={RailTrackerLogo}
            alt='Ferrocarril Icono'
            onClick={() => navigate('/')}
            style={{ width: '60px', height: '60px', marginRight: '8px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>Registrarse</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-1'>
            <label className='form-label' htmlFor='nombre'>Nombre:</label>
            <input
              id='nombre' type='text' {...register('nombre', {
                required: 'El nombre es requerido'
                // pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: 'Solo se permiten letras y espacios' }
              })}
              className='form-control' placeholder='Ej: Juan'
            />
            {errors.nombre && <span className='text-danger'>{errors.nombre.message}</span>}
          </div>

          <div className='mb-1'>
            <label className='form-label' htmlFor='apellido'>Apellido:</label>
            <input
              id='apellido' type='text' {...register('apellido', {
                required: 'El apellido es requerido'
                // pattern: { value: /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, message: 'Solo se permiten letras y espacios' }
              })}
              className='form-control' placeholder='Ej: Pérez'
            />
            {errors.apellido && <span className='text-danger'>{errors.apellido.message}</span>}
          </div>

          <div className='mb-1'>
            <label htmlFor='email' className='form-label'>Correo electrónico:</label>
            <input
              id='email' type='email' {...register('email', {
                required: 'El email es requerido',
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Correo electrónico inválido' }
              })}
              className='form-control' placeholder='Ej: algo@otroalgo.com'
            />
            {errors.email && <span className='text-danger'>{errors.email.message}</span>}
          </div>

          <div className='mb-2'>
            <label htmlFor='password' className='form-label'>Contraseña:</label>
            <input
              type='password'
              id='password'
              {...register('password', {
                required: 'La contraseña es requerida'
                // pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y un símbolo" }
              })}
              className='form-control'
              placeholder='Contraseña'
            />
            {errors.password && <span className='text-danger'>{errors.password.message}</span>}
          </div>

          <div className='mb-2'>
            <label htmlFor='repeatPassword' className='form-label'>Repetir Contraseña:</label>
            <input
              type='password'
              id='repeatPassword'
              {...register('repeatPassword', {
                required: 'Debe repetir la contraseña',
                validate: (value, { password }) => value === password || 'Las contraseñas no coinciden'
              })}
              className='form-control'
              placeholder='Repetir contraseña'
            />
            {errors.repeatPassword && <span className='text-danger'>{errors.repeatPassword.message}</span>}
          </div>

          <div className='d-flex justify-content-between'>
            <button type='button' className='btn btn-secondary' onClick={() => navigate('/')}>
              Volver
            </button>
            <button type='submit' className='btn btn-success' style={{ backgroundColor: '#002050ff', color: '#fff' }}>
              {isPending ? 'Enviando...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
