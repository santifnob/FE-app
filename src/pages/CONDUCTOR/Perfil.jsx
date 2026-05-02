import { useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as bootstrap from "bootstrap";
import { AuthContext } from "../../context/AuthContext.jsx";
import  { ConductorGetOne }  from "../../hooks/conductor/useConductorQuery.js";
import  { useConductorPut }  from "../../hooks/conductor/useConductorPut.js";
import  { LicenciaFindAll }  from "../../hooks/licencia/useLicenciaQuery.js";

/* =========================================================
 HELPERS
========================================================= */
function normalizeDate(dateValue) {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return date;
}

function formatDate(dateValue) {
  if (!dateValue) return "-";
  return new Intl.DateTimeFormat("es-AR").format(new Date(dateValue));
}

function getLatestLicense(licenses = []) {
  if (!licenses.length) return null;
  return [...licenses].sort((a, b) => {
    const dateA = new Date(a.fechaVencimiento);
    const dateB = new Date(b.fechaVencimiento);
    return dateB - dateA;
  })[0];
}

function isLicenseActive(license) {
  if (!license?.fechaVencimiento) return false;

  // Si el backend trae estado, lo respetamos
  if (license.estado) return license.estado === "Activo";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expirationDate = normalizeDate(license.fechaVencimiento);
  return expirationDate >= today;
}

/* =========================================================
 COMPONENTE REUTILIZABLE PARA CAMPOS EDITABLES
========================================================= */
function EditableField({
  label,
  fieldName,
  value,
  inputType = "text",
  placeholder,
  onSave,
  isPassword = false,
  isSaving = false,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { value: "" },
  });

  useEffect(() => {
    reset({ value: isPassword ? "" : (value ?? "") });
  }, [value, reset, isPassword]);

  const submitHandler = async (data) => {
    await onSave(fieldName, data.value);
    setIsEditing(false);
  };

  const disabled = isSubmitting || isSaving;

  return (
    <div className="card shadow-sm border-0 mb-3">
      <div className="card-body">
        {!isEditing ? (
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <p className="text-muted mb-1 fw-semibold">{label}</p>
              <p className="mb-0 fs-5">
                {isPassword ? "••••••••" : (value ?? "-")}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setIsEditing(true)}
              disabled={isSaving}
            >
              Modificar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-8">
                <label className="form-label fw-semibold">{label}</label>
                <input
                  type={inputType}
                  className={`form-control ${errors.value ? "is-invalid" : ""}`}
                  placeholder={placeholder}
                  {...register("value", {
                    required: "Este campo es obligatorio",
                    minLength: isPassword
                      ? { value: 6, message: "La contraseña debe tener al menos 6 caracteres" }
                      : undefined,
                  })}
                  disabled={disabled}
                />
                {errors.value && (
                  <div className="invalid-feedback">{errors.value.message}</div>
                )}
              </div>

              <div className="col-12 col-md-4 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={disabled}
                >
                  {isSaving ? "Guardando..." : "Guardar"}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    reset({ value: isPassword ? "" : (value ?? "") });
                    setIsEditing(false);
                  }}
                  disabled={disabled}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* =========================================================
 MODAL DE LICENCIAS
========================================================= */
function LicensesModal({ show, onClose, licenses = [] }) {
  if (!show) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title">Licencias del conductor</h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar" />
            </div>

            <div className="modal-body">
              {licenses.length === 0 ? (
                <div className="alert alert-warning mb-0">
                  Este conductor no posee licencias registradas.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Fecha de emisión</th>
                        <th>Fecha de vencimiento</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {licenses.map((license) => {
                        const active = isLicenseActive(license);
                        return (
                          <tr key={license.id}>
                            <td>{license.id}</td>
                            <td>{license.tipo ?? "-"}</td>
                            <td>{formatDate(license.fechaEmision)}</td>
                            <td>{formatDate(license.fechaVencimiento)}</td>
                            <td>
                              <span className={`badge ${active ? "bg-success" : "bg-danger"}`}>
                                {active ? "Activa" : "Vencida"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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

      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </>
  );
}

/* =========================================================
 PERFIL PRINCIPAL
========================================================= */
export default function PerfilConductor() {
  const { user } = useContext(AuthContext); // viene de tu AuthProvider [1](https://frroutneduar-my.sharepoint.com/personal/gconstante_frro_utn_edu_ar/Documents/Archivos%20de%20Microsoft%C2%A0Copilot%20Chat/AuthProvider.jsx)
  const conductorId = user?.id; // <-- asumido: user.id

  const [conductor, setConductor] = useState(null);
  const [showLicensesModal, setShowLicensesModal] = useState(false);

  // GET conductor por id (hook existente: mutation)
  const conductorGetOne = ConductorGetOne(); // [2](https://frroutneduar-my.sharepoint.com/personal/gconstante_frro_utn_edu_ar/Documents/Archivos%20de%20Microsoft%C2%A0Copilot%20Chat/useConductorPut.js)

  // PUT conductor
  const conductorPut = useConductorPut(); // [2](https://frroutneduar-my.sharepoint.com/personal/gconstante_frro_utn_edu_ar/Documents/Archivos%20de%20Microsoft%C2%A0Copilot%20Chat/useConductorPut.js)

  // Licencias
  const { data: allLicencias = [], isLoading: isLicenciasLoading } = LicenciaFindAll();

  // 1) Cargar conductor al tener el id
  useEffect(() => {
    let mounted = true;

    async function fetchConductor() {
      if (!conductorId) return;

      try {
        const data = await conductorGetOne.mutateAsync(conductorId);
        // tu hook devuelve conductor.data.items (puede ser objeto o array) [2](https://frroutneduar-my.sharepoint.com/personal/gconstante_frro_utn_edu_ar/Documents/Archivos%20de%20Microsoft%C2%A0Copilot%20Chat/useConductorPut.js)
        const normalized = Array.isArray(data) ? data[0] : data;

        if (mounted) setConductor(normalized ?? null);
      } catch (e) {
        // el error lo manejamos en UI con conductorGetOne.isError
      }
    }

    fetchConductor();

    return () => {
      mounted = false;
    };
  }, [conductorId]);

  // 2) Tooltips bootstrap (email no editable)
  useEffect(() => {
    if (!conductor) return;
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map((el) => new bootstrap.Tooltip(el));
    return () => tooltipList.forEach((t) => t.dispose());
  }, [conductor]);

  // 3) Resolver licencias del conductor (robusto)
  const resolvedLicenses = useMemo(() => {
    const raw = conductor?.licencias ?? [];
    if (!raw.length) return [];

    // Si ya vienen completas:
    if (typeof raw[0] === "object" && raw[0]?.fechaVencimiento) return raw;

    // Si vienen ids:
    if (typeof raw[0] === "number") {
      const ids = new Set(raw);
      return allLicencias.filter((l) => ids.has(l.id));
    }

    // Si vienen objetos parciales con id:
    if (typeof raw[0] === "object" && raw[0]?.id) {
      const ids = new Set(raw.map((x) => x.id));
      return allLicencias.filter((l) => ids.has(l.id));
    }

    return [];
  }, [conductor, allLicencias]);

  const latestLicense = useMemo(() => getLatestLicense(resolvedLicenses), [resolvedLicenses]);
  const hasActiveLicense = useMemo(() => isLicenseActive(latestLicense), [latestLicense]);

  // 4) Guardar campo (PUT con objeto completo)
  const handleSaveField = async (field, value) => {
    if (!conductor) return;

    const updated = { ...conductor, value };

    // IMPORTANTE: tu put hace PUT /conductor/:id usando conductor.id [2](https://frroutneduar-my.sharepoint.com/personal/gconstante_frro_utn_edu_ar/Documents/Archivos%20de%20Microsoft%C2%A0Copilot%20Chat/useConductorPut.js)
    await conductorPut.mutateAsync(updated);

    // Update local para reflejar en UI
    setConductor(updated);
  };

  /* ==========================
     UI: estados
  ========================== */
  if (!conductorId) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning mb-0">
          No hay usuario autenticado o no se encontró <b>user.id</b> en el AuthContext.
        </div>
      </div>
    );
  }

  if (conductorGetOne.isPending || (!conductor && !conductorGetOne.isError)) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (conductorGetOne.isError) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Ocurrió un error al cargar el perfil.
          <br />
          <small>{conductorGetOne.error?.message ?? "Error desconocido"}</small>
        </div>
      </div>
    );
  }

  // Avatar
  const initials = `${conductor?.nombre?.[0] ?? ""}${conductor?.apellido?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="container py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-9">

          {/* Cabecera */}
          <div className="card border-0 shadow-lg mb-4 overflow-hidden">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4">
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 90, height: 90, fontSize: "2rem", flexShrink: 0 }}
                >
                  {initials || "U"}
                </div>

                <div className="text-center text-md-start w-100">
                  <h1 className="h2 fw-bold mb-2">
                    Bienvenido a tu perfil, {conductor?.nombre ?? ""}
                  </h1>
                  <p className="text-muted mb-0">
                    Desde aquí podés consultar y editar la información de tu cuenta.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email (no editable) */}
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Email</p>
                  <p
                    className="mb-0 fs-5 d-inline-block"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Para cambiar el email contactar con un administrador"
                    style={{ cursor: "help" }}
                  >
                    {conductor?.email ?? "-"}
                  </p>
                </div>
                <span className="badge text-bg-secondary px-3 py-2">
                  No editable
                </span>
              </div>
            </div>
          </div>

          {/* Nombre */}
          <EditableField
            label="Nombre"
            fieldName="nombre"
            value={conductor?.nombre}
            inputType="text"
            placeholder="Ingresá tu nombre"
            onSave={handleSaveField}
            isSaving={conductorPut.isPending}
          />

          {/* Apellido */}
          <EditableField
            label="Apellido"
            fieldName="apellido"
            value={conductor?.apellido}
            inputType="text"
            placeholder="Ingresá tu apellido"
            onSave={handleSaveField}
            isSaving={conductorPut.isPending}
          />

          {/* Password (no la mostramos, permitimos setear una nueva) */}
          <EditableField
            label="Password"
            fieldName="password"
            value={""}
            inputType="password"
            placeholder="Ingresá tu nueva contraseña"
            onSave={handleSaveField}
            isPassword
            isSaving={conductorPut.isPending}
          />

          {/* Licencias */}
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Licencias</p>

                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span className={`badge px-3 py-2 fs-6 ${hasActiveLicense ? "bg-success" : "bg-danger"}`}>
                      {hasActiveLicense ? "Licencia activa" : "Sin licencia activa"}
                    </span>

                    {latestLicense && (
                      <small className="text-muted">
                        Último vencimiento: {formatDate(latestLicense.fechaVencimiento)}
                      </small>
                    )}

                    {isLicenciasLoading && (
                      <small className="text-muted">Cargando licencias...</small>
                    )}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setShowLicensesModal(true)}
                  >
                    Licencias
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error PUT */}
          {conductorPut.isError && (
            <div className="alert alert-danger">
              Error al guardar cambios.
              <br />
              <small>{conductorPut.error?.message ?? "Error desconocido"}</small>
            </div>
          )}

        </div>
      </div>

      {/* Modal licencias */}
      <LicensesModal
        show={showLicensesModal}
        onClose={() => setShowLicensesModal(false)}
        licenses={resolvedLicenses}
      />
    </div>
  );
}