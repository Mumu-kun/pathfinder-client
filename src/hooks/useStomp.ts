import StompContext from "@/context/StompProvider";
import { useContext } from "react";

const useStomp = () => {
	return useContext(StompContext);
};

export default useStomp;
