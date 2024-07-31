import Layout from "@/pages/Layout";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

const ErrorPage = ({
	showHeader = false,
	errorCode,
	errorMessage,
}: {
	showHeader?: boolean;
	errorCode?: number;
	errorMessage?: string;
}) => {
	const error = useRouteError();

	if (!errorCode || !errorMessage) {
		errorCode = 500;
		errorMessage = "Sorry, an unknown error has occurred.";
	}

	if (isRouteErrorResponse(error)) {
		console.log(error);

		errorCode = error.status;
		errorMessage = error.statusText;
	}

	if (!showHeader) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center gap-4">
				<h1 className="anton-regular text-9xl">{errorCode}</h1>
				<p className="text-3xl font-semibold">{errorMessage}</p>
				<Link to="/" className="solid-btn">
					Go back to home
				</Link>
			</div>
		);
	}

	return (
		<Layout>
			<div className="flex flex-1 flex-col items-center justify-center gap-4">
				<h1 className="anton-regular text-9xl">{errorCode}</h1>
				<p className="text-3xl font-semibold">{errorMessage}</p>
				<Link to="/" className="solid-btn">
					Go back to home
				</Link>
			</div>
		</Layout>
	);
};

export default ErrorPage;
