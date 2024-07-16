import React from "react";

type TagProps = {
	tag: string;
};

const Tag = ({ tag }: TagProps) => {
	return (
		<div className="mr-2 inline-block cursor-pointer rounded-sm border-2 border-dashed border-green-400 bg-white px-1 py-0.5 text-xs font-medium text-green-600 hover:border-solid dark:bg-dark-secondary">
			{tag}
		</div>
	);
};

export default Tag;
