import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
	const { setAuth } = useAuth();

	const logout = async () => {
		localStorage.removeItem("persist_login");
		setAuth({});
		try {
			await axios("/api/v1/auth/logout", {
				withCredentials: true,
			});
		} catch (error) {
			console.error(error);
		}
	};

	return logout;
};

export default useLogout;
