import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Intro from "./Home/Intro";
import LimitLayoutWidth from "../components/LimitLayoutWidth";

const Layout: React.FC = () => {
	const location = useLocation();
	const isHome: Boolean = location.pathname === "/";

	return (
		<>
			<Header />
			<div className="mx-auto flex min-h-[calc(100vh)] flex-col items-center justify-center pb-8">
				<div className="mt-20 w-full flex-1">
					{isHome && <Intro />}
					<LimitLayoutWidth>
						<Outlet />
					</LimitLayoutWidth>
				</div>
			</div>
		</>
	);
};

export default Layout;
