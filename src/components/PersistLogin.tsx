import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { Outlet } from "react-router-dom";
import useLogout from "../hooks/useLogout";

const PersistLogin: React.FC = () => {
	const { auth, persist } = useAuth();
	const refresh = useRefreshToken();
	const logout = useLogout();

	console.log(persist);

	const [loading, setLoading] = useState<Boolean>(true);

	useEffect(() => {
		let isMounted = true;

		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (err) {
				console.error(err);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		if (!auth?.accessToken) {
			if (!persist) {
				logout();
				setLoading(false);
			} else {
				verifyRefreshToken();
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
		return <div>Loading...</div>;
	}

	return <Outlet />;
};

export default PersistLogin;
