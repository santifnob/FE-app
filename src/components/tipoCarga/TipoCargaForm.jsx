import { useForm } from 'react-hook-form'
import { useTipoCargaPost } from '../../hooks/tipoCarga/useTipoCargaPost'
import { useTipoCargaPut } from '../../hooks/tipoCarga/useTipoCargasPut'

export function TipoCargaForm({ onSuccess, tipoCargaToEdit }) {
    const { register, formState: { errors }, handleSubmit, isPending: isPendingForm } = useForm({ mode: 'onBlur' })
    const { mutateAsync: handlePost, isError: isErrorPost } = useTipoCargaPost()
    const { mutateAsync: handlePut, isError: isErrorPut } = useTipoCargaPut() 

    const onSubmit = async(formData) =>{
        const tipoCarga = {
            name: formData.name,
            desc: formData.desc,
            estado: formData.estado,
        }

        if(tipoCargaToEdit){
            tipoCarga.id = tipoCargaToEdit.id
            await handlePut(tipoCarga)
            
            if(!isErrorPut) onSuccess()
            return
        }

        await handlePost(tipoCarga)
        
        if(!isErrorPost) onSuccess()
        return
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-1'>
                <label className='form-label' htmlFor='name'>Nombre:</label>
                <input
                id='name' type='text' {...register('name', { required: 'El "Nombre" es requerido'
                , value: tipoCargaToEdit ? tipoCargaToEdit.name : ''})}
                className='form-control' placeholder='Nombre del tipo de carga'
                />
                {errors.name && <span className='text-danger'>{errors.name.message}</span>}
            </div>

            <div className='mb-1'>
                <label className='form-label' htmlFor='desc'>Descripcion:</label>
                <input
                id='desc' type='text' {...register('desc', { required: 'La "Descripcion" es requerida'
                , value: tipoCargaToEdit ? tipoCargaToEdit.desc : ''})}
                className='form-control' placeholder='Descripcion del tipo de carga'
                />
                {errors.desc && <span className='text-danger'>{errors.desc.message}</span>}
            </div>

            <div className='mb-1'>
                <label className='form-label' htmlFor='estado'>Estado:</label>
                <select
                id='estado' {...register('estado', {
                    required: 'El "Estado" es requerido',
                    value: tipoCargaToEdit ? tipoCargaToEdit.estado : ''
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
                <button type='button' className="btn btn-secondary" onClick={onSuccess}>
                    Volver
                </button>
                
                <button type='submit' className='btn btn-success d-block mt-2' style={{ backgroundColor: '#002050ff', desc: '#fff' }}>
                {isPendingForm? 'Enviando...' : 'Enviar'}
                </button>
            </div>

            {isErrorPost && <span className='text-danger'>Error al crear el tipo de carga</span>}
            {isErrorPut && <span className='text-danger'>Error al actualizar el tipo de carga</span>}       
        </form>
    )
}