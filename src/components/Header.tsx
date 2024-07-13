import { useSpring, animated } from "@react-spring/web";
import { useState } from "react";
import { Link } from "react-router-dom";
import Sticky from "react-sticky-el/lib/basic-version";
import { TypeAnimation } from "react-type-animation";
import SearchBar from "./SearchBar";
import ChangeTheme from "./ChangeTheme";

const Header = () => {
	const [stuck, setStuck] = useState<Boolean>(false);

	return (
		<Sticky
			onFixedToggle={() => {
				setStuck((prev) => !prev);
			}}
		>
			<header className="flex w-full secondary-color-bg z-50">
				<div
					className={`header-grid-layout h-headerHeight mx-auto w-full max-w-7xl items-center gap-4 transition-all duration-500 ease-in-out ${stuck ? "--stuck-width" : ""}`}
				>
					<div className="col-span-1 flex items-center gap-2">
						<Link to="/" className="mr-6 text-3xl font-bold">
							Logo
						</Link>
						<ChangeTheme />
					</div>

					<SearchBar />

					<animated.div className="flex items-center justify-center gap-4 text-sm">
						<Link to="/" className="px-2">
							About Us
						</Link>
						<Link to="/" className="px-2">
							Contact
						</Link>
						<Link
							to="/login"
							className="rounded-sm border-2 border-blue-600 bg-white px-4 py-1 font-bold text-blue-600 transition-all duration-100 hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:shadow-md active:translate-y-0 active:shadow-none"
						>
							Log In
						</Link>
						<Link
							to="/register"
							className="rounded-sm border-2 border-blue-600 bg-blue-600 px-4 py-1 font-bold text-white transition-all duration-100 hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:shadow-md active:translate-y-0 active:shadow-none"
						>
							Join as a{" "}
							<span className="inline-block w-14 pr-2">
								<TypeAnimation sequence={["Student", 3000, "Mentor", 3000]} speed={10} repeat={Infinity} />
							</span>
						</Link>
					</animated.div>
				</div>
			</header>
		</Sticky>
	);
};

export default Header;
