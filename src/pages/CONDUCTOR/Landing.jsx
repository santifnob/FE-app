import { useEffect, useMemo, useState } from "react";
import {
  ViajeActivos,
  ViajePendientes,
  ViajeInactivos,
  ViajeRechazados, 
} from "../../hooks/viaje/useViajeQuery";
import { ConductorGetOne } from "../../hooks/conductor/useConductorQuery";
import { LicenciaActivos } from "../../hooks/licencia/useLicenciaQuery";

/* =========================================================
   HELPERS
   ========================================================= */

function formatDate(dateValue) {
  if (!dateValue) return "-";
  return new Intl.DateTimeFormat("es-AR").format(new Date(dateValue));
}

/* =========================================================
   MODAL VIAJE
   ========================================================= */

function ViajeModal({ show, onClose, viaje, title }) {
  if (!show || !viaje) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <strong>ID:</strong> {viaje.id}
                </div>
                <div className="col-md-6">
                  <strong>Estado:</strong> {viaje.estado}
                </div>
                <div className="col-md-6">
                  <strong>Origen:</strong> {viaje.origen}
                </div>
                <div className="col-md-6">
                  <strong>Destino:</strong> {viaje.destino}
                </div>
                <div className="col-md-6">
                  <strong>Inicio:</strong> {formatDate(viaje.fechaInicio)}
                </div>
                <div className="col-md-6">
                  <strong>Fin:</strong> {formatDate(viaje.fechaFin)}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" onClick={onClose} />
    </>
  );
}

/* =========================================================
   LANDING CONDUCTOR
   ========================================================= */

export default function LandingConductor() {
  const conductorId = 1; 
  // TODO AUTH: obtener desde AuthProvider

  const [conductor, setConductor] = useState(null);
  const [showViajeEnCurso, setShowViajeEnCurso] = useState(false);
  const [showProximoViaje, setShowProximoViaje] = useState(false);

  /* ===================== CONDUCTOR ===================== */

  const conductorMutation = ConductorGetOne();

  useEffect(() => {
    conductorMutation.mutateAsync(conductorId).then(setConductor);
  }, [conductorId, conductorMutation]);

  /* ===================== VIAJES ===================== */

  const { data: viajesActivos = [] } = ViajeActivos();
  const { data: viajesPendientes = [] } = ViajePendientes();
  const { data: viajesInactivos = [] } = ViajeInactivos();
  const { data: viajesRechazados = [] } = ViajeRechazados();

  const viajeEnCurso = useMemo(
    () => viajesActivos.find(v => v.conductorId === conductorId),
    [viajesActivos, conductorId]
  );

  const proximoViaje = useMemo(
    () => viajesPendientes.find(v => v.conductorId === conductorId),
    [viajesPendientes, conductorId]
  );

  const finalizadosCount = useMemo(
    () => viajesInactivos.filter(v => v.conductorId === conductorId).length,
    [viajesInactivos, conductorId]
  );

  const rechazadosCount = useMemo(
    () => viajesRechazados.filter(v => v.conductorId === conductorId).length,
    [viajesRechazados, conductorId]
  );

  /* ===================== LICENCIAS ===================== */

  const { data: licenciasActivas = [] } = LicenciaActivos();

  const ultimaLicencia = useMemo(() => {
    const delConductor = licenciasActivas.filter(
      l => l.conductorId === conductorId
    );

    if (!delConductor.length) return null;

    return delConductor.sort(
      (a, b) => new Date(b.fechaVencimiento) - new Date(a.fechaVencimiento)
    )[0];
  }, [licenciasActivas, conductorId]);

  /* ===================== UI ===================== */

  if (!conductor) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  const initials = `${conductor.nombre[0]}${conductor.apellido[0]}`.toUpperCase();

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Panel del conductor</h2>

        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold">
            {conductor.nombre} {conductor.apellido}
          </span>
          <div
            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center fw-bold"
            style={{ width: 40, height: 40 }}
          >
            {initials}
          </div>
        </div>
      </div>

      {/* CARDS */}
      <div className="row g-4">
        {/* Rechazados */}
        <div className="col-md-4">
          <div className="card text-center shadow border-0">
            <div className="card-body">
              <p className="text-muted mb-1">Viajes rechazados</p>
              <span className="badge bg-danger fs-4 px-4 py-2">
                {rechazadosCount}
              </span>
            </div>
          </div>
        </div>

        {/* Finalizados */}
        <div className="col-md-4">
          <div className="card text-center shadow border-0">
            <div className="card-body">
              <p className="text-muted mb-1">Viajes finalizados</p>
              <span className="badge bg-success fs-4 px-4 py-2">
                {finalizadosCount}
              </span>
            </div>
          </div>
        </div>

        {/* Viaje en curso */}
        <div className="col-md-4">
          <div className="card text-center shadow border-0 h-100">
            <div className="card-body">
              <p className="fw-semibold mb-2">Viaje en curso</p>
              {viajeEnCurso ? (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setShowViajeEnCurso(true)}
                >
                  Ver viaje
                </button>
              ) : (
                <span className="badge bg-secondary px-3 py-2">
                  Sin viaje en curso
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Próximo viaje */}
        <div className="col-md-6">
          <div className="card text-center shadow border-0 h-100">
            <div className="card-body">
              <p className="fw-semibold mb-2">Próximo viaje</p>
              {proximoViaje ? (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setShowProximoViaje(true)}
                >
                  Ver próximo viaje
                </button>
              ) : (
                <span className="badge bg-secondary px-3 py-2">
                  Sin viajes próximos
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Licencia */}
        <div className="col-md-6">
          <div className="card text-center shadow border-0 h-100">
            <div className="card-body">
              <p className="fw-semibold mb-2">Última licencia</p>
              {ultimaLicencia ? (
                <span className="badge bg-success px-3 py-2">
                  Activa hasta {formatDate(ultimaLicencia.fechaVencimiento)}
                </span>
              ) : (
                <span className="badge bg-danger px-3 py-2">
                  Sin licencia activa
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODALES */}
      <ViajeModal
        show={showViajeEnCurso}
        onClose={() => setShowViajeEnCurso(false)}
        viaje={viajeEnCurso}
        title="Viaje en curso"
      />

      <ViajeModal
        show={showProximoViaje}
        onClose={() => setShowProximoViaje(false)}
        viaje={proximoViaje}
        title="Próximo viaje"
      />
    </div>
  );
}