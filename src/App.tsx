import { useContext, useState } from "react";
import Login from "./pages/Login/Login";
import AuthContext from "./context/AuthProvider";
import { Link, RouterProvider, createBrowserRouter } from "react-router-dom";
import RequireAuth from "./components/RequireAuth.tsx";
import Layout from "./pages/Layout.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <div>Home</div>,
			},
			{
				path: "login",
				element: <Login />,
			},
			{
				element: <RequireAuth />,
				children: [
					{
						path: "test",
						element: (
							<button>
								<Link to="/login">login</Link>
							</button>
						),
					},
				],
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
