import { createContext, useState, FC, ReactNode } from "react";

type AuthContextProps = {
	auth: any;
	setAuth: (auth: any) => void;
};

const AuthContext = createContext<AuthContextProps>({ auth: null, setAuth: () => {} });

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [auth, setAuth] = useState({});

	return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
