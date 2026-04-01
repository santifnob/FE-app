import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

/* =========================================================
   HELPERS
   ========================================================= */

function normalizeDate(dateValue) {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return date;
}

function isLicenseActive(license) {
  if (!license?.fechaVencimiento) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return normalizeDate(license.fechaVencimiento) >= today;
}

function formatDate(dateValue) {
  if (!dateValue) return "-";
  return new Intl.DateTimeFormat("es-AR").format(new Date(dateValue));
}

/* =========================================================
   MODAL GENÉRICO PARA VIAJES
   ========================================================= */

function ViajeModal({ show, onClose, viaje, title }) {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {!viaje ? (
                <div className="alert alert-secondary mb-0">
                  No hay información del viaje.
                </div>
              ) : (
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
                    <strong>Fecha inicio:</strong>{" "}
                    {formatDate(viaje.fechaInicio)}
                  </div>
                  <div className="col-md-6">
                    <strong>Fecha fin:</strong>{" "}
                    {formatDate(viaje.fechaFin)}
                  </div>
                </div>
              )}
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
   LANDING PAGE CONDUCTOR
   ========================================================= */

export default function LandingConductor() {
  const [viajeEnCursoModal, setViajeEnCursoModal] = useState(false);
  const [proximoViajeModal, setProximoViajeModal] = useState(false);

  /* =========================================================
     REACT QUERY - DATA PRINCIPAL
     =========================================================
     👉 CONECTAR BACKEND ACÁ
     Idealmente este endpoint devuelve todo lo necesario
     para la landing.
  */
  const { data, isLoading } = useQuery({
    queryKey: ["conductor-landing"],
    queryFn: async () => {
      // ============================
      // BACKEND: GET landing conductor
      // ============================
      await new Promise((r) => setTimeout(r, 400));

      return {
        conductor: {
          nombre: "Juan",
          apellido: "Pérez",
        },
        stats: {
          rechazados: 3,
          finalizados: 12,
        },
        viajeEnCurso: {
          id: 77,
          estado: "En curso",
          origen: "Rosario",
          destino: "Córdoba",
          fechaInicio: "2026-03-20",
          fechaFin: null,
        },
        proximoViaje: null,
        ultimaLicencia: {
          tipo: "Carga pesada",
          fechaVencimiento: "2026-12-31",
        },
      };
    },
  });

  /* =========================================================
     ESTADOS DERIVADOS
     ========================================================= */

  const initials = useMemo(() => {
    if (!data?.conductor) return "U";
    return `${data.conductor.nombre[0]}${data.conductor.apellido[0]}`.toUpperCase();
  }, [data]);

  const licenciaActiva = useMemo(() => {
    return isLicenseActive(data?.ultimaLicencia);
  }, [data]);

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Panel del conductor</h2>

        <div className="d-flex align-items-center gap-3">
          <span className="fw-semibold">
            {data.conductor.nombre} {data.conductor.apellido}
          </span>

          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
            style={{ width: 40, height: 40 }}
          >
            {initials}
          </div>
        </div>
      </div>

      {/* TARJETAS */}
      <div className="row g-4">
        {/* Rechazados */}
        <div className="col-md-4">
          <div className="card text-center border-0 shadow">
            <div className="card-body">
              <p className="text-muted mb-1">Viajes rechazados</p>
              <span className="badge bg-danger fs-4 px-4 py-2">
                {data.stats.rechazados}
              </span>
            </div>
          </div>
        </div>

        {/* Finalizados */}
        <div className="col-md-4">
          <div className="card text-center border-0 shadow">
            <div className="card-body">
              <p className="text-muted mb-1">Viajes finalizados</p>
              <span className="badge bg-success fs-4 px-4 py-2">
                {data.stats.finalizados}
              </span>
            </div>
          </div>
        </div>

        {/* Viaje en curso */}
        <div className="col-md-4">
          <div
            className={`card border-0 shadow h-100 ${
              data.viajeEnCurso ? "" : "text-muted"
            }`}
          >
            <div className="card-body text-center">
              <p className="mb-2 fw-semibold">Viaje en curso</p>

              {data.viajeEnCurso ? (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setViajeEnCursoModal(true)}
                >
                  Ver viaje en curso
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
          <div className="card border-0 shadow h-100">
            <div className="card-body text-center">
              <p className="fw-semibold mb-2">Próximo viaje</p>

              {data.proximoViaje ? (
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setProximoViajeModal(true)}
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

        {/* Última licencia */}
        <div className="col-md-6">
          <div className="card border-0 shadow h-100">
            <div className="card-body text-center">
              <p className="fw-semibold mb-2">Última licencia</p>

              {licenciaActiva ? (
                <span className="badge bg-success px-3 py-2">
                  Activa hasta {formatDate(data.ultimaLicencia.fechaVencimiento)}
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
        show={viajeEnCursoModal}
        onClose={() => setViajeEnCursoModal(false)}
        viaje={data.viajeEnCurso}
        title="Viaje en curso"
      />

      <ViajeModal
        show={proximoViajeModal}
        onClose={() => setProximoViajeModal(false)}
        viaje={data.proximoViaje}
        title="Próximo viaje"
      />
    </div>
  );
}