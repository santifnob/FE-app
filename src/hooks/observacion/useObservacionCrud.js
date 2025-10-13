import { useState, useEffect, useRef } from 'react'
import { useObservacionesDelete } from './useObservacionesDelete.js'
import { useObservacionesInfinite } from './useObservacionInfinite.js'
import { ObservacionGetOne } from './useObservacionQuery.js'

export function useObservacionCrud () {
  const [observaciones, setObservaciones] = useState([])
  const [showModal, setShowModal] = useState(false)
  const observacionToEdit = useRef(null) // variable para menejar si es edicion o creacion
  const { mutateAsync: deleteMutation } = useObservacionesDelete()
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useObservacionesInfinite()
  const [ascOrder, setAscOrder] = useState(false)
  const { mutateAsync: findOneMutation } = ObservacionGetOne() // find one

  useEffect(() => {
    const observaciones = data?.pages.flatMap(page => page.items) ?? []
    if (ascOrder && observaciones.length !== 0) setObservaciones(observaciones.sort((a, b) => a.id - b.id))
    else setObservaciones(observaciones)
    // logica que va a ser necesaria para hacer filtrados locales
  }, [data, ascOrder])

  const handleFilter = async (observacionId) => {
    const observacion = await findOneMutation(observacionId)
    setObservaciones([observacion])
  }

  const handleEdit = (observacion) => {
    observacionToEdit.current = observacion
    setShowModal(true)
  }

  const handleCreate = () => {
    observacionToEdit.current = null
    setShowModal(true)
  }

  const handleAscOrder = () => {
    setAscOrder(!ascOrder)
  }

  return {
    observaciones,
    showModal,
    setShowModal,
    observacionToEdit,
    deleteMutation,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    ascOrder,
    handleFilter,
    handleEdit,
    handleCreate,
    handleAscOrder
  }
}
