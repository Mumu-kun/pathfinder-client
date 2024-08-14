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

export default AuxLinkDropdown;
