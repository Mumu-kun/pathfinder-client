import useAuth from "@/hooks/useAuth";
import useMode from "@/hooks/useMode";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Sticky from "react-sticky-el/lib/basic-version";
import { useMediaQuery } from "usehooks-ts";
import ChatIcon from "../chat/ChatIcon";
import NotificationIcon from "../chat/NotificationIcon";
import AuxLinkDropdown from "./AuxLinkDropdown";
import HeaderAuthLinks from "./HeaderAuthLinks";
import SearchBar from "./SearchBar";
import Dropdown from "../Dropdown";
import LogoWName from "@/assets/logo-w-name.png";
import { MdInfoOutline } from "react-icons/md";

const Header = () => {
	const location = useLocation();
	const isHome: Boolean = location.pathname === "/";

	const { auth } = useAuth();
	const { mode } = useMode();
	const isBuyerMode = mode === "buyer";

	const [stuck, setStuck] = useState<boolean>(!isHome || window.scrollY > 0);

	const isMediaMD = useMediaQuery("(max-width: 768px)");

	useEffect(() => {
		isHome ? setStuck(Boolean(window.scrollY)) : setStuck(true);
	}, [location.pathname]);

	return (
		<Sticky
			onFixedToggle={() => {
				isHome && setStuck(Boolean(window.scrollY));
			}}
			stickyClassName="relative z-50"
		>
			<header
				id="header"
				className="relative z-50 flex w-full flex-col items-center bg-light-secondary px-6 pt-3 shadow dark:bg-dark-secondary dark:shadow-gray-700"
				style={{
					paddingBottom: !isBuyerMode ? "1rem" : "0",
				}}
			>
				<div
					className={`header-grid-layout w-full max-w-7xl items-center gap-x-4 transition-all duration-500 ease-in-out ${isBuyerMode && stuck ? "--stuck-header" : ""}`}
				>
					{/* Logo */}
					<div className="col-span-1 flex items-center gap-2">
						<Link to="/" className="mr-6 h-12">
							<img src={LogoWName} alt="pathPhindr" className="h-full max-w-full object-contain pt-3" />
						</Link>
					</div>

					{/* SearchBar */}
					{isBuyerMode ? (
						<SearchBar {...{ stuck }} className={`h-full max-lg:col-span-full max-lg:row-[2]`} />
					) : (
						<div className="max-lg:hidden"></div>
					)}

					{/* NavLinks */}
					<div className="flex items-center justify-center gap-4 text-nowrap max-lg:justify-end max-md:gap-4 max-md:text-xs">
						{isBuyerMode ? (
							!isMediaMD ? (
								<>
									<Link to="/" className="px-2 font-bold">
										About Us
									</Link>
									<Link to="/" className="px-2 font-bold">
										Contact
									</Link>
								</>
							) : (
								<Dropdown
									head={<MdInfoOutline className="hover-effect-no-shadow h-5 w-5" />}
									rightAlign
									dropdownClassName="mt-2"
								>
									<div
										className={`flex min-w-20 flex-col items-center justify-center rounded-md bg-light-bg p-2 text-center transition-all dark:bg-dark-bg`}
									>
										<Link
											to="/"
											className="w-full p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
										>
											About Us
										</Link>
										<Link
											to="/"
											className="w-full p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
										>
											Contact
										</Link>
									</div>
								</Dropdown>
							)
						) : !isMediaMD ? (
							<>
								<Link to={"#"} className="px-2 font-bold hover:text-green-500">
									Dashboard
								</Link>
								<Link to={"/manage/gigs"} className="px-2 font-bold hover:text-green-500">
									Gigs
								</Link>
								<Link to={"/manage/enrollment"} className="px-2 font-bold hover:text-green-500">
									Enrollments
								</Link>
							</>
						) : (
							<Dropdown
								head={<i className="bx bx-menu hover-effect-no-shadow text-2xl"></i>}
								rightAlign
								dropdownClassName=""
							>
								<div
									className={`flex min-w-20 flex-col items-center justify-center rounded-md bg-light-bg p-2 text-center transition-all dark:bg-dark-bg`}
								>
									<Link
										to={"#"}
										className="w-full p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
									>
										Dashboard
									</Link>
									<Link
										to={"/manage/gigs"}
										className="w-full p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
									>
										Gigs
									</Link>
									<Link
										to={"/manage/enrollment"}
										className="w-full p-2 text-sm font-semibold hover:bg-[#eeeeee] dark:hover:bg-[#272727]"
									>
										Enrollments
									</Link>
								</div>
							</Dropdown>
						)}

						{auth && <NotificationIcon />}
						{auth && <ChatIcon />}

						<HeaderAuthLinks />
					</div>
				</div>

				{/* Auxiliary Links */}
				{isBuyerMode && (
					<div className="w-full">
						<div className="mx-auto flex max-w-7xl">
							<AuxLinkDropdown
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
							<AuxLinkDropdown
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
							<AuxLinkDropdown
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
				)}
			</header>
		</Sticky>
	);
};

export default Header;
