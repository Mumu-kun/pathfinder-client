import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RedirectIfLoggedIn from "./components/wrappers/RedirectIfLoggedIn.tsx";
import RequireAuth from "./components/wrappers/RequireAuth.tsx";
import RequireManagementAccess from "./components/wrappers/RequireManagementAccess.tsx";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import Home from "./pages/Home/Home.tsx";
import Layout from "./pages/Layout.tsx";

import ChatPage from "./pages/Chat/ChatPage.tsx";

import ErrorPage from "./components/ErrorPage.tsx";
import Loading from "./components/Loading.tsx";
import SetMode from "./components/wrappers/SetMode.tsx";
import PaymentStatus from "./pages/Chat/components/PaymentStatus.tsx";
import EnrollmentDetails from "./pages/EnrollmentDetails/EnrollmentDetails.tsx";
import FilterPage from "./pages/Filter/FilterPage.tsx";
import ManageGigs from "./pages/SellerPages/ManageGigs/ManageGigs.tsx";
import Recommendations from "./pages/Filter/Recommendations.tsx";
import EmailNotVerified from "./pages/Auth/EmailNotVerified.tsx";
import VerifyEmail from "./pages/Auth/VerifyEmail.tsx";
import Reports from "./pages/Management/Reports.tsx";
import UnacceptedGigs from "./pages/Management/UnacceptedGigs.tsx";
import ManagementDashboard from "./pages/Management/ManagementDashboard.tsx";

const Profile = lazy(() => import("@/pages/Profile/Profile.tsx"));
const Settings = lazy(() => import("@/pages/Settings/Settings.tsx"));
const GigPage = lazy(() => import("@/pages/Gig/GigPage.tsx"));
const GigFormPage = lazy(() => import("@/pages/SellerPages/ManageGigs/GigFormPage.tsx"));

const router = createBrowserRouter([
	{
		element: <Layout />,
		errorElement: <ErrorPage showHeader />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "gig/:id",
				element: (
					<Suspense fallback={<Loading fullscreen />}>
						<GigPage />
					</Suspense>
				),
			},
			{
				path: "filter",
				element: <FilterPage />,
			},
			{
				path: "recommendations/*",
				element: <Recommendations />,
			},
			{
				path: "profile/:userId",
				element: (
					<Suspense fallback={<Loading fullscreen />}>
						<Profile />
					</Suspense>
				),
			},
			{
				path: "email-not-verified/:email",
				element: <EmailNotVerified />,
			},
			{
				path: "verify-email",
				element: <VerifyEmail />,
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
						path: "enrollment/details/:enrollmentId",
						element: <EnrollmentDetails />,
					},

					{
						path: "payment/success",
						element: <PaymentStatus status="success" />,
					},
					{
						path: "payment/fail",
						element: <PaymentStatus status="fail" />,
					},
					{
						path: "payment/cancel",
						element: <PaymentStatus status="cancel" />,
					},
					{
						path: "profile",
						element: (
							<Suspense fallback={<Loading fullscreen />}>
								<Profile />
							</Suspense>
						),
					},
					{
						path: "settings/:tab?",
						element: (
							<Suspense fallback={<Loading fullscreen />}>
								<Settings />
							</Suspense>
						),
					},

					{
						element: <SetMode mode={"seller"} />,
						children: [
							{
								path: "manage/gigs",
								children: [
									{
										path: "",
										element: <ManageGigs />,
									},
									{
										path: "create",
										element: (
											<Suspense fallback={<Loading fullscreen />}>
												<GigFormPage formType="create" />
											</Suspense>
										),
									},
									{
										path: ":id/edit",
										element: (
											<Suspense fallback={<Loading fullscreen />}>
												<GigFormPage formType="edit" />
											</Suspense>
										),
									},
								],
							},
						],
					},
				],
			},
			// management shii
			{
				element: <RequireManagementAccess />,
				children: [
					{
						path: "management/dashboard",
						element: <ManagementDashboard />,
					},
					{
						path: "management/reports",
						element: <Reports />,
					},
					{
						path: "management/gigs/unaccepted",
						element: <UnacceptedGigs />,
					},
				],
			},
		],
	},
	{
		element: <Layout noShowFooter />,
		errorElement: <ErrorPage showHeader />,
		children: [
			{
				element: <RequireAuth />,
				children: [],
			},
		],
	},
	{
		element: <Layout isScreenHeight noShowFooter />,
		errorElement: <ErrorPage showHeader />,
		children: [
			{
				element: <RequireAuth />,
				children: [
					{
						path: "interaction/user/:id",
						element: <ChatPage />,
					},
				],
			},
		],
	},
]);

function App() {
	// this code is in app.tsx because we want to know the theme all over the app.

	return <RouterProvider router={router} />;
}

export default App;
