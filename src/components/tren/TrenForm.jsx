import { useForm } from 'react-hook-form'
import { useFeedback } from '../../context/FeedbackContext.jsx'
import { useTrenPost } from '../../hooks/tren/useTrenPost'
import { useTrenPut } from '../../hooks/tren/useTrenesPut'

export function TrenForm({ onSuccess, trenToEdit }) {
    const { showFeedback } = useFeedback()
    const {
        register,
        formState: { errors },
        handleSubmit,
        isPending: isPendingForm
    } = useForm({ mode: 'onBlur' })
    const { mutateAsync: handlePost, isError: isErrorPost } = useTrenPost()
    const { mutateAsync: handlePut, isError: isErrorPut } = useTrenPut()

    const onSubmit = async (formData) => {
        const tren = {
            modelo: formData.modelo,
            color: formData.color
        }

        try {
            if (trenToEdit) {
                tren.id = trenToEdit.id
                await handlePut(tren)
                showFeedback('success', 'Tren actualizado', 'El tren se actualizó correctamente.')
            } else {
                await handlePost(tren)
                showFeedback('success', 'Tren creado', 'El tren se creó correctamente.')
            }

            onSuccess()
        } catch (error) {
            showFeedback(
                'danger',
                'Error',
                `No se pudo ${trenToEdit ? 'actualizar' : 'crear'} el tren. Intenta nuevamente.`
            )
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-1'>
                <label className='form-label' htmlFor='modelo'>Modelo:</label>
                <input
                    id='modelo'
                    type='text'
                    {...register('modelo', {
                        required: 'El "Modelo" es requerido',
                        value: trenToEdit ? trenToEdit.modelo : ''
                    })}
                    className='form-control'
                    placeholder='Modelo del tren'
                />
                {errors.modelo && <span className='text-danger'>{errors.modelo.message}</span>}
            </div>

            <div className='mb-1'>
                <label className='form-label' htmlFor='color'>Color:</label>
                <input
                    id='color'
                    type='text'
                    {...register('color', {
                        required: 'El "Color" es requerido',
                        value: trenToEdit ? trenToEdit.color : ''
                    })}
                    className='form-control'
                    placeholder='Color del tren'
                />
                {errors.color && <span className='text-danger'>{errors.color.message}</span>}
            </div>

            <div className='d-flex justify-content-between'>
                <button type='button' className='btn btn-secondary' onClick={onSuccess}>
                    Volver
                </button>

                <button
                    type='submit'
                    className='btn btn-success d-block mt-2'
                    style={{ backgroundColor: '#002050ff', color: '#fff' }}
                >
                    {isPendingForm ? 'Enviando...' : 'Enviar'}
                </button>
            </div>

            {isErrorPost && <span className='text-danger'>Error al crear el tren</span>}
            {isErrorPut && <span className='text-danger'>Error al actualizar el tren</span>}
        </form>
    )
}
