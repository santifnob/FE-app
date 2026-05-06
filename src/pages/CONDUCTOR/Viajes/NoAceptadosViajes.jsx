import ViajesConductorBase from './ViajesConductorBase'
import ConductorBadgeProfile from '../../../components/conductor/ConductorBadgeProfile'

export default function NoAceptadosViajes() {
  return (
    <>
      <ConductorBadgeProfile />
      <ViajesConductorBase
        estado="Viaje no aceptado"
        titulo="❌ Viajes No Aceptados"
        emptyMessage="No tienes viajes no aceptados"
      />
    </>
  )
}