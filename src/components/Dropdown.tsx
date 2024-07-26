import React, { RefObject, useEffect, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { Link } from "react-router-dom";

type DropdownProps = {
	title: string;
	options: { text: string; url: string }[];
	isOpenClassName?: string;
	className?: string;
	itemClassName?: string;
};

function useClickOutside(ref: RefObject<any>, onClickOutside: () => void) {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target)) {
				onClickOutside();
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref, onClickOutside]);
}

const Dropdown = ({
	title,
	options,
	isOpenClassName,
	className: pClassName = "",
	itemClassName = "",
}: DropdownProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);

	useClickOutside(ref, () => {
		if (isOpen) {
			setIsOpen(false);
		}
	});

	return (
		<div ref={ref} className={`relative cursor-pointer transition-all`}>
			<div
				className={`flex select-none items-center gap-0.5 ${pClassName} ${isOpen ? isOpenClassName : ""}`}
				onBlur={(e) => {
					console.log("onBlur");

					setIsOpen(false);
				}}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				{title}
				<FaCaretDown className="h-3 w-3" />
			</div>

			<div className={`absolute left-0 top-full min-w-full overflow-hidden rounded-b-sm shadow dark:shadow-gray-800`}>
				<div className={`flex flex-col transition-all ${!isOpen ? "-mt-[500%]" : ""}`}>
					{options.map((option, index) => (
						<Link key={index} to={option.url} className={`p-2 text-sm font-semibold ${itemClassName}`}>
							{option.text}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Dropdown;
