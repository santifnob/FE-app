import { useState, useEffect, useRef } from "react"
import { useTipoCargasDelete } from "./useTipoCargasDelete.js"
import { useTipoCargasInfinite } from "./useTipoCargaInfinite.js"
import { TipoCargaGetOne } from "./useTipoCargaQuery.js"

export function useTipoCargaCrud() {
  const [tipoCargas, setTipoCargas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const tipoCargaToEdit = useRef(null) // variable para menejar si es edicion o creacion
  const { mutateAsync: deleteMutation } = useTipoCargasDelete()
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useTipoCargasInfinite()
  const [ascOrder, setAscOrder] = useState(false);
  const { mutateAsync: findOneMutation} = TipoCargaGetOne() // find one 
  
  useEffect(() => {
    const tipoCargas = data?.pages.flatMap(page => page.items) ?? []
    if(ascOrder && tipoCargas.length != 0) setTipoCargas(tipoCargas.sort((a, b) => a.id - b.id));
    else setTipoCargas(tipoCargas)
    // logica que va a ser necesaria para hacer filtrados locales
  }, [data, ascOrder])

  const handleFilter = async (tipoCargaId) => {
    const tipoCarga = await findOneMutation(tipoCargaId)
    setTipoCargas([tipoCarga])

  }

  const handleEdit = (tipoCarga) => {
    tipoCargaToEdit.current = tipoCarga
    setShowModal(true)
  }

  const handleCreate = () => {
    tipoCargaToEdit.current = null
    setShowModal(true)
  }

  const handleAscOrder = () => {
    setAscOrder(!ascOrder)
  }

  return {
    tipoCargas,
    showModal,
    setShowModal,
    tipoCargaToEdit,
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