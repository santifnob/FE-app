import ViajesConductorBase from './ViajesConductorBase'
import ConductorBadgeProfile from '../../../components/conductor/ConductorBadgeProfile'

export default function FinalizadosViajes() {
  return (
    <>
      <ConductorBadgeProfile />
      <ViajesConductorBase
        estado="Inactivo"
        titulo="✅ Viajes Finalizados"
        emptyMessage="No tienes viajes finalizados"
      />
    </>
  )
}
