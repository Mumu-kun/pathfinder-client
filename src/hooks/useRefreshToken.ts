import axios from "../api/axios";
import { REFRESH_TOKEN_URL } from "../utils/variables";
import useAuth from "./useAuth";

const useRefreshToken = () => {
	const { setAuth } = useAuth();

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
		} catch (error) {
			console.error(error);
		}
	};

	return refresh;
};

export default useRefreshToken;
