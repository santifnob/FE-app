import { useState, useEffect, useRef } from 'react'
import { useConductoresDelete } from './useConductorDelete.js'
import { useConductoresInfinite } from './useConductorInfinite.js'
import { ConductorGetOne } from './useConductorQuery.js'

export function useConductorCrud() {
  const [conductores, setConductores] = useState([])
  const [showModal, setShowModal] = useState(false)
  const conductorToEdit = useRef(null) // para manejar si es edición o creación
  const { mutateAsync: deleteMutation } = useConductoresDelete()
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error, isFetchingNextPage } = useConductoresInfinite({filterColumn: undefined, filterValue: undefined})
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
    // safe wrapper: prevents calling fetchNextPage when a fetch is already in progress
    fetchNextPage: async () => {
      try {
        if (isFetchingNextPage) return
        if (!hasNextPage) return
        await fetchNextPage()
      } catch (err) {
        console.error('Error fetching next page', err)
      }
    },
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
