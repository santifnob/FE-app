import ViajesConductorBase from './ViajesConductorBase'

export default function EnCursoViajes() {
  return (
    <ViajesConductorBase
      estado='Activo'
      titulo='🔄 Viajes en Curso'
      emptyMessage='No tienes viajes en curso'
    />
  )
}
