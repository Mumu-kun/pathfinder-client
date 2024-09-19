import React from "react";
import ManagementNavbar from "./ManagementNavbar";
import useAuth from "@/hooks/useAuth";

const ManagementDashboard = () => {
	const { auth } = useAuth();
	return (
		<div>
			<ManagementNavbar />
			<div className="text-center mt-10">
				<p className="small-headings">Hi {auth?.firstName}, Welcome to the management dashboard.</p>
			</div>
		</div>
	);
};

export default ManagementDashboard;
