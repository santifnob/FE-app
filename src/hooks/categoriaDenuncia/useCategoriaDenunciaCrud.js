import { useState, useEffect, useRef } from "react"
import { useCategoriaDenunciasDelete } from "./useCategoriaDenunciasDelete.js"
import { useCategoriaDenunciasInfinite } from "./useCategoriaDenunciaInfinite.js"
import { CategoriaDenunciaGetOne } from "./useCategoriaDenunciaQuery.js"

export function useCategoriaDenunciaCrud() {
  const [categoriaDenuncias, setCategoriaDenuncias] = useState([])
  const [showModal, setShowModal] = useState(false)
  const categoriaDenunciaToEdit = useRef(null) // variable para menejar si es edicion o creacion
  const { mutateAsync: deleteMutation } = useCategoriaDenunciasDelete()
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useCategoriaDenunciasInfinite()
  const [ascOrder, setAscOrder] = useState(false);
  const { mutateAsync: findOneMutation} = CategoriaDenunciaGetOne() // find one 
  
  useEffect(() => {
    const categoriaDenuncias = data?.pages.flatMap(page => page.items) ?? []
    if(ascOrder && categoriaDenuncias.length != 0) setCategoriaDenuncias(categoriaDenuncias.sort((a, b) => a.id - b.id));
    else setCategoriaDenuncias(categoriaDenuncias)
    // logica que va a ser necesaria para hacer filtrados locales
  }, [data, ascOrder])

  const handleFilter = async (categoriaDenunciaId) => {
    const categoriaDenuncia = await findOneMutation(categoriaDenunciaId)
    setCategoriaDenuncias([categoriaDenuncia])

  }

  const handleEdit = (categoriaDenuncia) => {
    categoriaDenunciaToEdit.current = categoriaDenuncia
    setShowModal(true)
  }

  const handleCreate = () => {
    categoriaDenunciaToEdit.current = null
    setShowModal(true)
  }

  const handleAscOrder = () => {
    setAscOrder(!ascOrder)
  }

  return {
    categoriaDenuncias,
    showModal,
    setShowModal,
    categoriaDenunciaToEdit,
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