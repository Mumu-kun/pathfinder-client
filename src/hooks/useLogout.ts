import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "./useAuth";
import { isAxiosError } from "axios";

const useLogout = () => {
	const { setAuth } = useAuth();
	const navigate = useNavigate();

	const logout = async () => {
		localStorage.removeItem("persist_login");
		localStorage.removeItem("auth");
		setAuth(null);

		console.log("Logging out");

		try {
			await axios("/api/v1/auth/logout", {
				withCredentials: true,
			});

			navigate(0);
		} catch (error) {
			if (isAxiosError(error) && error.response?.status === 404) {
				return;
			}
			console.error(error);
		}
	};

	return logout;
};

export default useLogout;
