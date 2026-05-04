import ViajesConductorBase from './ViajesConductorBase'
import ConductorBadgeProfile from '../../../components/conductor/ConductorBadgeProfile'
export default function EnCursoViajes() {
  return (
    <>
      <ConductorBadgeProfile />
      <ViajesConductorBase
        estado="Activo"
        titulo="🔄 Viajes en Curso"
        emptyMessage="No tienes viajes en curso"
      />
    </>
  )
}
