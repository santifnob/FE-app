import { useState, useEffect, useRef } from 'react'
import { useLineaCargasDelete } from './useLineaCargaDelete.js'
import { useLineaCargasInfinite } from './useLineaCargaInfinite.js'
import { LineaCargaGetOne } from './useLineaCargaQuery.js'

export function useLineaCargaCrud () {
  const [lineaCargas, setLineaCargas] = useState([])
  const [showModal, setShowModal] = useState(false)
  const lineaCargaToEdit = useRef(null) // variable para menejar si es edicion o creacion
  const { mutateAsync: deleteMutation } = useLineaCargasDelete()
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useLineaCargasInfinite()
  const [ascOrder, setAscOrder] = useState(false)
  const { mutateAsync: findOneMutation } = LineaCargaGetOne() // find one

  useEffect(() => {
    const lineaCargas = data?.pages.flatMap(page => page.items) ?? []
    if (ascOrder && lineaCargas.length !== 0) setLineaCargas(lineaCargas.sort((a, b) => a.id - b.id))
    else setLineaCargas(lineaCargas)
    // logica que va a ser necesaria para hacer filtrados locales
  }, [data, ascOrder])

  const handleFilter = async (lineaCargaId) => {
    const lineaCarga = await findOneMutation(lineaCargaId)
    setLineaCargas([lineaCarga])
  }

  const handleEdit = (lineaCarga) => {
    lineaCargaToEdit.current = lineaCarga
    setShowModal(true)
  }

  const handleCreate = () => {
    lineaCargaToEdit.current = null
    setShowModal(true)
  }

  const handleAscOrder = () => {
    setAscOrder(!ascOrder)
  }

  return {
    lineaCargas,
    showModal,
    setShowModal,
    lineaCargaToEdit,
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
