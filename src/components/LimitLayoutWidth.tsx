const LimitLayoutWidth = ({ children }: { children?: JSX.Element | JSX.Element[] }) => {
	return <div className="mx-auto flex w-3/5 flex-1 flex-col max-lg:w-full max-lg:px-6">{children}</div>;
};

export default LimitLayoutWidth;
