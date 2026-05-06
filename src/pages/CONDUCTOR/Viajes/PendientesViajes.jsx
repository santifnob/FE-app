import ViajesConductorBase from './ViajesConductorBase'
import ConductorBadgeProfile from '../../../components/conductor/ConductorBadgeProfile'

export default function PendientesViajes() {
  return (
    <>
      <ConductorBadgeProfile />
      <ViajesConductorBase
        estado='Pendiente'
        estadoInferido='Pendiente'
        titulo='🚧 Viajes Pendientes'
        emptyMessage='No tienes viajes pendientes'
      />
    </>
  )
}
