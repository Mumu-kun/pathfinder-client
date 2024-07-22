import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sticky from "react-sticky-el/lib/basic-version";
import { TypeAnimation } from "react-type-animation";
import SearchBar from "./SearchBar";
import ChangeTheme from "./ChangeTheme";
import Dropdown from "./Dropdown";

const Header = () => {
	const location = useLocation();
	const isHome: Boolean = location.pathname === "/";

	const [stuck, setStuck] = useState<boolean>(!isHome || window.scrollY > 0);

	const [isMediaSM, setIsMediaSM] = useState<boolean>(window.matchMedia("(max-width: 640px)").matches);
	const [isMediaMD, setIsMediaMD] = useState<boolean>(window.matchMedia("(max-width: 768px)").matches);

	useEffect(() => {
		const handlerSM = (e: MediaQueryListEvent) => {
			setIsMediaSM(e.matches);
		};
		const handlerMD = (e: MediaQueryListEvent) => {
			setIsMediaMD(e.matches);
		};

		window.matchMedia("(max-width: 640px)").addEventListener("change", handlerSM);
		window.matchMedia("(max-width: 768px)").addEventListener("change", handlerMD);

		return () => {
			window.matchMedia("(max-width: 640px)").removeEventListener("change", handlerSM);
			window.matchMedia("(max-width: 768px)").removeEventListener("change", handlerMD);
		};
	}, []);

	useEffect(() => {
		isHome && setStuck(Boolean(window.scrollY));
	}, [location.pathname]);

	return (
		<Sticky
			onFixedToggle={() => {
				isHome && setStuck(Boolean(window.scrollY));
			}}
			stickyClassName="z-50"
		>
			<header
				id="header"
				className="flex w-full flex-col items-center bg-light-secondary px-6 pt-3 shadow dark:bg-dark-secondary dark:shadow-gray-700"
			>
				<div
					className={`header-grid-layout w-full max-w-7xl items-center gap-x-4 transition-all duration-500 ease-in-out ${stuck ? "--stuck-header" : ""} `}
				>
					{/* Logo */}
					<div className="col-span-1 flex items-center gap-2">
						<Link to="/" className="mr-6 text-3xl font-bold max-sm:text-xl">
							path<span className="text-4xl text-green-500 max-sm:text-lg">Finder</span>
						</Link>
					</div>

					{/* SearchBar */}
					<SearchBar {...{ stuck }} className={`h-full max-lg:col-span-full max-lg:row-[2]`} />

					{/* NavLinks */}
					<div className="flex items-center justify-center gap-4 text-nowrap max-lg:justify-end max-md:gap-2 max-md:text-xs">
						<ChangeTheme />
						<Link to="/" className="px-2 font-bold">
							{isMediaMD ? "md" : "About Us"}
						</Link>
						<Link to="/" className="px-2 font-bold">
							{isMediaMD ? "md" : "Contact"}
						</Link>
						<Link to="/login" className="outline-btn">
							Log In
						</Link>
						<Link to="/register" className="solid-btn">
							Join as a{" "}
							<span className="inline-block w-14 pr-2">
								<TypeAnimation sequence={["Student", 3000, "Mentor", 3000]} speed={10} repeat={Infinity} />
							</span>
						</Link>
					</div>

					{/* Auxiliary Links */}
				</div>
				<div className="mt-1 w-full">
					<div className="mx-auto flex max-w-7xl">
						<Dropdown
							title="Mathematics"
							options={[
								{ text: "Algebra", url: "#" },
								{ text: "Geometry", url: "#" },
								{ text: "Calculus", url: "#" },
								{ text: "Trigonometry", url: "#" },
							]}
							className="rounded-t-sm px-2 py-1 font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
							isOpenClassName="bg-light-bg dark:bg-dark-bg"
							itemClassName="bg-light-bg hover:bg-[#eeeeee] dark:bg-dark-bg dark:hover:bg-[#272727]"
						/>
						<Dropdown
							title="Physics"
							options={[
								{ text: "Mechanics", url: "#" },
								{ text: "Thermodynamics", url: "#" },
								{ text: "Optics", url: "#" },
								{ text: "Electromagnetism", url: "#" },
							]}
							className="px-2 py-1 font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
							isOpenClassName="bg-light-bg dark:bg-dark-bg"
							itemClassName="bg-light-bg hover:bg-[#eeeeee] dark:bg-dark-bg dark:hover:bg-[#272727]"
						/>
						<Dropdown
							title="Chemistry"
							options={[
								{ text: "Organic", url: "#" },
								{ text: "Inorganic", url: "#" },
								{ text: "Physical", url: "#" },
								{ text: "Analytical", url: "#" },
							]}
							className="px-2 py-1 font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
							isOpenClassName="bg-light-bg dark:bg-dark-bg"
							itemClassName="bg-light-bg hover:bg-[#eeeeee] dark:bg-dark-bg dark:hover:bg-[#272727]"
						/>
					</div>
				</div>
			</header>
		</Sticky>
	);
};

export default Header;
