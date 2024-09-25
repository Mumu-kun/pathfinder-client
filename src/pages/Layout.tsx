import ThemeContext from "@/context/ThemeProvider";
import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigation } from "react-router-dom";
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
	noShowFooter = false,
}: {
	children?: JSX.Element | JSX.Element[];
	isScreenHeight?: boolean;
	noShowFooter?: boolean;
}) => {
	const { theme } = useContext(ThemeContext);
	const navigation = useNavigation();
	const location = useLocation();

	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		let str = location.pathname
			.split("/")
			.filter((x) => x !== "" && x !== "unaccepted")
			.map((x) => {
				if (x === "management") x = "Site Management";
				x = x.trim();
				x = x.charAt(0).toUpperCase() + x.slice(1);
				return x;
			});

		if (location.pathname.startsWith("/recommendations")) {
			str = ["Recommendations"];
		}

		const queryParams = new URLSearchParams(location.search);

		if (queryParams.has("category")) {
			str.push(queryParams.get("category")!);
		} else if (queryParams.has("title")) {
			str.push(queryParams.get("title")!);
		}

		console.log(str);

		document.title = "pathPhindr" + " | " + str.join(" | ");
	}, [location]);

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
				<div id="unlimit-width" className="flex min-h-0 w-full flex-1 flex-col empty:flex-none"></div>
				<LimitLayoutWidth>
					<>
						<Outlet />
						{children}
					</>
				</LimitLayoutWidth>
				{/* </div> */}
				<FloatCard />

				<ToastContainer position="bottom-center" theme={theme} />
				{!noShowFooter && <Footer />}
			</div>
		</PersistLogin>
	);
};

export default Layout;
