import ViajesConductorBase from './ViajesConductorBase'

export default function PendientesViajes() {
  return (
    <ViajesConductorBase
      estado='Pendiente'
      titulo='🚧 Viajes Pendientes'
      emptyMessage='No tienes viajes pendientes'
    />
  )
}
