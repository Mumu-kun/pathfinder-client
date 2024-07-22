import { useState } from "react";
import { FaMinimize } from "react-icons/fa6";

type FloatProps = {};

const FloatCard = ({}: FloatProps) => {
	const [open, setOpen] = useState<boolean>(true);
	return (
		<div
			className={`fixed bottom-4 right-4 self-start justify-self-end rounded-sm bg-light-secondary shadow-sm dark:bg-dark-secondary ${open ? "h-96 w-80" : "h-8 w-8 cursor-pointer"} overflow-hidden transition-all`}
			onClick={() => !open && setOpen(true)}
		>
			<FaMinimize className="absolute right-2 top-2 h-4 w-4 cursor-pointer" onClick={() => setOpen((open) => !open)} />
		</div>
	);
};

export default FloatCard;
