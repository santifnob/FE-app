import ViajesConductorBase from './ViajesConductorBase'
import ConductorBadgeProfile from '../../../components/conductor/ConductorBadgeProfile'
export default function ProgramadosViajes() {
  return (
    <>
      <ConductorBadgeProfile />
      <ViajesConductorBase
        estado="Programado"
        titulo="🔄 Viajes Programados"
        emptyMessage="No tienes viajes programados"
      />
    </>
  )
}