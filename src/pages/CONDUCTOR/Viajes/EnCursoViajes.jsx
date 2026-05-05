import ViajesConductorBase from './ViajesConductorBase'
import ConductorBadgeProfile from '../../../components/conductor/ConductorBadgeProfile'
export default function EnCursoViajes() {
  return (
    <>
      <ConductorBadgeProfile />
      <ViajesConductorBase
        estado="En curso"
        titulo="🔄 Viajes en Curso"
        emptyMessage="No tienes viajes en curso"
      />
    </>
  )
}
