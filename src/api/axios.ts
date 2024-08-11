import { BASE_URL } from "@/utils/variables";
import axios from "axios";

export default axios.create({
	baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});
