import { useState, useEffect, useRef } from 'react'
import { useConductoresDelete } from './useConductorDelete.js'
import { useConductoresInfinite } from './useConductorInfinite.js'
import { ConductorGetOne } from './useConductorQuery.js'

export function useConductorCrud () {
  const [conductores, setConductores] = useState([])
  const [showModal, setShowModal] = useState(false)
  const conductorToEdit = useRef(null) // para manejar si es edición o creación
  const { mutateAsync: deleteMutation } = useConductoresDelete()
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useConductoresInfinite()
  const [ascOrder, setAscOrder] = useState(false)
  const { mutateAsync: findOneMutation } = ConductorGetOne() // find one conductor

  useEffect(() => {
    const conductores = data?.pages.flatMap(page => page.items) ?? []
    if (ascOrder && conductores.length !== 0) setConductores(conductores.sort((a, b) => a.id - b.id))
    else setConductores(conductores)
  }, [data, ascOrder])

  const handleFilter = async (conductorId) => {
    const conductor = await findOneMutation(conductorId)
    setConductores([conductor])
  }

  const handleEdit = (conductor) => {
    conductorToEdit.current = conductor
    setShowModal(true)
  }

  const handleCreate = () => {
    conductorToEdit.current = null
    setShowModal(true)
  }

  const handleAscOrder = () => {
    setAscOrder(!ascOrder)
  }

  return {
    conductores,
    showModal,
    setShowModal,
    conductorToEdit,
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
