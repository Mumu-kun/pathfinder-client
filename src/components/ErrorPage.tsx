import React from "react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

const ErrorPage: React.FC = () => {
	const error = useRouteError();

	let errorCode = 500;
	let errorMessage = "Sorry, an unknown error has occurred.";

	if (isRouteErrorResponse(error)) {
		errorCode = error.status;
		errorMessage = error.statusText;
	}

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4">
			<h1 className="anton-regular text-9xl">{errorCode}</h1>
			<p className="text-3xl font-semibold">{errorMessage}</p>
			<Link to="/" className="solid-btn">
				Go back to home
			</Link>
		</div>
	);
};

export default ErrorPage;
