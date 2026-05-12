import { useForm, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useEstadoTrenPost } from '../../hooks/estadoTren/useEstadoTrenPost'
import { useEstadoTrenPut } from '../../hooks/estadoTren/useEstadoTrenesPut'
import { useTrenesInfinite } from '../../hooks/tren/useTrenInfinite.js'
import { EntitySelector } from '../shared/EntitySelector.jsx'
import { useFeedback } from '../../context/FeedbackContext.jsx'

export function EstadoTrenForm({ onSuccess, estadoTrenToEdit }) {
    const { data: dataTrenes, fetchNextPage: nextTrenes, hasNextPage: hasNextTrenes } = useTrenesInfinite({})
    const [trenes, setTrenes] = useState([])
    const { showFeedback } = useFeedback()
    const { register, formState: { errors }, handleSubmit, isPending: isPendingForm, control } = useForm({
        mode: 'onBlur',
        defaultValues: estadoTrenToEdit ? { idTren: estadoTrenToEdit.tren?.id } : {}
    })
    const { mutateAsync: handlePost, isError: isErrorPost } = useEstadoTrenPost()
    const { mutateAsync: handlePut, isError: isErrorPut } = useEstadoTrenPut()

    // Cargar datos de los hooks infinitos
    useEffect(() => {
        let newTrenes = dataTrenes?.pages.flatMap(p => p.items) ?? []

        // Prepend selected entity for editing to ensure it is available in selector
        if (estadoTrenToEdit && estadoTrenToEdit.tren && !newTrenes.find(t => t.id === estadoTrenToEdit.tren.id)) {
            newTrenes = [estadoTrenToEdit.tren, ...newTrenes]
        }

        setTrenes(newTrenes)
    }, [dataTrenes, estadoTrenToEdit])

    const onSubmit = async (formData) => {
        const estadoTren = {
            nombre: formData.nombre,
            fechaVigencia: formData.fechaVigencia,
            estado: formData.estado,
            idTren: Number(formData.idTren),
        }

        try {
            if (estadoTrenToEdit) {
                estadoTren.id = estadoTrenToEdit.id
                await handlePut(estadoTren)
                showFeedback('success', 'Estado actualizado', 'El estado del tren se actualizó correctamente.')
                onSuccess()
                return
            }

            await handlePost(estadoTren)
            showFeedback('success', 'Estado creado', 'El estado del tren se creó correctamente.')
            onSuccess()
        } catch (error) {
            console.error(error)
            showFeedback('danger', 'Error', 'No se pudo guardar el estado del tren. Intenta de nuevo.')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            {/* Trenes */}
            <div className='mb-3'>
                <label className='form-label'>Trenes:</label>
                <Controller
                    name='idTren'
                    control={control}
                    rules={{ required: 'El tren es requerido' }}
                    render={({ field }) => (
                        <EntitySelector value={field.value} onChange={field.onChange} entityList={trenes} fetchNextPage={nextTrenes} hasNextPage={hasNextTrenes} entityName="tren" />
                    )}
                />
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
                    type='datetime-local'
                    className='form-control'
                    {...register('fechaVigencia', { required: 'La fecha de vigencia es requerida' })}
                    defaultValue={estadoTrenToEdit?.fechaVigencia ? new Date(estadoTrenToEdit.fechaVigencia).toISOString().slice(0, 16) : ''}
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
                <button type='button' className='btn btn-secondary' onClick={onSuccess}>
                    Volver
                </button>

                <button type='submit' className='btn btn-success d-block mt-2' style={{ backgroundColor: '#002050ff', desc: '#fff' }}>
                    {isPendingForm ? 'Enviando...' : 'Enviar'}
                </button>
            </div>

            {isErrorPost && <span className='text-danger'>Error al crear el estado del tren</span>}
            {isErrorPut && <span className='text-danger'>Error al actualizar el estado del tren</span>}
        </form>
    )
}
