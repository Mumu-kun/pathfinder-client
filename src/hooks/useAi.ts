import AIContext from "@/context/AIProvider";
import { useContext } from "react";

const useAI = () => {
	return useContext(AIContext);
};

export default useAI;
