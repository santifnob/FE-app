import { useState, useEffect, useRef } from "react"
import { useRecorridosDelete } from "./useRecorridosDelete.js"
import { useRecorridosInfinite } from "./useRecorridoInfinite.js"
import { RecorridoGetOne } from "./useRecorridoQuery.js"


export function useRecorridoCrud() {
  const [recorridos, setRecorridos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const recorridoToEdit = useRef(null) // variable para menejar si es edicion o creacion
  const { mutateAsync: deleteMutation } = useRecorridosDelete()
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useRecorridosInfinite()
  const [ascOrder, setAscOrder] = useState(false);
  const { mutateAsync: findOneMutation} = RecorridoGetOne() // find one 
  
  useEffect(() => {
    const recorridos = data?.pages.flatMap(page => page.items) ?? []
    if(ascOrder && recorridos.length != 0) setRecorridos(recorridos.sort((a, b) => a.id - b.id));
    else setRecorridos(recorridos)
    // logica que va a ser necesaria para hacer filtrados locales
  }, [data, ascOrder])

  const handleFilter = async (recorridoId) => {
    const recorrido = await findOneMutation(recorridoId)
    setRecorridos([recorrido])

  }

  const handleEdit = (recorrido) => {
    recorridoToEdit.current = recorrido
    setShowModal(true)
  }

  const handleCreate = () => {
    recorridoToEdit.current = null
    setShowModal(true)
  }

  const handleAscOrder = () => {
    setAscOrder(!ascOrder)
  }

  return {
    recorridos,
    showModal,
    setShowModal,
    recorridoToEdit,
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