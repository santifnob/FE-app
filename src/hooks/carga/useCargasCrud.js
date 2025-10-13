import { useState, useEffect, useRef } from "react"
import { useCargasDelete } from "./useCargasDelete.js"
import { useCargasInfinite } from "./useCargaInfinite.js"
import { CargaGetOne } from "./useCargaQuery.js"

export function useCargaCrud() {
  const [cargas, setCargas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const cargaToEdit = useRef(null) // variable para menejar si es edicion o creacion
  const { mutateAsync: deleteMutation } = useCargasDelete()
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useCargasInfinite()
  const [ascOrder, setAscOrder] = useState(false);
  const { mutateAsync: findOneMutation} = CargaGetOne() // find one 
  
  useEffect(() => {
    const cargas = data?.pages.flatMap(page => page.items) ?? []
    if(ascOrder && cargas.length != 0) setCargas(cargas.sort((a, b) => a.id - b.id));
    else setCargas(cargas)
    // logica que va a ser necesaria para hacer filtrados locales
  }, [data, ascOrder])

  const handleFilter = async (cargaId) => {
    const carga = await findOneMutation(cargaId)
    setCargas([carga])

  }

  const handleEdit = (carga) => {
    cargaToEdit.current = carga
    setShowModal(true)
  }

  const handleCreate = () => {
    cargaToEdit.current = null
    setShowModal(true)
  }

  const handleAscOrder = () => {
    setAscOrder(!ascOrder)
  }

  return {
    cargas,
    showModal,
    setShowModal,
    cargaToEdit,
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