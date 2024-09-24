import useAuth from "@/hooks/useAuth";
import ManagementNavbar from "./ManagementNavbar";

const ManagementDashboard = () => {
	const { auth } = useAuth();
	return (
		<>
			<ManagementNavbar />
			<div className="ml-10 mt-10 text-center">
				<p className="small-headings">Hi {auth?.firstName}, Welcome to the management dashboard.</p>
			</div>
		</>
	);
};

export default ManagementDashboard;
