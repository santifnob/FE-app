import RailTrackerLogo from '../assets/RailTrackerImages/RailTrackerLogoRecorted.png'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'

export function LoginPage () {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: 'onBlur' })
  const { setUser, isLoginError, login } = useContext(AuthContext)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const userToSet = await login({ email: data.email, password: data.password })
      console.log(userToSet)
      setUser(userToSet) // si uso directamente el estado user, no llega a cargar ya que los estados se manejan de manera asincrona, por lo que uso el user devuelto por la API
      switch (userToSet.role) {
        case 'admin': navigate('/admin/dashboard'); break
        case 'conductor': navigate('/conductor/dashboard'); break
        default: console.error('Rol no conocido') // nunca debería llegar a pasar
      }
    } catch (error) {
      console.error('Error during login:', error.response.data.message)
      throw error
    }
  }

  const buttonClass = 'btn w-100 my-2 ' + (isSubmitting ? 'btn-info' : 'btn-success')

  return (
    <div className='bg-light d-flex justify-content-center align-items-center vh-100'>

      <div className='card shadow-sm py-3' style={{ width: '430px' }}>

        <p className='h1 card-title text-center mt-4 text-dark-emphasis'>
          <img src={RailTrackerLogo} className='me-3' style={{ width: '60px', height: '60px' }} />
          Mi Ferrocarril
        </p>

        <div className='card-body mx-4'>

          <form onSubmit={handleSubmit(onSubmit)}>

            <div className=''>
              <label htmlFor='correo' className='form-label'>Correo electrónico</label>
              <input
                id='correo' {...register('email', {
                  required: 'El email es requerido',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Correo electrónico inválido'
                  }
                })
          } className='form-control' placeholder='Correo electrónico'
              />
            </div>
            {errors.email && <span className='text-danger'>{errors.email.message}</span>}

            <div className='my-3'>
              <label htmlFor='password' className='form-label'>Contraseña</label>
              <input
                type='password' id='password' {...register('password', {
                  required: 'La contraseña es requerida' // pattern: {
                // value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                // message: "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y un símbolo"}
                })} className='form-control' placeholder='Contraseña'
              />
              {errors.password && <span className='text-danger'>{errors.password.message}</span>}
            </div>

            <button type='submit' className={buttonClass} style={{ backgroundColor: '#002050ff', color: '#fff' }}>
              {isSubmitting ? 'Enviando..' : 'INICIAR SESIÓN'}
            </button>

            {isLoginError && <span className='text-danger mt-1'>Los datos son erroneos o la cuenta no esta activa. Volver a intentar</span>}

          </form>

          <div className='text-center mt-3'>
            ¿Quieres ser conductor? <a onClick={() => navigate('/register')} className='fw-bold link-underline text-info'>Registrate</a>
          </div>

          <div className='text-center mt-4 pt-3 border-top'>
            <p className='mb-2'>Continuar con</p>
            <div className='d-flex justify-content-center gap-3'>
              <img
                src='https://img.icons8.com/color/48/google-logo.png' alt='Google' onClick={() => navigate('/pagina-en-construccion')}
                style={{ width: '35px', height: '35px', cursor: 'pointer' }}
              />
              <img
                src='https://img.icons8.com/color/48/facebook-new.png' alt='Facebook' onClick={() => navigate('/pagina-en-construccion')}
                style={{ width: '35px', height: '35px', cursor: 'pointer' }} className='mx-2'
              />
              <img
                src='https://img.icons8.com/ios-filled/50/mac-os.png' alt='Apple' onClick={() => navigate('/pagina-en-construccion')}
                style={{ width: '35px', height: '35px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
