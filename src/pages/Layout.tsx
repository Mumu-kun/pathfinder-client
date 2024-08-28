import ThemeContext from "@/context/ThemeProvider";
import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "../components/header/Header";
import LimitLayoutWidth from "../components/wrappers/LimitLayoutWidth";
import Loading from "../components/Loading";
import PersistLogin from "@/components/wrappers/PersistLogin";
import FloatCard from "@/components/FloatCard";
import Footer from "@/components/Footer";

const Layout = ({
	children,
	isScreenHeight = false,
}: {
	children?: JSX.Element | JSX.Element[];
	isScreenHeight?: boolean;
}) => {
	const { theme } = useContext(ThemeContext);
	const navigation = useNavigation();

	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (navigation.state !== "idle") {
			setLoading(true);
		}
	}, [navigation.state]);

	return (
		<PersistLogin>
			{loading ? (
				<Loading fullscreen isLoading={navigation.state !== "idle"} deleteMe={() => setLoading(false)} />
			) : null}
			{/* <Loading fullscreen /> */}
			<div
				className={`mx-auto flex min-h-screen flex-col items-center ${isScreenHeight ? "h-screen overflow-auto" : ""}`}
				style={{
					height: isScreenHeight ? "100vh" : "auto",
				}}
			>
				<div className="relative z-50 w-full">
					<Header />
				</div>
				{/* <div className="flex w-full flex-1 flex-col"> */}
				<div id="unlimit-width" className="flex min-h-0 w-full flex-1 flex-col px-6 empty:flex-none"></div>
				<LimitLayoutWidth>
					<>
						<Outlet />
						{children}
					</>
				</LimitLayoutWidth>
				{/* </div> */}
				<FloatCard />

				<ToastContainer position="bottom-center" theme={theme} />
				<Footer />
			</div>
		</PersistLogin>
	);
};

export default Layout;
