import React, { RefObject, useEffect, useRef } from "react";
import { useCollapse } from "react-collapsed";

type DropdownProps = {
	head: React.ReactNode;
	children?: React.ReactNode;
	isOpen?: boolean;
	setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
	rightAlign?: boolean;
	noCloseOnClick?: boolean;
	className?: string;
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

const Dropdown = ({
	head,
	children,
	isOpen,
	setIsOpen,
	rightAlign = false,
	noCloseOnClick = false,
	className = "",
	dropdownClassName = "",
}: DropdownProps) => {
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
		<div ref={ref} className={`relative transition-all ${className}`}>
			<div {...getToggleProps({ onClick: () => setIsOpen((prev) => !prev) })} className="cursor-pointer">
				{head}
			</div>
			<div
				className={`absolute ${rightAlign ? "right-0" : "left-0"} top-full z-50 min-w-full overflow-hidden shadow dark:shadow-gray-800 ${dropdownClassName}`}
				{...getCollapseProps()}
				onClick={() => {
					!noCloseOnClick && setIsOpen(false);
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default Dropdown;
