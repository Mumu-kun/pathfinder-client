import { BASE_URL } from "@/utils/variables";
import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

export default setupCache(
	axios.create({
		baseURL: BASE_URL,
	})
);

export const axiosPrivate = setupCache(
	axios.create({
		baseURL: BASE_URL,
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
	})
);
