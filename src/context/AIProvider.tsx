import axios from "@/api/axios";
import React, { createContext, ReactNode, useState } from "react";

type AIGuideline = {
	topic: string;
	content?: string;
};

type AIContextProps = {
	guideline?: AIGuideline;
	getGuideline: (query: string) => void;
};

const AIContext = createContext<AIContextProps>({
	getGuideline: () => {},
});

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [guideline, setGuideline] = useState<AIGuideline | undefined>();

	const getGuideline = async (query: string) => {
		setGuideline({ topic: query });

		try {
			const res = await axios.get(`/api/v1/public/ai/guideline`, {
				params: {
					query,
				},
			});

			// console.log(res.data);

			setGuideline({ topic: query, content: res.data });
		} catch (error) {}
	};

	return <AIContext.Provider value={{ guideline, getGuideline }}>{children}</AIContext.Provider>;
};

export default AIContext;
