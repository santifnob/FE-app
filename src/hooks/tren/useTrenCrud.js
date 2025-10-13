import { useState, useEffect, useRef } from "react"
import { useTrenesDelete } from "./useTrenesDelete.js"
import { useTrenesInfinite } from "./useTrenInfinite.js"
import { TrenGetOne } from "./useTrenQuery.js"

export function useTrenCrud() {
  const [trenes, setTrenes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const trenToEdit = useRef(null) // variable para menejar si es edicion o creacion
  const { mutateAsync: deleteMutation } = useTrenesDelete()
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useTrenesInfinite()
  const [ascOrder, setAscOrder] = useState(false);
  const { mutateAsync: findOneMutation} = TrenGetOne() // find one 
  
  useEffect(() => {
    const trenes = data?.pages.flatMap(page => page.items) ?? []
    if(ascOrder && trenes.length != 0) setTrenes(trenes.sort((a, b) => a.id - b.id));
    else setTrenes(trenes)
    // logica que va a ser necesaria para hacer filtrados locales
  }, [data, ascOrder])

  const handleFilter = async (trenId) => {
    const tren = await findOneMutation(trenId)
    setTrenes([tren])

  }

  const handleEdit = (tren) => {
    trenToEdit.current = tren
    setShowModal(true)
  }

  const handleCreate = () => {
    trenToEdit.current = null
    setShowModal(true)
  }

  const handleAscOrder = () => {
    setAscOrder(!ascOrder)
  }

  return {
    trenes,
    showModal,
    setShowModal,
    trenToEdit,
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