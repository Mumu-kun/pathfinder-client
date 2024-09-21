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

export const axiosZoom = axios.create({
	baseURL: "https://api.zoom.us/v2",
	headers: {
		"Content-Type": "application/json",
	},
});
