import { Mode } from "@/context/ModeProvider";
import useMode from "@/hooks/useMode";
import { Outlet } from "react-router-dom";

type props = {
	mode: Mode;
};

const SetMode = ({ mode: propMode }: props) => {
	const { mode, changeMode } = useMode();

	mode !== propMode && changeMode(propMode);

	return <Outlet />;
};

export default SetMode;
