import { useForm } from 'react-hook-form'
import { useEstadoTrenPost } from '../../hooks/estadoTren/useEstadoTrenPost'
import { useEstadoTrenPut } from '../../hooks/estadoTren/useEstadoTrenesPut'
import { TrenFindAll } from '../../hooks/tren/useTrenQuery.js'

export function EstadoTrenForm({ onSuccess, estadoTrenToEdit }) {
    const { register, formState: { errors }, handleSubmit, isPending: isPendingForm } = useForm({ mode: 'onBlur' })
    const { mutateAsync: handlePost, isError: isErrorPost } = useEstadoTrenPost()
    const { mutateAsync: handlePut, isError: isErrorPut } = useEstadoTrenPut() 
    const { data: trenes = [] } = TrenFindAll()

    const onSubmit = async(formData) =>{
        const estadoTren = {
            nombre: formData.nombre,
            fechaVigencia: formData.fechaVigencia,
            estado: formData.estado,
            idTren: Number(formData.idTren),
        }

        if(estadoTrenToEdit){
            estadoTren.id = estadoTrenToEdit.id
            await handlePut(estadoTren)
            if(!isErrorPut) onSuccess()
            return
        }

        await handlePost(estadoTren)
        
        if(!isErrorPost) onSuccess()
        return
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* Trenes */}
            <div className='mb-3'>
                <label className='form-label'>Trenes:</label>
                <select
                {...register('idTren', { required: 'El tren es requerido' })}
                className='form-control'
                defaultValue={estadoTrenToEdit?.tren || ''}
                >
                
                <option value="">Selecciona un tren</option>
                {trenes.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.id}-{c.modelo} (color: {c.color})
                    </option>

                ))}
                </select>
                {errors.idTren && <span className='text-danger'>{errors.idTren.message}</span>}
            </div>
            
            <div className='mb-1'>
            <label className='form-label' htmlFor='nombre'>Nombre:</label>

            <select
                id='nombre'
                className='form-select'
                {...register('nombre', { required: 'El estado del tren es requerido' })}
                defaultValue={estadoTrenToEdit ? estadoTrenToEdit.nombre : ''}
            >
                <option value=''>Selecciona un estado…</option>
                <option value='En reparacion'>En reparación</option>
                <option value='Obsoleto'>Obsoleto</option>
                <option value='Disponible'>Disponible</option>
            </select>

            {errors.nombre && <span className='text-danger'>{errors.nombre.message}</span>}
            </div>


            
            <div className='mb-1'>
            <label className='form-label' htmlFor='fechaVigencia'>Fecha de vigencia:</label>

            <input
                id='fechaVigencia'
                type='date'
                className='form-control'
                {...register('fechaVigencia', { required: 'La fecha de vigencia es requerida' })}
                defaultValue={estadoTrenToEdit?.fechaVigencia ? estadoTrenToEdit.fechaVigencia.slice(0, 10): ''}
                placeholder='Selecciona una fecha'
            />

            {errors.fechaVigencia && (
                <span className='text-danger'>{errors.fechaVigencia.message}</span>
            )}
            </div>

            <div className='mb-1'>
                <label className='form-label' htmlFor='estado'>Estado:</label>
                <select
                id='estado' {...register('estado', {
                    required: 'El estado es requerido',
                    value: estadoTrenToEdit ? estadoTrenToEdit.estado : ''
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

            {isErrorPost && <span className='text-danger'>Error al crear el estado del tren</span>}
            {isErrorPut && <span className='text-danger'>Error al actualizar el estado del tren</span>}       
        </form>
    )
}