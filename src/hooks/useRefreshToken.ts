import useAuth from "./useAuth";
import axios from "../api/axios";
import { REFRESH_TOKEN_URL } from "../utils/variables";

const useRefreshToken = () => {
	const { auth, setAuth } = useAuth();

	const refresh = async () => {
		try {
			const res = await axios.post(
				REFRESH_TOKEN_URL,
				{},
				{
					withCredentials: true,
				}
			);

			console.log(res);

			setAuth((prev: any) => {
				return {
					...prev,
					accessToken: res?.data?.access_token,
					refreshToken: res?.data?.refresh_token,
				};
			});

			return res?.data?.access_token;
		} catch (error) {
			console.error(error);
		}
	};

	return refresh;
};

export default useRefreshToken;
