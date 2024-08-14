import ThemeContext from "@/context/ThemeProvide";
import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import LimitLayoutWidth from "../components/LimitLayoutWidth";
import Loading from "../components/Loading";

const Layout = ({ children }: { children?: JSX.Element | JSX.Element[] }) => {
	const { theme } = useContext(ThemeContext);
	const navigation = useNavigation();

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
				<div id="unlimit-width" className="w-full"></div>
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
