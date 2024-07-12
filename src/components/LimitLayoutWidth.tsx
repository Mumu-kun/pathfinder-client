const LimitLayoutWidth = ({ children }: { children?: JSX.Element | JSX.Element[] }) => {
	return <div className="mx-auto w-3/5 max-lg:w-full max-lg:px-6">{children}</div>;
};

export default LimitLayoutWidth;
