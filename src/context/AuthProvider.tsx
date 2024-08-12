import { AuthUser } from "@/utils/types";
import { createContext, useState, FC, ReactNode, useEffect } from "react";

type AuthContextProps = {
	auth: AuthUser | null | undefined;
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
	const [auth, setAuth] = useState<AuthUser | null | undefined>();
	const localStoragePersist = localStorage.getItem("persist_login");
	const [persist, setPersist] = useState<boolean>(localStoragePersist ? JSON.parse(localStoragePersist) : false);

	useEffect(() => {
		if (persist) {
			auth !== null ? auth && localStorage.setItem("auth", JSON.stringify(auth)) : localStorage.removeItem("auth");
		}
	}, [auth]);

	return <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
