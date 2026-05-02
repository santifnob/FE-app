import ViajesConductorBase from './ViajesConductorBase'

export default function FinalizadosViajes() {
  return (
    <ViajesConductorBase
      estado='Inactivo'
      titulo='✅ Viajes Finalizados'
      emptyMessage='No tienes viajes finalizados'
    />
  )
}
