import { disableScroll, enableScroll } from "@/utils/functions";
import { useEffect } from "react";
import { ScaleLoader } from "react-spinners";

type LoadingProps = {
	fullscreen?: boolean;
	isTransparent?: boolean;
	isLoading?: boolean;
	deleteMe?: () => void;
};

const Loading = ({
	fullscreen = false,
	isTransparent = false,
	isLoading = true,
	deleteMe = () => {},
}: LoadingProps) => {
	useEffect(() => {
		if (fullscreen) {
			disableScroll();
		}

		return () => {
			if (fullscreen) {
				enableScroll();
			}
		};
	}, []);

	useEffect(() => {
		if (!isLoading) {
			setTimeout(deleteMe, 300);
		}
	}, [isLoading]);

	return (
		<div
			className={`flex h-full w-full flex-1 animate-fadeIn items-center justify-center self-stretch bg-zinc-200 dark:bg-zinc-950 ${isTransparent ? "bg-opacity-0" : "bg-opacity-50"} transition-opacity duration-300 ${fullscreen ? "fixed inset-0 z-10" : ""} ${!isLoading ? "opacity-0" : ""}`}
			onTransitionEnd={() => {
				deleteMe();
			}}
		>
			<ScaleLoader color={"rgb(34 197 94)"} loading={true} width={10} />
		</div>
	);
};

export default Loading;
