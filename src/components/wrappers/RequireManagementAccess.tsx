import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireManagementAccess: React.FC = () => {
	const { auth } = useAuth();
	const location = useLocation();

	// if (!auth?.accessToken) {
	// 	return <Navigate to="/login" replace state={{ from: location.pathname }} />;
	// }

	if (auth?.role === "ADMIN" || auth?.role === "MANAGER") {
		return <Outlet />;
	} else {
		return <Navigate to="/" replace state={{ from: location.pathname }} />;
	}
};

export default RequireManagementAccess;
