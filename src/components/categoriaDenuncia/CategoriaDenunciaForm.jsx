import { useForm } from 'react-hook-form'
import { useCategoriaDenunciaPost } from '../../hooks/categoriaDenuncia/useCategoriaDenunciaPost'
import { useCategoriaDenunciaPut } from '../../hooks/categoriaDenuncia/useCategoriaDenunciasPut'

export function CategoriaDenunciaForm({ onSuccess, categoriaDenunciaToEdit }) {
    const { register, formState: { errors }, handleSubmit, isPending: isPendingForm } = useForm({ mode: 'onBlur' })
    const { mutateAsync: handlePost, isError: isErrorPost } = useCategoriaDenunciaPost()
    const { mutateAsync: handlePut, isError: isErrorPut } = useCategoriaDenunciaPut() 

    const onSubmit = async(formData) =>{
        const categoriaDenuncia = {
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            estado: formData.estado,
        }

        if(categoriaDenunciaToEdit){
            categoriaDenuncia.id = categoriaDenunciaToEdit.id
            await handlePut(categoriaDenuncia)
            
            if(!isErrorPut) onSuccess()
            return
        }

        await handlePost(categoriaDenuncia)
        
        if(!isErrorPost) onSuccess()
        return
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-1'>
                <label className='form-label' htmlFor='titulo'>Titulo:</label>
                <input
                id='titulo' type='text' {...register('titulo', { required: 'El "Titulo" es requerido'
                , value: categoriaDenunciaToEdit ? categoriaDenunciaToEdit.titulo : ''})}
                className='form-control' placeholder='Titulo de la categoria denuncia'
                />
                {errors.titulo && <span className='text-danger'>{errors.titulo.message}</span>}
            </div>

            <div className='mb-1'>
                <label className='form-label' htmlFor='descripcion'>Descripcion:</label>
                <input
                id='descripcion' type='text' {...register('descripcion', { required: 'La "Descripcion" es requerida'
                , value: categoriaDenunciaToEdit ? categoriaDenunciaToEdit.descripcion : ''})}
                className='form-control' placeholder='Descripcion de la categoria denuncia'
                />
                {errors.descripcion && <span className='text-danger'>{errors.descripcion.message}</span>}
            </div>

            <div className='mb-1'>
                <label className='form-label' htmlFor='estado'>Estado:</label>
                <select
                id='estado' {...register('estado', {
                    required: 'El "Estado" es requerido',
                    value: categoriaDenunciaToEdit ? categoriaDenunciaToEdit.estado : ''
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

            {isErrorPost && <span className='text-danger'>Error al crear la categoriaDenuncia</span>}
            {isErrorPut && <span className='text-danger'>Error al actualizar la categoriaDenuncia</span>}       
        </form>
    )
}