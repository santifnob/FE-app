import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../hooks/useCurrentUser.js";
import { ConductorGetOne } from "../../hooks/conductor/useConductorQuery.js";

export default function ConductorBadgeProfile() {
  const navigate = useNavigate();
  const { user: currentUser, isLoading: isAuthLoading, isError: isAuthError } = useCurrentUser();

  const { data: conductorData, isLoading, isError } = ConductorGetOne(currentUser?.id);

  if (isAuthLoading || isLoading || isAuthError || isError) {
    return null;
  }

  const initials = `${conductorData?.nombre?.[0] || ""}${conductorData?.apellido?.[0] || ""}`.toUpperCase();

  return (
    <Link
      to="/conductor/perfil"
      onClick={(e) => {
        e.preventDefault();
        navigate("/conductor/perfil");
      }}
      className="user-info position-fixed d-flex align-items-center"
      style={{
        top: "20px",
        right: "20px",
        zIndex: 1000,
        cursor: "pointer",
        textDecoration: "none",
        backgroundColor: "white",
        padding: "10px 15px",
        borderRadius: "50px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
    >
      <span className="user-name me-2">
        {conductorData?.nombre} {conductorData?.apellido}
      </span>
      <div
        className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
        style={{ width: "40px", height: "40px" }}
      >
        {initials}
      </div>
    </Link>
  );
}
