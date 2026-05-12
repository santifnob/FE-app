import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useCargaPost } from '../../hooks/carga/useCargaPost'
import { useCargaPut } from '../../hooks/carga/useCargasPut'
import { useTipoCargasInfinite } from '../../hooks/tipoCarga/useTipoCargaInfinite.js'
import { EntitySelector } from '../shared/EntitySelector.jsx'
import { useFeedback } from '../../context/FeedbackContext.jsx'

export function CargaForm ({ onSuccess, cargaToEdit }) {
  const { data: dataTipoCargas, fetchNextPage: nextTipoCargas, hasNextPage: hasNextTipoCargas } = useTipoCargasInfinite({ filters: { estado: 'Activo' } })
  const [tipoCargas, setTipoCargas] = useState([])
  const { showFeedback } = useFeedback()
  const { register, formState: { errors, isSubmitting: isPendingForm }, handleSubmit, reset, control } = useForm({
    mode: 'onBlur',
    defaultValues: { name: '', precio: '', estado: '', idTipoCarga: '' }
  })
  const { mutateAsync: handlePost, isError: isErrorPost } = useCargaPost()
  const { mutateAsync: handlePut, isError: isErrorPut } = useCargaPut()

  // Cargar datos de los hooks infinitos
  useEffect(() => {
    let newTipoCargas = dataTipoCargas?.pages.flatMap(p => p.items) ?? []

    // Prepend selected entity for editing to ensure it is available in selector
    if (cargaToEdit && cargaToEdit.tipoCarga && !newTipoCargas.find(tc => tc.id === cargaToEdit.tipoCarga.id)) {
      newTipoCargas = [cargaToEdit.tipoCarga, ...newTipoCargas]
    }

    setTipoCargas(newTipoCargas)
  }, [dataTipoCargas, cargaToEdit])

  // Precarga de valores cuando estamos editando (se mantiene de tu implementación actual)
  useEffect(() => {
    if (cargaToEdit) {
      reset({
        name: cargaToEdit.name ?? '',
        precio: String(cargaToEdit.precio ?? ''),
        estado: cargaToEdit.estado ?? '',
        idTipoCarga: cargaToEdit.tipoCarga?.id ?? ''
      })
    }
  }, [cargaToEdit, reset])

  const onSubmit = async (formData) => {
    const payload = {
      name: formData.name,
      precio: formData.precio,
      estado: formData.estado,
      idTipoCarga: Number(formData.idTipoCarga)
    }

    // Solo enviar idTipoCarga si se eligió uno
    if (formData.idTipoCarga !== '') {
      payload.idTipoCarga = Number(formData.idTipoCarga)
    }

    try {
      if (cargaToEdit) {
        payload.id = cargaToEdit.id
        await handlePut(payload)
        showFeedback('success', 'Carga actualizada', 'La carga se actualizó correctamente.')
        onSuccess?.()
        return
      }

      await handlePost(payload)
      showFeedback('success', 'Carga creada', 'La carga se creó correctamente.')
      onSuccess?.()
    } catch (error) {
      console.error(error)
      showFeedback('danger', 'Error', 'No se pudo guardar la carga. Revisa los datos e intenta de nuevo.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Tipo de Carga */}
      <div className='mb-3'>
        <label className='form-label'>Tipo de Carga:</label>
        <Controller
          name='idTipoCarga'
          control={control}
          rules={{ required: 'El "Tipo de Carga" es requerido' }}
          render={({ field }) => (
            <EntitySelector value={field.value} onChange={field.onChange} entityList={tipoCargas} fetchNextPage={nextTipoCargas} hasNextPage={hasNextTipoCargas} entityName='tipoCarga' />
          )}
        />
        {errors.idTipoCarga && <span className='text-danger'>{errors.idTipoCarga.message}</span>}
      </div>
      {/* Nombre */}
      <div className='mb-1'>
        <label className='form-label' htmlFor='name'>Nombre:</label>
        <input
          id='name' type='text' {...register('name', {
            required: 'El "Nombre" es requerido',
            value: cargaToEdit ? cargaToEdit.name : ''
          })}
          className='form-control' placeholder='Nombre de la carga'
        />
        {errors.name && <span className='text-danger'>{errors.name.message}</span>}
      </div>

      {/* Precio */}
      <div className='mb-1'>
        <label className='form-label' htmlFor='precio'>Precio:</label>
        <input
          {...register('precio', {
            required: 'El "Precio" es obligatorio',
            validate: (value) => {
              // Reemplazamos coma por punto para validar decimales
              const normalized = value.replace(',', '.')
              const num = parseFloat(normalized)

              return !isNaN(num) && num > 0
                ? true
                : 'Tiene que ser un número mayor a 0'
            }
          })}
          className='form-control'
          placeholder='Precio de la carga'
        />
        {errors.precio && (
          <span className='text-danger'>{errors.precio.message}</span>
        )}
      </div>

      {/* Estado */}
      <div className='mb-1'>
        <label className='form-label' htmlFor='estado'>Estado:</label>
        <select
          id='estado' {...register('estado', {
            required: 'El estado es requerido',
            value: cargaToEdit ? cargaToEdit.estado : ''
          })}
          className='form-select'
        >
          <option value=''>Seleccione un estado</option>
          <option value='Activo'>Activo</option>
          <option value='Inactivo'>Inactivo</option>
        </select>
        {errors.estado && <span className='text-danger'>{errors.estado.message}</span>}
      </div>

      {/* Acciones */}
      <div className='d-flex justify-content-between'>
        <button type='button' className='btn btn-secondary' onClick={onSuccess}>
          Volver
        </button>

        <button type='submit' className='btn btn-success d-block mt-2' style={{ backgroundColor: '#002050ff', desc: '#fff' }}>
          {isPendingForm ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {isErrorPost && <span className='text-danger'>Error al crear el tipoCarga</span>}
      {isErrorPut && <span className='text-danger'>Error al actualizar el tipoCarga</span>}
    </form>
  )
}
