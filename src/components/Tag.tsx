import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type TagProps = {
	tag: string;
	disabled?: boolean;
};

const Tag = ({ tag, disabled = false }: TagProps) => {
	const navigate = useNavigate();
	const [isDisabled, setIsDisabled] = useState<boolean>(disabled);
	return (
		<div
			className={`text-xss mr-2 inline-block rounded-sm border-2 border-dashed border-green-400 bg-white px-1 py-0.5 font-medium text-green-600 dark:bg-dark-secondary ${!isDisabled ? "cursor-pointer hover:border-solid" : "cursor-default"}`}
			onMouseEnter={(e) => {
				e.altKey && setIsDisabled(true);
			}}
			onMouseDown={(e) => {
				console.log(e);
				e.altKey && setIsDisabled(true);
			}}
			onMouseLeave={(e) => {
				!disabled && setIsDisabled(false);
			}}
			onClick={(e) => {
				console.log(e);
				!e.altKey && !isDisabled && navigate("/");
				!disabled && isDisabled && setIsDisabled(false);
			}}
		>
			{tag}
		</div>
	);
};

export default Tag;
