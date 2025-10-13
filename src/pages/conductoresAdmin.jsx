import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api.js'

export default function ConductoresPage () {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')

  const fetchConductores = async ({ queryKey }) => {
    const [_key, { page, pageSize, search }] = queryKey
    const resp = await api.get('/conductores', {
      params: { page, pageSize, q: search },
      withCredentials: true
    })
    return resp.data
  }

  const { data, isLoading, isError, error } = useQuery(
    ['conductores', { page, pageSize, search }],
    fetchConductores,
    { keepPreviousData: true }
  )

  const deleteMutation = useMutation(
    async (id) => {
      await api.delete(`/conductores/${id}`, { withCredentials: true })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['conductores'])
      }
    }
  )

  const total = data?.total ?? 0
  const list = data?.data ?? []
  const pagesCount = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  )

  const handleDelete = (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este conductor?')) return
    deleteMutation.mutate(id)
  }

  return (
    <div className='container my-4'>
      {/* encabezado */}
      <div
        className='d-flex align-items-center justify-content-between p-3 rounded mb-3'
        style={{ background: '#2eccce', color: '#fff' }}
      >
        <h5 className='mb-0'>CONDUCTORES</h5>
        <Link to='/admin/conductores/new' className='btn btn-primary'>
          + Nuevo Conductor
        </Link>
      </div>

      {/* controles */}
      <div className='d-flex justify-content-between align-items-center mb-2'>
        <select
          className='form-select form-select-sm'
          style={{ width: '80px' }}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setPage(1)
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
        </select>

        <input
          type='search'
          className='form-control form-control-sm'
          style={{ maxWidth: '220px' }}
          placeholder='Buscar...'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      {/* tabla */}
      <div className='table-responsive'>
        <table className='table table-hover align-middle'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Estado</th>
              <th className='text-end'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? (
                <tr>
                  <td colSpan='5'>Cargando...</td>
                </tr>
                )
              : isError
                ? (
                  <tr>
                    <td colSpan='5'>Error: {String(error)}</td>
                  </tr>
                  )
                : list.length === 0
                  ? (
                    <tr>
                      <td colSpan='5'>No hay conductores</td>
                    </tr>
                    )
                  : (
                      list.map((c) => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>{c.name}</td>
                          <td>{c.apellido}</td>
                          <td>
                            <span
                              className={`badge ${
                        c.estado === 'activo' ? 'bg-success' : 'bg-secondary'
                      }`}
                            >
                              {c.estado}
                            </span>
                          </td>
                          <td className='text-end'>
                            <div className='btn-group'>
                              <Link
                                to={`/admin/conductores/${c.id}`}
                                className='btn btn-sm btn-outline-success'
                              >
                                Ver
                              </Link>
                              <Link
                                to={`/admin/conductores/${c.id}/edit`}
                                className='btn btn-sm btn-outline-primary'
                              >
                                Editar
                              </Link>
                              <button
                                onClick={() => handleDelete(c.id)}
                                className='btn btn-sm btn-outline-danger'
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
          </tbody>
        </table>
      </div>

      {/* paginación */}
      <div className='d-flex justify-content-between align-items-center'>
        <div>
          Mostrando {(page - 1) * pageSize + 1} -{' '}
          {Math.min(page * pageSize, total)} de {total}
        </div>
        <ul className='pagination pagination-sm mb-0'>
          <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
            <button
              className='page-link'
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </button>
          </li>
          <li className='page-item disabled'>
            <span className='page-link'>
              {page}/{pagesCount}
            </span>
          </li>
          <li className={`page-item ${page >= pagesCount ? 'disabled' : ''}`}>
            <button
              className='page-link'
              onClick={() => setPage((p) => Math.min(pagesCount, p + 1))}
            >
              Siguiente
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
