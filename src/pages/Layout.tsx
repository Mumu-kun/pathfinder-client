import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
import Header from "../components/Header";
import LimitLayoutWidth from "../components/LimitLayoutWidth";
import Loading from "../components/Loading";
import Intro from "./Home/Intro";
import { ToastContainer } from "react-toastify";
import ThemeContext from "@/context/ThemeProvider";

const Layout = ({ children }: { children?: JSX.Element | JSX.Element[] }) => {
	const { theme } = useContext(ThemeContext);
	const location = useLocation();
	const navigation = useNavigation();
	const isHome: Boolean = location.pathname === "/";

	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (navigation.state !== "idle") {
			setLoading(true);
		}
	}, [navigation.state]);

	return (
		<>
			{loading ? (
				<Loading fullscreen isLoading={navigation.state !== "idle"} deleteMe={() => setLoading(false)} />
			) : null}
			{/* <Loading fullscreen /> */}
			<div className="mx-auto flex min-h-screen flex-col items-center justify-center">
				<div className="w-full">
					<Header />
				</div>
				{/* <div className="flex w-full flex-1 flex-col"> */}
				{isHome && <Intro />}
				<LimitLayoutWidth>
					<>
						<Outlet />
						{children}
					</>
				</LimitLayoutWidth>
				{/* </div> */}
				<ToastContainer position="bottom-center" theme={theme} />
			</div>
		</>
	);
};

export default Layout;
