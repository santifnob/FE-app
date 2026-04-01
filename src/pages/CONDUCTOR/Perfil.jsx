import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as bootstrap from "bootstrap";

/* =========================================================
   HELPERS
   ========================================================= */

// Normaliza una fecha al inicio del día para comparar solamente por fecha.
// Esto evita problemas si el backend manda fecha con hora.
function normalizeDate(dateValue) {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return date;
}

// Devuelve la última licencia según fecha de vencimiento.
// Si en tu backend "última licencia" significa otra cosa (ej. fecha de emisión),
// cambiá esta lógica acá.
function getLatestLicense(licenses = []) {
  if (!licenses.length) return null;

  return [...licenses].sort((a, b) => {
    const dateA = new Date(a.fechaVencimiento);
    const dateB = new Date(b.fechaVencimiento);
    return dateB - dateA;
  })[0];
}

// Retorna true si la licencia está activa hoy.
// Regla pedida:
// - Si la fecha de vencimiento es anterior a hoy => vencida
// - Si vence hoy o después => activa
function isLicenseActive(latestLicense) {
  if (!latestLicense?.fechaVencimiento) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expirationDate = normalizeDate(latestLicense.fechaVencimiento);

  return expirationDate >= today;
}

// Formatea fecha para mostrar linda en pantalla.
function formatDate(dateValue) {
  if (!dateValue) return "-";
  return new Intl.DateTimeFormat("es-AR").format(new Date(dateValue));
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
}) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      value: "",
    },
  });

  useEffect(() => {
    // Si es password, por seguridad no cargamos el valor real.
    reset({
      value: isPassword ? "" : value ?? "",
    });
  }, [value, reset, isPassword]);

  const submitHandler = async (data) => {
    await onSave(fieldName, data.value);
    setIsEditing(false);
  };

  return (
    <div className="card shadow-sm border-0 mb-3">
      <div className="card-body">
        {!isEditing ? (
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <p className="text-muted mb-1 fw-semibold">{label}</p>
              <p className="mb-0 fs-5">
                {isPassword ? "••••••••" : value || "-"}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setIsEditing(true)}
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
                    minLength:
                      isPassword
                        ? {
                            value: 6,
                            message:
                              "La contraseña debe tener al menos 6 caracteres",
                          }
                        : undefined,
                  })}
                />
                {errors.value && (
                  <div className="invalid-feedback">{errors.value.message}</div>
                )}
              </div>

              <div className="col-12 col-md-4 d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  Guardar
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    reset({
                      value: isPassword ? "" : value ?? "",
                    });
                    setIsEditing(false);
                  }}
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
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title">Licencias del conductor</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Cerrar"
              />
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
                            <td>{license.tipo || "-"}</td>
                            <td>{formatDate(license.fechaEmision)}</td>
                            <td>{formatDate(license.fechaVencimiento)}</td>
                            <td>
                              <span
                                className={`badge ${
                                  active ? "bg-success" : "bg-danger"
                                }`}
                              >
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

      {/* Backdrop del modal */}
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </>
  );
}

/* =========================================================
   PÁGINA PRINCIPAL
   ========================================================= */

