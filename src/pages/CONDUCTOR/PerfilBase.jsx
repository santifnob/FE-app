import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as bootstrap from "bootstrap";
import { ConductorGetOne } from "../../hooks/conductor/useConductorQuery";
import { useConductorPut } from "../../hooks/conductor/useConductorPut";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { LoadingScreen } from "../../components/shared/LoadingScreen.jsx";

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
  if (!license) return 'Sin licencia';

  if (!license?.fechaVencimiento) return 'Sin fecha de vencimiento';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expirationDate = normalizeDate(license.fechaVencimiento);

  if((expirationDate >= today) && (license.estado === "Activo")) {
    return 'Activa';
  }
  if(license.estado === "Inactivo") {
    return 'Suspendida';
  }
  return 'Vencida';
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
  } = useForm({
    defaultValues: { value: "" },
  });

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
        <div>
          <label className="form-label fw-semibold">{label}</label>

          <div className="d-flex align-items-center justify-content-between gap-3">
            <div className="form-control bg-light">
              {isPassword ? "••••••••" : value ?? "-"}
            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setIsEditing(true)}
            >
              Modificar
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(submitHandler)}>
          <label className="form-label fw-semibold">{label}</label>

          <div className="d-flex align-items-start gap-2">
            <div className="flex-grow-1">
              <input
                type={inputType}
                className={`form-control ${errors.value ? "is-invalid" : ""}`}
                placeholder={placeholder}
                {...register("value", rules)}
              />

              {errors.value && (
                <div className="invalid-feedback">{errors.value.message}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting}
            >
              Guardar
            </button>

            <button
              type="button"
              className="btn btn-secondary"
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
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Licencias del conductor</h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              {licenses.length === 0 ? (
                <p className="text-muted mb-0">
                  Este conductor no posee licencias registradas.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle text-center">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th className="text-center">Fecha de hecho</th>
                        <th className="text-center">Fecha de vencimiento</th>
                        <th className="text-center">Vigencia</th>
                      </tr>
                    </thead>

                    <tbody>
                      {licenses.map((license) => {
                        const status = isLicenseActive(license);

                        const statusColors = {
                          "Activa": "bg-success",
                          "Vencida": "bg-warning",
                          "Suspendida": "bg-danger",
                        };

                        return (
                          <tr key={license.id}>
                            <td>{license.id}</td>
                            <td>{formatDate(license.fechaHecho)}</td>
                            <td>{formatDate(license.fechaVencimiento)}</td>
                            <td>
                              <span
                                className={`badge ${statusColors[status]}`}
                                style={{ minWidth: "100px", display: "inline-block" }}
                              >
                                {status}
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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" />
    </>
  );
}

/* =================== PERFIL =================== */

export default function PerfilConductor() {
  const queryClient = useQueryClient();
  const [showLicensesModal, setShowLicensesModal] = useState(false);

  const { user: currentUser, isLoading: isAuthLoading } = useCurrentUser();

  const conductorPut = useConductorPut();

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = ConductorGetOne(currentUser?.id);

  const updateField = async ({ field, value }) => {
    const editableFields = ["nombre", "apellido", "password"];

    if (!editableFields.includes(field)) {
      throw new Error("Campo no permitido para edición.");
    }

    if (!user) {
      throw new Error("No se encontró el conductor actual.");
    }

    const conductorId = user?.id ?? currentUser?.id;

    if (!conductorId) {
      throw new Error("No se encontró el ID del conductor.");
    }

    const updatedConductor = {
      ...user,
      id: conductorId,
      [field]: value,
    };

    await conductorPut.mutateAsync(updatedConductor);

    return updatedConductor;
  };

  const updateFieldMutation = useMutation({
    mutationFn: updateField,
    onSuccess: (updatedConductor, variables) => {
      queryClient.setQueryData(
        ["driver-profile", currentUser.id],
        (oldData) => {
          if (!oldData) return updatedConductor;

          return {
            ...oldData,
            [variables.field]: variables.value,
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["conductor", currentUser.id],
      });
    },
  });

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
    () => isLicenseActive(latestLicense) === 'Activa',
    [latestLicense]
  );

  const handleSaveField = async (field, value) => {
    await updateFieldMutation.mutateAsync({ field, value });
  };

  if (!currentUser?.id) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          No hay usuario autenticado (idUser vacío).
        </div>
      </div>
    );
  }

  if (isAuthLoading || isLoading) {
    return <LoadingScreen title='Cargando perfil...' subtitle='Un momento por favor' />
  }

  if (isError) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          Ocurrió un error al cargar el perfil.
          <br />
          {error?.message || "Error desconocido"}
        </div>
      </div>
    );
  }

  const initials = `${user?.nombre?.[0] || ""}${
    user?.apellido?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: 64, height: 64, fontSize: 24 }}
            >
              {initials || "U"}
            </div>

            <div>
              <h3 className="mb-1">Bienvenido a tu perfil, {user?.nombre}</h3>
              <p className="text-muted mb-0">
                Desde aquí podés consultar y editar la información de tu cuenta.
              </p>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>

            <div className="d-flex align-items-center justify-content-between gap-3">
              <div className="form-control bg-light">{user?.email}</div>

              <span className="badge bg-secondary">No editable</span>
            </div>
          </div>

          <EditableField
            label="Nombre"
            fieldName="nombre"
            value={user?.nombre}
            placeholder="Ingresá tu nombre"
            onSave={handleSaveField}
            rules={{
              required: "El nombre es obligatorio.",
            }}
          />

          <EditableField
            label="Apellido"
            fieldName="apellido"
            value={user?.apellido}
            placeholder="Ingresá tu apellido"
            onSave={handleSaveField}
            rules={{
              required: "El apellido es obligatorio.",
            }}
          />

          <EditableField
            label="Contraseña"
            fieldName="password"
            inputType="password"
            placeholder="Ingresá tu nueva contraseña"
            onSave={handleSaveField}
            isPassword
            rules={{
              required: "La contraseña es obligatoria.",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres.",
              },
            }}
          />

          <div className="mb-3">
            <label className="form-label fw-semibold">Licencias</label>

            <div className="d-flex align-items-center justify-content-between gap-3">
              <div className="form-control bg-light">
                <span
                  className={`badge ${
                    hasActiveLicense ? "bg-success" : "bg-danger"
                  } me-2`}
                >
                  {hasActiveLicense ? "Licencia activa" : "Sin licencia activa"}
                </span>

                {latestLicense && (
                  <span className="text-muted">
                    (Último vencimiento:{" "}
                    {formatDate(latestLicense.fechaVencimiento)})
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
        </div>
      </div>

      <LicensesModal
        show={showLicensesModal}
        onClose={() => setShowLicensesModal(false)}
        licenses={user?.licencias || []}
      />
    </div>
  );
}