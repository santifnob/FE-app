import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as bootstrap from "bootstrap";
import { ConductorGetOne } from "../../hooks/conductor/useConductorQuery";
import { conductorGetOneAsync } from "../../hooks/conductor/useConductorQuery";
import { useConductorPut } from "../../hooks/conductor/useConductorPut";
import { useCurrentUser } from "../../hooks/useCurrentUser";

/* ===================== HELPERS ====================== */
function normalizeDate(dateValue) {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return date;
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expirationDate = normalizeDate(license.fechaVencimiento);
  return expirationDate >= today;
}

function formatDate(dateValue) {
  if (!dateValue) return "-";
  return new Intl.DateTimeFormat("es-AR").format(new Date(dateValue));
}

/* ================== EditableField =================== */
function EditableField({
  label,
  fieldName,
  value,
  inputType = "text",
  placeholder,
  onSave,
  isPassword = false,
  rules,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { value: "" } });

  useEffect(() => {
    reset({ value: isPassword ? "" : value ?? "" });
  }, [value, reset, isPassword]);

  const submitHandler = async (data) => {
    await onSave(fieldName, data.value);
    setIsEditing(false);
  };

  return (
    <div className="mb-3">
      {!isEditing ? (
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div className="flex-grow-1">
            <div className="text-muted small">{label}</div>
            <div className="fw-semibold">
              {isPassword ? "••••••••" : value ?? "-"}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => setIsEditing(true)}
          >
            Modificar
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="text-muted small">{label}</div>

          <div className="d-flex align-items-start gap-2">
            <div className="flex-grow-1">
              <input
                type={inputType}
                className={`form-control ${errors.value ? "is-invalid" : ""}`}
                placeholder={placeholder}
                {...register("value", {
                  required: "Este campo es obligatorio",
                  ...(rules || {}),
                })}
              />
              {errors.value && (
                <div className="invalid-feedback">{errors.value.message}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Guardar
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                reset({ value: isPassword ? "" : value ?? "" });
                setIsEditing(false);
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ================= LicensesModal =================== */
function LicensesModal({ show, onClose, licenses = [] }) {
  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" />

      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Licencias del conductor</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              {licenses.length === 0 ? (
                <div className="alert alert-info mb-0">
                  Este conductor no posee licencias registradas.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm align-middle">
                    <thead>
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
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =================== PERFIL =================== */
export default function PerfilConductor() {
  const queryClient = useQueryClient();
  const [showLicensesModal, setShowLicensesModal] = useState(false);

  // ✅ Obtenemos el usuario del contexto de autenticación
  const { user: currentUser, isLoading: isAuthLoading } = useCurrentUser();

  // ✅ Inicializamos el hook de PUT
  const conductorPut = useConductorPut();

  /* =========================================================
     ✅ 1) GET PERFIL (React Query)
     - key incluye idUser para cache correcto
     - enabled evita ejecutar hasta tener idUser
  ========================================================= */
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = ConductorGetOne(currentUser?.id);

  /* =========================================================
     ✅ 2) UPDATE CAMPO (Mutation)
     REEMPLAZÁ esta función por tu PUT real si no usás useConductorPut
  ========================================================= */
  const updateField = async ({ field, value }) => {
    // ✅ OPCIÓN A: si tenés función directa
    // return ConductorUpdateField({ idUser, field, value });

    // ✅ OPCIÓN B: si useConductorPut es un hook que devuelve { mutateAsync }
    if (conductorPut?.mutateAsync) {
      return conductorPut.mutateAsync({ idUser: currentUser.id, field, value });
    }

    // ✅ OPCIÓN C: si useConductorPut devuelve una función directamente
    if (typeof conductorPut === "function") {
      return conductorPut({ idUser: currentUser.id, field, value });
    }

    throw new Error(
      "No se encontró implementación de updateField. Conectá tu PUT real."
    );
  };

  const updateFieldMutation = useMutation({
    mutationFn: updateField,
    onSuccess: (result, variables) => {
      // ✅ ARREGLADO: faltaba el "||"
      const maybeUser = result?.user || result;

      queryClient.setQueryData(["driver-profile", currentUser.id], (oldData) => {
        if (!oldData) return oldData;

        // Si el backend devuelve el usuario completo (o conductor completo)
        if (maybeUser && typeof maybeUser === "object") {
          // Si tiene nombre/email/licencias, lo tratamos como objeto válido:
          if ("nombre" in maybeUser || "email" in maybeUser || "licencias" in maybeUser) {
            return maybeUser;
          }
        }

        // Si solo devuelve confirmación
        return { ...oldData, [variables.field]: variables.value };
      });
    },
  });

  /* ============ Tooltips bootstrap ============ */
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (el) => new bootstrap.Tooltip(el)
    );
    return () => tooltipList.forEach((t) => t.dispose());
  }, [user]);

  const latestLicense = useMemo(
    () => getLatestLicense(user?.licencias || []),
    [user]
  );
  const hasActiveLicense = useMemo(
    () => isLicenseActive(latestLicense),
    [latestLicense]
  );

  const handleSaveField = async (field, value) => {
    await updateFieldMutation.mutateAsync({ field, value });
  };
  
  if (!currentUser?.id) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning mb-0">
          No hay usuario autenticado (idUser vacío).
        </div>
      </div>
    );
  }

  if (isAuthLoading || isLoading) {
    return (
      <div className="container py-4">
        <div className="alert alert-secondary mb-0">Cargando...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          Ocurrió un error al cargar el perfil.
          <div className="small mt-2">{error?.message || "Error desconocido"}</div>
        </div>
      </div>
    );
  }

  const initials = `${currentUser?.nombre?.[0] || ""}${currentUser?.apellido?.[0] || ""}`.toUpperCase();

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div
          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
          style={{ width: 56, height: 56, fontWeight: 700, fontSize: 18 }}
        >
          {initials || "U"}
        </div>

        <div>
          <h2 className="mb-0">Bienvenido a tu perfil, {user?.nombre}</h2>
          <div className="text-muted">
            Desde aquí podés consultar y editar la información de tu cuenta.
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-muted small">Email</div>
        <div className="d-flex align-items-center gap-2">
          <div className="fw-semibold">{currentUser?.email}</div>
          <span
            className="badge bg-secondary"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="No editable"
          >
            No editable
          </span>
        </div>
      </div>

      <EditableField
        label="Nombre"
        fieldName="nombre"
        value={currentUser?.nombre}
        placeholder="Ingresá tu nombre"
        onSave={handleSaveField}
      />

      <EditableField
        label="Apellido"
        fieldName="apellido"
        value={currentUser?.apellido}
        placeholder="Ingresá tu apellido"
        onSave={handleSaveField}
      />

      <EditableField
        label="Contraseña"
        fieldName="password"
        value={currentUser?.password}
        inputType="password"
        placeholder="Ingresá una nueva contraseña"
        onSave={handleSaveField}
        isPassword
        rules={{
          minLength: { value: 6, message: "Mínimo 6 caracteres" },
        }}
      />

      <div className="mb-3">
        <div className="text-muted small">Licencias</div>

        <div className="d-flex align-items-center justify-content-between gap-3">
          <div className="fw-semibold">
            {hasActiveLicense ? "Licencia activa" : "Sin licencia activa"}{" "}
            {latestLicense && (
              <span className="text-muted fw-normal">
                (Último vencimiento: {formatDate(latestLicense.fechaVencimiento)})
              </span>
            )}
          </div>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setShowLicensesModal(true)}
          >
            Licencias
          </button>
        </div>
      </div>

      <LicensesModal
        show={showLicensesModal}
        onClose={() => setShowLicensesModal(false)}
        licenses={currentUser?.licencias || []}
      />
    </div>
  );
}