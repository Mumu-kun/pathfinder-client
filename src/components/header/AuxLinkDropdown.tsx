import { useState } from "react";
import Dropdown from "../Dropdown";
import { FaCaretDown } from "react-icons/fa6";
import { Link } from "react-router-dom";

type AuxLinkDropdownProps = {
	title: string;
	options: { text: string; url: string }[];
	isOpenClassName?: string;
	className?: string;
	itemClassName?: string;
	dropdownClassName?: string;
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
				<div className={`flex select-none items-center gap-0.5 px-3 ${pClassName} ${isOpen ? isOpenClassName : ""}`}>
					{title}
					<FaCaretDown className="ml-1 h-3 w-3" />
				</div>
			}
			{...{ isOpen, setIsOpen }}
		>
			<div
				className={`grid max-h-[10rem] grid-flow-col grid-rows-[repeat(auto-fill,2rem)] rounded bg-light-bg py-1 transition-all dark:bg-dark-bg`}
			>
				{options.map((option, index) => (
					<Link key={index} to={option.url} className={`w-max p-2 px-3 text-sm font-semibold ${itemClassName}`}>
						{option.text}
					</Link>
				))}
			</div>
		</Dropdown>
	);
};

export default AuxLinkDropdown;
