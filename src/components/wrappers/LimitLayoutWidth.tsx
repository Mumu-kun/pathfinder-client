import { createPortal } from "react-dom";

const LimitLayoutWidth = ({ children }: { children?: React.ReactNode }) => {
	return (
		<div className="mx-auto flex w-[1000px] max-w-full flex-1 flex-col px-6" id="limited-container">
			{children}
		</div>
	);
};

export const UnlimitLayoutWidth = ({ children }: { children?: React.ReactNode }) => {
	const div = document.getElementById("unlimit-width");

	if (!div) {
		return children;
	}

	return createPortal(children, div);
};

export default LimitLayoutWidth;
