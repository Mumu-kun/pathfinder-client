import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";

const RequireAuth: React.FC = () => {
	const { auth } = useContext(AuthContext);
	const refresh = useRefreshToken();
	const location = useLocation();

	const [loading, setLoading] = useState<Boolean>(true);

	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		if (!auth?.accessToken) {
			console.log("No access token");

			verifyRefreshToken();
		} else {
			console.log(auth);
			setLoading(false);
		}
	}, []);

	return (
		<>
			{loading ? (
				<div>Loading...</div>
			) : !!auth?.accessToken ? (
				<Outlet />
			) : (
				<Navigate to="/login" replace state={{ from: location.pathname }} />
			)}
		</>
	);
};

export default RequireAuth;
