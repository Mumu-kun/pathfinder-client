const LimitLayoutWidth = ({ children }: { children?: JSX.Element | JSX.Element[] }) => {
	return <div className="mx-auto flex w-[1000px] max-w-full flex-1 flex-col px-6">{children}</div>;
};

export default LimitLayoutWidth;