export default function PerfilConductor() {
  const queryClient = useQueryClient();
  const [showLicensesModal, setShowLicensesModal] = useState(false);

  /* =========================================================
     REACT QUERY - GET PROFILE
     =========================================================
     ESTE ES EL LUGAR DONDE TENÉS QUE CONECTAR EL BACKEND
     
     Reemplazá esta función por un fetch/axios a tu API real.
     Ejemplo:
       const response = await fetch("/api/drivers/me", {
         headers: { Authorization: `Bearer ${token}` }
       });
       return response.json();
  */
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["driver-profile"],
    queryFn: async () => {
      // ============================
      // BACKEND: GET perfil conductor
      // ============================
      // TODO: reemplazar por tu llamada real al backend
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        email: "juan.perez@tren.com",
        // En producción normalmente NO se trae la password.
        // Acá se usa solo de ejemplo visual.
        password: "123456",
        licencias: [
          {
            id: 101,
            tipo: "Carga pesada",
            fechaEmision: "2025-01-15",
            fechaVencimiento: "2027-12-31",
          },
          {
            id: 88,
            tipo: "Regional",
            fechaEmision: "2024-01-10",
            fechaVencimiento: "2024-12-31",
          },
        ],
      };
    },
  });

  /* =========================================================
     REACT QUERY - UPDATE FIELD
     =========================================================
     ESTE ES EL LUGAR DONDE TENÉS QUE CONECTAR EL BACKEND
     
     Reemplazá esta mutation por un PUT/PATCH real.
     Podés mandar:
       { field: "nombre", value: "Nuevo Nombre" }
     o el formato que tu API espere.
  */
  const updateFieldMutation = useMutation({
    mutationFn: async ({ field, value }) => {
      // ============================
      // BACKEND: PATCH/PUT perfil
      // ============================
      // TODO: reemplazar por tu llamada real al backend
      // Ejemplo:
      // return fetch(`/api/drivers/me`, {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify({ [field]: value }),
      // }).then((res) => res.json());

      await new Promise((resolve) => setTimeout(resolve, 500));

      return { field, value };
    },
    onSuccess: (_result, variables) => {
      // Refresca / actualiza el cache local del perfil
      queryClient.setQueryData(["driver-profile"], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          [variables.field]: variables.value,
        };
      });
    },
  });

  /* =========================================================
     TOOLTIPS DE BOOTSTRAP
     =========================================================
     Hook para inicializar el tooltip del email.
  */
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );

    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );

    return () => {
      tooltipList.forEach((tooltip) => tooltip.dispose());
    };
  }, [user]);

  /* =========================================================
     DATOS DERIVADOS
     ========================================================= */
  const latestLicense = useMemo(() => {
    return getLatestLicense(user?.licencias || []);
  }, [user]);

  const hasActiveLicense = useMemo(() => {
    return isLicenseActive(latestLicense);
  }, [latestLicense]);

  /* =========================================================
     HANDLER GENÉRICO PARA GUARDAR CAMPOS
     ========================================================= */
  const handleSaveField = async (field, value) => {
    await updateFieldMutation.mutateAsync({ field, value });
  };

  /* =========================================================
     ESTADOS DE CARGA / ERROR
     ========================================================= */
  if (isLoading) {
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

  if (isError) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          Ocurrió un error al cargar el perfil.
          <br />
          <small>{error?.message || "Error desconocido"}</small>
        </div>
      </div>
    );
  }

  /* =========================================================
     AVATAR CON INICIALES (ya que no hay foto)
     ========================================================= */
  const initials = `${user?.nombre?.[0] || ""}${user?.apellido?.[0] || ""}`.toUpperCase();

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
                  style={{
                    width: "90px",
                    height: "90px",
                    fontSize: "2rem",
                    flexShrink: 0,
                  }}
                >
                  {initials || "U"}
                </div>

                <div className="text-center text-md-start w-100">
                  <h1 className="h2 fw-bold mb-2">
                    Bienvenido a tu perfil, {user.nombre}
                  </h1>
                  <p className="text-muted mb-0">
                    Desde aquí podés consultar y editar la información de tu cuenta.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email - primer atributo luego del título */}
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
                    {user.email}
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
            value={user.nombre}
            inputType="text"
            placeholder="Ingresá tu nombre"
            onSave={handleSaveField}
          />

          {/* Apellido */}
          <EditableField
            label="Apellido"
            fieldName="apellido"
            value={user.apellido}
            inputType="text"
            placeholder="Ingresá tu apellido"
            onSave={handleSaveField}
          />

          {/* Password */}
          <EditableField
            label="Password"
            fieldName="password"
            value={user.password}
            inputType="password"
            placeholder="Ingresá tu nueva contraseña"
            onSave={handleSaveField}
            isPassword
          />

          {/* Licencias - último atributo */}
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                  <p className="text-muted mb-1 fw-semibold">Licencias</p>

                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <span
                      className={`badge px-3 py-2 fs-6 ${
                        hasActiveLicense ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {hasActiveLicense
                        ? "Licencia activa"
                        : "Sin licencia activa"}
                    </span>

                    {latestLicense && (
                      <small className="text-muted">
                        Último vencimiento: {formatDate(latestLicense.fechaVencimiento)}
                      </small>
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
        </div>
      </div>

      {/* Modal de licencias */}
      <LicensesModal
        show={showLicensesModal}
        onClose={() => setShowLicensesModal(false)}
        licenses={user?.licencias || []}
      />
    </div>
  );
}
