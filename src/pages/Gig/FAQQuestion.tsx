import { useCollapse } from "react-collapsed";
import { FaAngleDown } from "react-icons/fa6";

type Props = {
	question: string;
	answer: string;
	className?: string;
};

const FAQQuestion = ({ question, answer, className }: Props) => {
	const { getToggleProps, getCollapseProps, isExpanded } = useCollapse();

	return (
		<div className="w-full rounded bg-light-bg p-1 px-2 text-sm dark:bg-dark-bg">
			<h4 {...getToggleProps()} className="my-1 flex items-center justify-between pl-2">
				{question}{" "}
				<FaAngleDown
					className="mb-1 inline-block transition-transform"
					style={{
						transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
					}}
				/>
			</h4>
			<div {...getCollapseProps()} className="border-t px-2">
				<div className="py-1">{answer}</div>
			</div>
		</div>
	);
};

export default FAQQuestion;
