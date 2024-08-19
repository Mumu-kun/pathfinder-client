import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LimitLayoutWidth = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div
			className="mx-auto flex min-h-0 w-[1000px] max-w-full flex-1 flex-col px-6 empty:flex-none"
			id="limited-container"
		>
			{children}
		</div>
	);
};

export const UnlimitLayoutWidth = ({ children }: { children?: React.ReactNode }) => {
	const [delayed, setDelayed] = useState(false);

	const div = document.getElementById("unlimit-width");

	useEffect(() => {
		if (!div) {
			setDelayed(true);
			setTimeout(() => setDelayed(false), 300);
		} else {
			setDelayed(false);
		}
	}, [delayed]);

	if (!div) {
		return null;
	}

	return createPortal(children, div);
};

export default LimitLayoutWidth;
