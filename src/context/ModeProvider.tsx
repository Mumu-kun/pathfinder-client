import { createContext, FC, ReactNode, useState } from "react";

// skipping mod/ admin for now.
export type Mode = "buyer" | "seller";

type ModeContextProps = {
	mode: Mode;
	changeMode: (mode: Mode) => void;
};

const ModeContext = createContext<ModeContextProps>({
	mode: "buyer",
	changeMode: (mode) => {},
});

export const ModeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const savedMode = localStorage.getItem("mode") as Mode | null;

    if(!savedMode) {
        localStorage.setItem("mode", "buyer");
    }

    const [mode, setMode] = useState<Mode>(savedMode || "buyer");

    const changeMode = (mode: Mode) => {
        console.log("mode changed");

        localStorage.setItem("mode", mode);

        setMode(mode);
    };

    return <ModeContext.Provider value={{ mode, changeMode }}>{children}</ModeContext.Provider>;
};

export default ModeContext;