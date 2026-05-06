import { Badge } from "react-bootstrap";
import DashboardCardShell from "../../dashboard/DashboardCardShell.jsx";
import { useCurrentUser } from '../../../hooks/useCurrentUser.js';
import { useConductorLastLicense } from "../../../hooks/analytics/useConductorLastLicense.js";

export default function ConductorLastLicenseWidget() {
    const { user, isLoading: userLoading } = useCurrentUser();
    const { data: licencia, isLoading, isError, error } = useConductorLastLicense(user?.id);

    // Función para determinar el estado y color de la licencia
    const getLicenseStatus = (licencia) => {
        if (!licencia) return { variant: 'secondary', text: 'Sin datos', isNearExpiry: false };

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const vencimiento = new Date(licencia.fechaVencimiento);
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        let variant = 'secondary';
        let text = licencia.estado || 'Desconocido';
        let isNearExpiry = false;

        if (licencia.estado === 'Activo') {
            if (vencimiento >= today) {
                // Activa - verificar si vence en menos de 30 días
                if (vencimiento <= thirtyDaysFromNow) {
                    variant = 'warning'; // Amarillo si vence pronto
                    text = 'Activa (Vence pronto)';
                    isNearExpiry = true;
                } else {
                    variant = 'success'; // Verde si está bien
                    text = 'Activa';
                }
            } else {
                variant = 'warning'; // Amarillo si ya venció
                text = 'Vencida';
            }
        } else if (licencia.estado === 'Inactivo') {
            variant = 'danger';
            text = 'Suspendida';
        }

        return { variant, text, isNearExpiry };
    };

    const licenseStatus = getLicenseStatus(licencia);

    return (
        <DashboardCardShell
            title="Última Licencia"
            subtitle="Estado y vencimiento de la ultima licencia registrada"
            badge={licencia ? "Licencia" : "Sin datos"}
            loading={isLoading || userLoading}
            error={isError ? error : null}
            fallback={!licencia && !isLoading && !userLoading && !isError ? (
                <div className="text-center text-muted py-5">No hay datos de licencias disponibles.</div>
            ) : null}
        >
            {licencia && (
                <div className="license-details">
                    <div className="mb-3">
                        <strong>Número:</strong> {licencia.id || 'N/A'}
                    </div>
                    <div className="mb-3">
                        <strong>Fecha de emisión:</strong> {licencia.fechaHecho ? new Date(licencia.fechaHecho).toLocaleDateString('es-AR') : 'N/A'}
                    </div>
                    <div className="mb-3">
                        <strong>Fecha de vencimiento:</strong> {new Date(licencia.fechaVencimiento).toLocaleDateString('es-AR')}
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <strong>Estado:</strong>
                        <Badge
                            bg={licenseStatus.variant}
                            style={{
                                pointerEvents: 'none',
                                minWidth: '140px',
                                textAlign: 'center',
                                fontWeight: '500'
                            }}
                        >
                            {licenseStatus.text}
                        </Badge>
                    </div>
                    {licenseStatus.isNearExpiry && (
                        <div className="mt-3 p-2 bg-warning bg-opacity-10 border border-warning rounded">
                            <small className="text-warning">
                                ⚠️ La licencia vence en menos de 30 días. Considere renovarla.
                            </small>
                        </div>
                    )}
                </div>
            )}
        </DashboardCardShell>
    );
}