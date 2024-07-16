import { PropagateLoader } from "react-spinners";

type LoadingProps = {
	fullscreen?: boolean;
	isLoading?: boolean;
	deleteMe: () => void;
};

const Loading = ({ fullscreen = false, isLoading = true, deleteMe }: LoadingProps) => {
	return (
		<div
			className={`animate-fadeIn flex h-full w-full items-center justify-center bg-gray-500 bg-opacity-50 transition-opacity duration-300 ${fullscreen ? "fixed left-0 top-0 z-10" : ""} ${!isLoading ? "opacity-0" : ""}`}
			onTransitionEnd={() => {
				deleteMe();
			}}
		>
			<PropagateLoader color={"rgb(34 197 94)"} loading={true} size={15} />
		</div>
	);
};

export default Loading;
