import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@smastrom/react-rating/style.css";
import "react-responsive-modal/styles.css";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { StompProvider } from "./context/StompProvider.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { ModeProvider } from "./context/ModeProvider.tsx";
import { AIProvider } from "./context/AIProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<AuthProvider>
			<StompProvider>
				<ThemeProvider>
					<ModeProvider>
						<AIProvider>
							<App />
						</AIProvider>
					</ModeProvider>
				</ThemeProvider>
			</StompProvider>
		</AuthProvider>
	</React.StrictMode>
);
