import { useForm } from 'react-hook-form'
import { useRecorridoPost } from '../../hooks/recorrido/useRecorridoPost'
import { useRecorridoPut } from '../../hooks/recorrido/useRecorridosPut'

export function RecorridoForm({ onSuccess, recorridoToEdit }) {
    const { register, formState: { errors }, handleSubmit, isPending: isPendingForm } = useForm({ mode: 'onBlur' })
    const { mutateAsync: handlePost, isError: isErrorPost } = useRecorridoPost()
    const { mutateAsync: handlePut, isError: isErrorPut } = useRecorridoPut() 

    const onSubmit = async(formData) =>{
        const recorrido = {
            ciudadSalida: formData.ciudadSalida,
            ciudadLlegada: formData.ciudadLlegada,
            totalKm: formData.totalKm,
            estado: formData.estado
        }

        if(recorridoToEdit){
            recorrido.id = recorridoToEdit.id
            await handlePut(recorrido)
            
            if(!isErrorPut) onSuccess()
            return
        }

        await handlePost(recorrido)
        
        if(!isErrorPost) onSuccess()
        return
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-1'>
                <label className='form-label' htmlFor='ciudadSalida'>Ciudad Salida:</label>
                <input
                id='ciudadSalida' type='text' {...register('ciudadSalida', { required: 'La "Ciudad de salida" es requerida'
                , value: recorridoToEdit ? recorridoToEdit.ciudadSalida : ''})}
                className='form-control' placeholder='Ciudad de salida del recorrido'
                />
                {errors.ciudadSalida && <span className='text-danger'>{errors.ciudadSalida.message}</span>}
            </div>

            <div className='mb-1'>
                <label className='form-label' htmlFor='ciudadLlegada'>Ciudad Llegada:</label>
                <input
                id='ciudadLlegada' type='text' {...register('ciudadLlegada', { required: 'La "Ciudad de llegada" es requerida'
                , value: recorridoToEdit ? recorridoToEdit.ciudadLlegada : ''})}
                className='form-control' placeholder='Ciudad de llegada del recorrido'
                />
                {errors.ciudadLlegada && <span className='text-danger'>{errors.ciudadLlegada.message}</span>}
            </div>

            
            <div className='mb-1'>
            <label className='form-label' htmlFor='totalKm'>
                Total de Km: 
            </label>
            <input
                id='totalKm'
                type='text'
                defaultValue={recorridoToEdit?.totalKm || ''}
                {...register('totalKm', {
                required: 'El total de KM es requerido',
                validate: (value) =>
                    /^\d+$/.test(value) || 'Solo se permite número enteros'
                })}
                className='form-control'
                placeholder='Total de Km del recorrido'
            />
            {errors.totalKm && (
                <span className='text-danger'>{errors.totalKm.message}</span>
            )}
            </div>

            <div className='mb-1'>
                <label className='form-label' htmlFor='estado'>Estado:</label>
                <select
                id='estado' {...register('estado', {
                    required: 'El "Estado" es requerido',
                    value: recorridoToEdit ? recorridoToEdit.estado : '',
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
                
                <button type='submit' className='btn btn-success d-block mt-2' style={{ backgroundColor: '#002050ff', ciudadLlegada: '#fff' }}>
                {isPendingForm? 'Enviando...' : 'Enviar'}
                </button>
            </div>

            {isErrorPost && <span className='text-danger'>Error al crear el recorrido</span>}
            {isErrorPut && <span className='text-danger'>Error al actualizar el recorrido</span>}       
        </form>
    )
}