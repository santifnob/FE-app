import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { PiCheck, PiPlus, PiX } from 'react-icons/pi'
import DashboardCardShell from '../../dashboard/DashboardCardShell.jsx'
import { useCurrentUser } from '../../../hooks/useCurrentUser.js'
import { useConductorPendingTrips } from '../../../hooks/viaje/useConductorPendingTrips.js'
import { useViajePut } from '../../../hooks/viaje/useViajesPut.js'
import { Modal } from '../../Modal.jsx'
import { ViajeDetails } from '../../viaje/ViajeDetails.jsx'
import './NextTripWidget.css'

export default function ConductorNextTripWidget() {
  const { user, isLoading: userLoading } = useCurrentUser()
  const queryClient = useQueryClient()
  const [selectedTrip, setSelectedTrip] = useState(null)

  const {
    data: pendingTrips,
    isLoading,
    isError,
    error,
  } = useConductorPendingTrips(user?.id)

  const viajePut = useViajePut()

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha'
    const date = new Date(dateString)
    return Number.isNaN(date.getTime())
      ? 'Fecha inválida'
      : date.toLocaleDateString('es-AR')
  }

  const handleStatusChange = (viaje, estado) => {
    viajePut.mutate(
      { ...viaje, estado },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['conductorPendingTrips', user?.id] })
          queryClient.invalidateQueries(['viajesQuery'])
        }
      }
    )
  }

  return (
    <>
      <DashboardCardShell
        title="Viajes Pendientes"
        subtitle="Lista de viajes Pendiente con inicio a partir de hoy"
        badge={`${pendingTrips?.length ?? 0} pendientes`}
        loading={isLoading || userLoading}
        error={isError ? error : null}
        fallback={!pendingTrips?.length && !isLoading && !isError ? (
          <div className="text-center text-muted py-5">No hay viajes pendientes.</div>
        ) : null}
      >
        {pendingTrips?.map((viaje) => (
          <div
            key={viaje.id ?? viaje._id}
            className="d-flex align-items-start justify-content-between gap-3 mb-3 p-3 border rounded"
          >
            <div className="flex-grow-1">
              <div className="mb-1"><strong>Recorrido:</strong> {viaje.recorrido?.ciudadSalida ?? viaje.recorrido ?? 'Sin datos'} → {viaje.recorrido?.ciudadLlegada ?? 'Sin datos'}</div>
              <div className="mb-1"><strong>Inicio:</strong> {formatDate(viaje.fechaIni ?? viaje.fecha_ini ?? viaje.fechaHoraSalida)}</div>
              <div className="mb-1"><strong>Fin:</strong> {formatDate(viaje.fechaFin ?? viaje.fecha_fin)}</div>
            </div>
            <div className="d-flex align-items-center">
              <OverlayTrigger overlay={<Tooltip>Aceptar</Tooltip>}>
                <button
                  type="button"
                  className="btn btn-success btn-sm rounded-circle me-2 next-trip-action-button"
                  onClick={() => handleStatusChange(viaje, 'Activo')}
                  aria-label="Marcar activo"
                >
                  <PiCheck size={18} />
                </button>
              </OverlayTrigger>

              <OverlayTrigger overlay={<Tooltip>Rechazar</Tooltip>}>
                <button
                  type="button"
                  className="btn btn-danger btn-sm rounded-circle me-2 next-trip-action-button"
                  onClick={() => handleStatusChange(viaje, 'Rechazado')}
                  aria-label="Rechazar viaje"
                >
                  <PiX size={18} />
                </button>
              </OverlayTrigger>

              <OverlayTrigger overlay={<Tooltip>Ver detalles</Tooltip>}>
                <button
                  type="button"
                  className="btn btn-info btn-sm rounded-circle next-trip-action-button"
                  onClick={() => setSelectedTrip(viaje)}
                  aria-label="Ver detalles del viaje"
                >
                  <PiPlus size={18} />
                </button>
              </OverlayTrigger>
            </div>
          </div>
        ))}
      </DashboardCardShell>

      {selectedTrip && (
        <Modal
          onClose={() => setSelectedTrip(null)}
          title={`Detalles viaje #${selectedTrip.id ?? selectedTrip._id}`}
        >
          <ViajeDetails viaje={selectedTrip} />
          <div className="text-end mt-3">
            <button className="btn btn-secondary" onClick={() => setSelectedTrip(null)}>
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
