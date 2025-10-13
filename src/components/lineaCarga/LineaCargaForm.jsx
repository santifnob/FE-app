
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useLineaCargaPost } from '../../hooks/lineaCarga/useLineaCargaPost.js'
import { useLineaCargaPut } from '../../hooks/lineaCarga/useLineaCargasPut.js'
import { ViajeFindAll } from '../../hooks/viaje/useViajeQuery.js'
import { CargaActivos } from '../../hooks/carga/useCargaQuery.js'
import { LineaCargaFindAll } from '../../hooks/lineaCarga/useLineaCargaQuery.js'

export function LineaCargaForm({ onSuccess, lineaCargaToEdit }) {
  const { data: cargas = [] } = CargaActivos()
  const { data: viajes = [] } = ViajeFindAll()
  const { data: todasLasLineas = [] } = LineaCargaFindAll()

  const [yaExisteError, setYaExisteError] = useState(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    mode: 'onBlur',
    defaultValues: lineaCargaToEdit
      ? {
          estado: lineaCargaToEdit.estado,
          idViaje: lineaCargaToEdit.viaje?.id,
          idCarga: lineaCargaToEdit.carga?.id,
          cantidadVagon: lineaCargaToEdit.cantidadVagon,
        }
      : {},
  })

  const idViaje = watch('idViaje')
  const idCarga = watch('idCarga')

  useEffect(() => {
    if (!lineaCargaToEdit && idViaje && idCarga) {
      const existe = todasLasLineas.some(
        (lc) => lc.viaje?.id === Number(idViaje) && lc.carga?.id === Number(idCarga)
      )
      setYaExisteError(existe)
    } else {
      setYaExisteError(false)
    }
  }, [idViaje, idCarga, todasLasLineas, lineaCargaToEdit])

  const { mutateAsync: handlePost, isError: isErrorPost, isPending: isPendingPost } = useLineaCargaPost()
  const { mutateAsync: handlePut, isError: isErrorPut, isPending: isPendingPut } = useLineaCargaPut()

  const onSubmit = async (formData) => {
    const lineaCarga = {
      estado: formData.estado,
      idViaje: Number(formData.idViaje),
      idCarga: Number(formData.idCarga),
      cantidadVagon: Number(formData.cantidadVagon),
    }

    if (lineaCargaToEdit) {
      lineaCarga.id = lineaCargaToEdit.id
      await handlePut(lineaCarga)
      if (!isErrorPut) onSuccess()
      return
    }

    await handlePost(lineaCarga)
    if (!isErrorPost) onSuccess()
  }

  const isPendingForm = isPendingPost || isPendingPut

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-1'>
        <label>Viaje:</label>
        <select
          {...register('idViaje', { required: 'El "Viaje" es requerido' })}
          className="form-control"
        >
          <option value="">Selecciona un viaje</option>
          {viajes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}-{c.recorrido.ciudadSalida}/{c.recorrido.ciudadLlegada} (
              {c.fechaIni
                ? new Date(new Date(c.fechaIni).getTime() + 3 * 60 * 60 * 1000).toLocaleDateString('es-AR')
                : 'Sin fecha'}
              )
            </option>
          ))}
        </select>
        {errors.idViaje && <p style={{ color: 'red' }}>{errors.idViaje.message}</p>}
      </div>

      <div className='mb-1'>
        <label>Carga:</label>
        <select
          {...register('idCarga', { required: 'La "Carga" es requerida' })}
          className="form-control"
        >
          <option value="">Selecciona una carga</option>
          {cargas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.id}-{c.name}
            </option>
          ))}
        </select>
        {errors.idCarga && <p style={{ color: 'red' }}>{errors.idCarga.message}</p>}
      </div>

      <div className='mb-1'>
        <label>Cantidad de vagones:</label>
        <input
          type="text"
          {...register('cantidadVagon', {
            required: 'La "Cantidad de vagones" es requerida',
            pattern: {
              value: /^[1-9][0-9]*$/,
              message: 'La "Cantidad de vagones" debe ser un número entero mayor a 0',
            },
          })}
          className="form-control"
          placeholder="La cantidad de vagones de la carga"
          disabled={yaExisteError}
        />
        {errors.cantidadVagon && <p style={{ color: 'red' }}>{errors.cantidadVagon.message}</p>}
      </div>

      <div className='mb-1'>
        <label>Estado:</label>
        <select
          {...register('estado', { required: "El 'Estado' es requerido" })}
          className="form-control"
          disabled={yaExisteError}
        >
          <option value="">Seleccione un estado</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
        {errors.estado && <p style={{ color: 'red' }}>{errors.estado.message}</p>}
      </div>

      {yaExisteError && (
        <p style={{ color: 'red' }} className="mt-2">
          Ya existe una línea de carga con ese viaje y carga.
        </p>
      )}

      <div className="d-flex justify-content-between mt-3">
        <button type="button" className="btn btn-secondary" onClick={() => onSuccess()}>
          Volver
        </button>
        <button type="submit" className="btn btn-primary" disabled={isPendingForm || yaExisteError}>
          {isPendingForm ? 'Enviando...' : 'Enviar'}
        </button>
      </div>

      {isErrorPost && <p style={{ color: 'red' }} className="mt-2">Error al crear la línea de carga</p>}
      {isErrorPut && <p style={{ color: 'red' }} className="mt-2">Error al actualizar la línea de carga</p>}
    </form>
  )
}
