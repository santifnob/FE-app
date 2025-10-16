export function ConductorItem({ conductorData }){
  return (
    <li className="list-group-item">
      {conductorData.nombre} {conductorData.apellido} - {conductorData.email}
      <button className="btn btn-danger btn-sm float-end">
        Rechazar
      </button>
      <button className="btn btn-success btn-sm float-end mx-3">
        Aceptar
      </button>
      
    </li>
  )
}