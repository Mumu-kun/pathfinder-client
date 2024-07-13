import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RequireAuth from "./components/RequireAuth.tsx";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import Layout from "./pages/Layout.tsx";
import TestPage from "./pages/TestPage.tsx";
import PersistLogin from "./components/PersistLogin.tsx";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn.tsx";
import Home from "./pages/Home/Home.tsx";
import { useEffect, useState } from "react";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				element: <PersistLogin />,
				children: [
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
	const [theme, setTheme] = useState<string | null>(localStorage.getItem("theme"));

	useEffect(() => {
		document.body.classList.remove("light", "dark");
		if (theme !== "" && theme !== null) {
			document.body.classList.add(theme);
		}
	}, [theme]);
	return <RouterProvider router={router} />;
}

export default App;
