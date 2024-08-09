import useAuth from "@/hooks/useAuth";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { ChatMessage, Notification } from "@/utils/types";

type StompContextProps = {
	receivedMessage?: ChatMessage;
	receivedNotification?: Notification;
	sendMessage: (chatMessage: any) => Promise<void>;
	isConnected: boolean;
};

const StompContext = createContext<StompContextProps>({
	receivedMessage: undefined,
	receivedNotification: undefined,
	sendMessage: async () => {
		return Promise.resolve();
	},
	isConnected: false,
});

export const StompProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const { auth } = useAuth();

	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [receivedMessage, setReceivedMessage] = useState<ChatMessage>();
	const [receivedNotification, setReceivedNotification] = useState<Notification>();

	const senderEmail = auth?.email;

	const [stompClient] = useState<CompatClient>(
		Stomp.over(() => {
			return new SockJS("http://localhost:8080/ws");
		})
	);

	function connect() {
		stompClient.connect({ Authorization: `Bearer ${auth?.accessToken}` }, onConnected, onError);
		console.log("connected : ", stompClient.connected);
	}

	function onConnected() {
		stompClient.subscribe(`/user/${senderEmail}/queue/messages`, onMessageReceived);
		setIsConnected(true);
		console.log("connected");

		// notifications
		stompClient.subscribe(`/user/${senderEmail}/queue/notifications`, onNotificationReceived);
	}

	function onError(error: any) {
		console.log("error - ", error);
	}

	function onMessageReceived(payload: any) {
		const message = JSON.parse(payload.body);
		console.log("message - ", message);
		setReceivedMessage(message);
	}

	function onNotificationReceived(payload: any) {
		const notification = JSON.parse(payload.body);
		console.log("notif - ", notification);
		setReceivedNotification(notification);
	}

	const sendMessage = async (chatMessage: any): Promise<void> => {
		return new Promise<void>((resolve, reject) => {
			try {
				stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
				console.log("msg sent");
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	};

	useEffect(() => {
		!!senderEmail && connect();

		return () => {
			setIsConnected(false);
			stompClient.connected && stompClient.disconnect();
		};
	}, [senderEmail]);

	return (
		<StompContext.Provider value={{ isConnected, receivedMessage, receivedNotification, sendMessage }}>
			{children}
		</StompContext.Provider>
	);
};

export default StompContext;
