import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Outlet, useNavigate } from "react-router-dom";

const RedirectIfLoggedIn: React.FC = () => {
	const { auth } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!!auth?.accessToken) {
			navigate(-1);
			return;
		}
	}, [auth]);

	return <Outlet />;
};

export default RedirectIfLoggedIn;
