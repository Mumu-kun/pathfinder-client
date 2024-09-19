import axios from "../api/axios";
import { REFRESH_TOKEN_URL } from "../utils/variables";
import useAuth from "./useAuth";
import useLogout from "./useLogout";

const useRefreshToken = () => {
	const { setAuth } = useAuth();
	const logout = useLogout();

	const refresh = async () => {
		try {
			const res = await axios.post(
				REFRESH_TOKEN_URL,
				{},
				{
					withCredentials: true,
				}
			);

			setAuth(res.data);
			return res?.data?.accessToken;
		} catch (error) {
			logout();
			console.error(error);
		}
	};

	return refresh;
};

export default useRefreshToken;
