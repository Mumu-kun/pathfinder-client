import ModeContext from "@/context/ModeProvider";
import useAuth from "@/hooks/useAuth";
import { useContext, useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import Sticky from "react-sticky-el/lib/basic-version";
import { useMediaQuery } from "usehooks-ts";
import ChatIcon from "../chat/ChatIcon";
import NotificationIcon from "../chat/NotificationIcon";
import Dropdown from "../Dropdown";
import SearchBar from "../SearchBar";
import HeaderAuthLinks from "./HeaderAuthLinks";

type AuxLinkDropdownProps = {
	title: string;
	options: { text: string; url: string }[];
	isOpenClassName?: string;
	className?: string;
	itemClassName?: string;
};

const AuxLinkDropdown = ({
	title,
	options,
	isOpenClassName,
	className: pClassName = "",
	itemClassName = "",
}: AuxLinkDropdownProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dropdown
			head={
				<div className={`flex select-none items-center gap-0.5 ${pClassName} ${isOpen ? isOpenClassName : ""}`}>
					{title}
					<FaCaretDown className="h-3 w-3" />
				</div>
			}
			{...{ isOpen, setIsOpen }}
		>
			<div className={`flex flex-col rounded-b-sm bg-light-bg transition-all dark:bg-dark-bg`}>
				{options.map((option, index) => (
					<Link key={index} to={option.url} className={`p-2 text-sm font-semibold ${itemClassName}`}>
						{option.text}
					</Link>
				))}
			</div>
		</Dropdown>
	);
};

const Header = () => {
	const location = useLocation();
	const isHome: Boolean = location.pathname === "/";

	const { auth } = useAuth();
	const { mode } = useContext(ModeContext);
	const isBuyerMode = mode === "buyer";

	const [stuck, setStuck] = useState<boolean>(!isHome || window.scrollY > 0);

	const isMediaSM = useMediaQuery("(max-width: 640px)");
	const isMediaMD = useMediaQuery("(max-width: 768px)");

	useEffect(() => {
		isHome ? setStuck(Boolean(window.scrollY)) : setStuck(true);
	}, [location.pathname]);

	return (
		<Sticky
			onFixedToggle={() => {
				isHome && setStuck(Boolean(window.scrollY));
			}}
			stickyClassName=" z-50"
		>
			<header
				id="header"
				className="relative z-50 flex w-full flex-col items-center bg-light-secondary px-6 pt-3 shadow dark:bg-dark-secondary dark:shadow-gray-700"
				style={{
					paddingBottom: !isBuyerMode ? "0.5rem" : "0",
				}}
			>
				<div
					className={`header-grid-layout w-full max-w-7xl items-center gap-x-4 transition-all duration-500 ease-in-out ${isBuyerMode && stuck ? "--stuck-header" : ""}`}
				>
					{/* Logo */}
					<div className="col-span-1 flex items-center gap-2">
						<Link to="/" className="mr-6 text-3xl font-bold max-sm:text-xl">
							path<span className="text-4xl text-green-500 max-sm:text-lg">Finder</span>
						</Link>
					</div>

					{/* SearchBar */}
					{isBuyerMode ? (
						<SearchBar {...{ stuck }} className={`h-full max-lg:col-span-full max-lg:row-[2]`} />
					) : (
						<div></div>
					)}

					{/* NavLinks */}
					<div className="flex items-center justify-center gap-4 text-nowrap max-lg:justify-end max-md:gap-2 max-md:text-xs">
						{auth && <NotificationIcon />}
						{auth && <ChatIcon />}

						<Link to="/" className="px-2 font-bold">
							{isMediaMD ? "md" : "About Us"}
						</Link>
						<Link to="/" className="px-2 font-bold">
							{isMediaMD ? "md" : "Contact"}
						</Link>
						<HeaderAuthLinks />
					</div>
				</div>

				{/* Auxiliary Links */}
				{isBuyerMode && (
					<div className="mt-1 w-full">
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
