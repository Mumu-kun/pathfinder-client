import React from "react";
import useAuth from "@/hooks/useAuth";

const NoContactSelected: React.FC = () => {
	const { auth } = useAuth();
	return (
		<div className="small-headings flex min-h-0 flex-1 items-center justify-center">
			Hi, {auth?.firstName} {auth?.lastName}! Please select a contact to start chatting.
		</div>
	);
};

export default NoContactSelected;
