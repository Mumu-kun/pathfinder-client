import axios from "@/api/axios";
import React, { createContext, ReactNode, useState } from "react";

// Define the context interface
type AIContextProps = {
	guideline?: string;
	getGuideline: (query: string) => void;
};

// Create the context
export const AIContext = createContext<AIContextProps>({
	getGuideline: () => {},
});

// Create the provider component
export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [guideline, setGuideline] = useState<string | undefined>();

	const getGuideline = async (query: string) => {
		try {
			const res = await axios.get(`/api/v1/public/ai/guideline`, {
				params: {
					query,
				},
			});

			setGuideline(res.data);
		} catch (error) {}
	};

	return <AIContext.Provider value={{ guideline, getGuideline }}>{children}</AIContext.Provider>;
};
