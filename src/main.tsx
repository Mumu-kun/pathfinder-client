import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@smastrom/react-rating/style.css";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { StompProvider } from "./context/StompProvider.tsx";
import { ThemeProvider } from "./context/ThemeProvide.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<AuthProvider>
			<StompProvider>
				<ThemeProvider>
					<App />
				</ThemeProvider>
			</StompProvider>
		</AuthProvider>
	</React.StrictMode>
);
