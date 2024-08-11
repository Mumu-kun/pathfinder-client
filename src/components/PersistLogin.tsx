import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { Outlet } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import Loading from "./Loading";

const PersistLogin: React.FC = () => {
	const { auth, persist, setAuth } = useAuth();
	const refresh = useRefreshToken();
	const logout = useLogout();

	const [loading, setLoading] = useState<Boolean>(true);

	useEffect(() => {
		let isMounted = true;

		const reLogin = async () => {
			try {
				let localAuth = localStorage.getItem("auth");
				localAuth = localAuth ? JSON.parse(localAuth) : null;
				setAuth(localAuth);

				if (auth === null) {
					await refresh();
				}
			} catch (err) {
				console.error(err);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		if (!auth) {
			if (!persist) {
				logout();
				setLoading(false);
			} else {
				reLogin();
			}
		} else {
			if (isMounted) {
				setLoading(false);
			}
		}

		return () => {
			isMounted = false;
		};
	}, []);

	if (!persist) {
		return <Outlet />;
	}

	if (loading) {
		return <Loading fullscreen />;
	}

	return <Outlet />;
};

export default PersistLogin;
