import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout: React.FC = () => {
	return (
		<>
			<Header />
			<div className="mx-auto flex min-h-[calc(100vh)] w-3/5 flex-col items-center justify-center pb-8 max-lg:w-full max-lg:px-6">
				<div className="mt-20 w-full flex-1">
					<Outlet />
				</div>
			</div>
		</>
	);
};

export default Layout;
