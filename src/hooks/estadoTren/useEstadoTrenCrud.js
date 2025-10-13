import { useState, useEffect, useRef } from "react"
import { useEstadoTrenesDelete } from "./useEstadoTrenesDelete.js"
import { useEstadoTrenesInfinite } from "./useEstadoTrenInfinite.js"
import { EstadoTrenGetOne } from "./useEstadoTrenQuery.js"

export function useEstadoTrenCrud() {
  const [estadoTrenes, setEstadoTrenes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const estadoTrenToEdit = useRef(null) // variable para menejar si es edicion o creacion
  const { mutateAsync: deleteMutation } = useEstadoTrenesDelete()
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useEstadoTrenesInfinite()
  const [ascOrder, setAscOrder] = useState(false);
  const { mutateAsync: findOneMutation} = EstadoTrenGetOne() // find one 
  
  useEffect(() => {
    const estadoTrenes = data?.pages.flatMap(page => page.items) ?? []
    if(ascOrder && estadoTrenes.length != 0) setEstadoTrenes(estadoTrenes.sort((a, b) => a.id - b.id));
    else setEstadoTrenes(estadoTrenes)
    // logica que va a ser necesaria para hacer filtrados locales
  }, [data, ascOrder])

  const handleFilter = async (estadoTrenId) => {
    const estadoTren = await findOneMutation(estadoTrenId)
    setEstadoTrenes([estadoTren])

  }

  const handleEdit = (estadoTren) => {
    estadoTrenToEdit.current = estadoTren
    setShowModal(true)
  }

  const handleCreate = () => {
    estadoTrenToEdit.current = null
    setShowModal(true)
  }

  const handleAscOrder = () => {
    setAscOrder(!ascOrder)
  }

  return {
    estadoTrenes,
    showModal,
    setShowModal,
    estadoTrenToEdit,
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