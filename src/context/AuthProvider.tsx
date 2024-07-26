import { AuthUser } from "@/utils/types";
import { createContext, useState, FC, ReactNode } from "react";

type AuthContextProps = {
	auth: AuthUser | null;
	setAuth: (auth: any) => void;
	persist: boolean;
	setPersist: (persist: boolean) => void;
};

const AuthContext = createContext<AuthContextProps>({
	auth: null,
	setAuth: () => {},
	persist: false,
	setPersist: () => {},
});

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [auth, setAuth] = useState<AuthUser | null>(null);
	const localStoragePersist = localStorage.getItem("persist_login");
	const [persist, setPersist] = useState<boolean>(localStoragePersist ? JSON.parse(localStoragePersist) : false);

	return <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
