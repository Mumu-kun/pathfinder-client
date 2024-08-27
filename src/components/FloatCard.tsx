import useAI from "@/hooks/useAi";
import { headingsPlugin, listsPlugin, MDXEditor, quotePlugin, thematicBreakPlugin } from "@mdxeditor/editor";
import { useEffect, useState } from "react";
import { FaMinimize } from "react-icons/fa6";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type FloatProps = {};

const FloatCard = ({}: FloatProps) => {
	const { guideline } = useAI();
	const { auth } = useAuth();

	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		guideline && setOpen(true);
	}, [guideline]);

	if (!guideline) return null;

	return (
		<div
			className={`fixed bottom-4 right-4 z-50 max-h-96 self-start justify-self-end rounded bg-light-secondary px-2 pb-2 pt-1 shadow dark:bg-dark-secondary ${open ? "w-80" : "h-8 w-8 cursor-pointer"} flex flex-col items-center justify-center overflow-hidden`}
			onClick={() => !open && setOpen(true)}
		>
			{open ? (
				<>
					<FaMinimize
						className="absolute right-2 top-2 h-4 w-4 cursor-pointer"
						onClick={() => setOpen((open) => !open)}
					/>
					<div
						className="small-headings my-1 flex items-center gap-1 px-2 text-left"
						style={{
							visibility: open ? "visible" : "hidden",
						}}
					>
						<i className="bx bx-message-rounded-dots text-xl"></i> Ai Assistant
					</div>
					<div className="flex w-full flex-col overflow-auto rounded bg-white py-2">
						<div className="mb-2 px-3 font-semibold">Guideline on "{guideline.topic}"</div>

						{guideline.content ? (
							<MDXEditor
								key={guideline.topic}
								markdown={guideline.content}
								contentEditableClassName={`prose prose-sm dark:prose-invert px-3 pb-2`}
								plugins={[
									headingsPlugin({
										allowedHeadingLevels: [2, 3, 4],
									}),
									listsPlugin(),
									quotePlugin(),
									thematicBreakPlugin(),
								]}
								readOnly
								className="min-h-0 flex-1"
							/>
						) : (
							<Loading isTransparent />
						)}
					</div>
					<Link to="/interaction/user/ai" className="solid-btn mt-2">
						{!auth && "Join To"} Ask More Questions
					</Link>
				</>
			) : (
				<i className="bx bx-message-rounded-dots -mb-1 text-xl"></i>
			)}
		</div>
	);
};

export default FloatCard;
