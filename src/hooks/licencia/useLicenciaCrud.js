import { useState, useEffect, useRef } from 'react'
import { useLicenciasDelete } from './useLicenciasDelete.js'
import { useLicenciasInfinite } from './useLicenciaInfinite.js'
import { LicenciaGetOne } from './useLicenciaQuery.js'

export function useLicenciaCrud () {
  const [licencias, setLicencias] = useState([])
  const [showModal, setShowModal] = useState(false)
  const licenciaToEdit = useRef(null) // variable para menejar si es edicion o creacion
  const { mutateAsync: deleteMutation } = useLicenciasDelete()
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } = useLicenciasInfinite()
  const [ascOrder, setAscOrder] = useState(false)
  const { mutateAsync: findOneMutation } = LicenciaGetOne() // find one

  useEffect(() => {
    const licencias = data?.pages.flatMap(page => page.items) ?? []
    if (ascOrder && licencias.length !== 0) setLicencias(licencias.sort((a, b) => a.id - b.id))
    else setLicencias(licencias)
    // logica que va a ser necesaria para hacer filtrados locales
  }, [data, ascOrder])

  const handleFilter = async (licenciaId) => {
    const licencia = await findOneMutation(licenciaId)
    setLicencias([licencia])
  }

  const handleEdit = (licencia) => {
    licenciaToEdit.current = licencia
    setShowModal(true)
  }

  const handleCreate = () => {
    licenciaToEdit.current = null
    setShowModal(true)
  }

  const handleAscOrder = () => {
    setAscOrder(!ascOrder)
  }

  return {
    licencias,
    showModal,
    setShowModal,
    licenciaToEdit,
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
