import React, { RefObject, useEffect, useRef, useState } from "react";
import { useCollapse } from "react-collapsed";
import { FaCaretDown } from "react-icons/fa";
import { Link } from "react-router-dom";

type DropdownProps = {
	head: React.ReactNode;
	children?: React.ReactNode;
	isOpen?: boolean;
	setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	rightAlign?: boolean;
	dropdownClassName?: string;
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

const Dropdown = ({ head, children, isOpen, setIsOpen, rightAlign = false, dropdownClassName = "" }: DropdownProps) => {
	// if (!isOpen || !setIsOpen) {
	// 	[isOpen, setIsOpen] = useState<boolean>(false);
	// }

	const { getCollapseProps, getToggleProps, isExpanded, setExpanded } = useCollapse({
		isExpanded: isOpen,
		collapsedHeight: 0,
	});

	if (!setIsOpen) {
		setIsOpen = setExpanded;
	}

	const ref = useRef<HTMLDivElement>(null);

	useClickOutside(ref, () => {
		if (isExpanded) {
			setIsOpen(false);
		}
	});

	return (
		<div ref={ref} className={`relative cursor-pointer transition-all`}>
			<div {...getToggleProps({ onClick: () => setIsOpen((prev) => !prev) })}>{head}</div>
			<div
				className={`absolute ${rightAlign ? "right-0" : "left-0"} top-full min-w-full overflow-hidden shadow dark:shadow-gray-800 ${dropdownClassName}`}
				{...getCollapseProps()}
				onClick={() => {
					setIsOpen(false);
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default Dropdown;
