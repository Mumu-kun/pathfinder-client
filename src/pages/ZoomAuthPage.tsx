import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ZoomAuthPage: React.FC = () => {
	const axiosPrivate = useAxiosPrivate();

	const { search } = useLocation();
	const queryParams = new URLSearchParams(search);

	console.log(queryParams.get("code"));

	const sendAuthCode = async () => {
		try {
			const res = await axiosPrivate.post("api/v1/zoom/auth-code", queryParams.get("code"), {
				headers: {
					"Content-Type": "text/plain",
				},
			});

			console.log(res);
		} catch (error) {
			console.error(error);
		} finally {
			window.close();
		}
	};

	useEffect(() => {
		sendAuthCode();
	}, [queryParams]);

	return null;
};

export default ZoomAuthPage;
