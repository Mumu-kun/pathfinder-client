import { useState } from "react";
import { useNavigate } from "react-router-dom";

type TagProps = {
	tag: string;
	disabled?: boolean;
	className?: string;
};

const Tag = ({ tag, disabled = false, className: pClassName }: TagProps) => {
	const navigate = useNavigate();
	const [isDisabled, setIsDisabled] = useState<boolean>(disabled);
	return (
		<div
			className={`mr-2 inline-block w-max whitespace-nowrap rounded-sm border-2 border-solid border-zinc-400 bg-white px-1 text-xss font-medium leading-relaxed text-zinc-600 dark:bg-dark-secondary dark:font-bold dark:text-zinc-200 ${!isDisabled ? "cursor-pointer hover:border-solid" : "cursor-default"} ${pClassName ?? ""}`}
			onMouseEnter={(e) => {
				e.altKey && setIsDisabled(true);
			}}
			onMouseDown={(e) => {
				e.altKey && setIsDisabled(true);
			}}
			onMouseLeave={() => {
				!disabled && setIsDisabled(false);
			}}
			onClick={(e) => {
				!e.altKey && !isDisabled && navigate("/filter?tags=" + tag);
				!disabled && isDisabled && setIsDisabled(false);
			}}
		>
			{tag}
		</div>
	);
};

export default Tag;
