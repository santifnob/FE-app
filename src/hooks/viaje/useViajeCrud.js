import { useState, useEffect, useRef } from "react"
import { useViajesDelete } from "./useViajesDelete.js"
import { useViajesInfinite } from "./useViajeInfinite.js"
import { ViajeFindAll } from "./useViajeQuery.js"

export function useViajeCrud() {
  const [viajes, setViajes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const viajeToEdit = useRef(null) // variable para menejar si es edicion o creacion
  const { mutateAsync: deleteMutation } = useViajesDelete()
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useViajesInfinite()
  const [ascOrder, setAscOrder] = useState(false);
  const { mutateAsync: findOneMutation} = ViajeFindAll() // find one 
  
  useEffect(() => {
    const viajes = data?.pages.flatMap(page => page.items) ?? []
    if(ascOrder && viajes.length != 0) setViajes(viajes.sort((a, b) => a.id - b.id));
    else setViajes(viajes)
    // logica que va a ser necesaria para hacer filtrados locales
  }, [data, ascOrder])

  const handleFilter = async (viajeId) => {
    const viaje = await findOneMutation(viajeId)
    setViajes([viaje])

  }

  const handleEdit = (viaje) => {
    viajeToEdit.current = viaje
    setShowModal(true)
  }

  const handleCreate = () => {
    viajeToEdit.current = null
    setShowModal(true)
  }

  const handleAscOrder = () => {
    setAscOrder(!ascOrder)
  }

  return {
    viajes,
    showModal,
    setShowModal,
    viajeToEdit,
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