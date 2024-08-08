import { lazy, Suspense, useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PersistLogin from "./components/PersistLogin.tsx";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn.tsx";
import RequireAuth from "./components/RequireAuth.tsx";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import Gig from "./pages/Gig/GigPage.tsx";
import Home from "./pages/Home/Home.tsx";
import Layout from "./pages/Layout.tsx";
import TestPage from "./pages/TestPage.tsx";

import ChatPage from "./pages/Chat/ChatPage.tsx";

import ErrorPage from "./components/ErrorPage.tsx";
import Loading from "./components/Loading.tsx";

const Profile = lazy(() => import("@/pages/Profile/Profile.tsx"));

const router = createBrowserRouter([
	{
		element: <Layout />,
		errorElement: <ErrorPage showHeader />,
		children: [
			{
				element: <PersistLogin />,
				errorElement: <ErrorPage />,
				children: [
					{
						path: "/",
						element: <Home />,
					},
					{
						path: "gig/:id",
						element: <Gig />,
					},
					{
						path: "interaction/user/:id",
						element: <ChatPage />,
					},

					{
						path: "profile/:userId?",
						element: (
							<Suspense fallback={<Loading fullscreen />}>
								<Profile />
							</Suspense>
						),
					},
					{
						element: <RedirectIfLoggedIn />,
						children: [
							{
								path: "login",
								element: <Login />,
							},
							{
								path: "register",
								element: <Register />,
							},
						],
					},
					{
						element: <RequireAuth />,
						children: [
							{
								path: "test",
								element: <TestPage />,
							},
						],
					},
				],
			},
		],
	},
]);

function App() {
	// this code is in app.tsx because we want to know the theme all over the app.
	const [theme] = useState<string | null>(localStorage.getItem("theme"));

	useEffect(() => {
		document.body.classList.remove("light", "dark");
		if (theme !== "" && theme !== null) {
			document.body.classList.add(theme);
		}
	}, [theme]);

	return <RouterProvider router={router} />;
}

export default App;
