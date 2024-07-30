import React, { useEffect } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import { Stomp } from "@stomp/stompjs";

import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ChatWindow: React.FC = () => {
	const { auth } = useAuth();
	const senderId = auth?.userId;
	const senderEmail = auth?.email;
	const { id } = useParams();
	const receiverId = id;
	const message = `hii there from user ${auth?.userId}`;

	useEffect(() => {
		connect();
	}, []);

	var stompClient: any = null;

	function connect() {
		console.log("connect");
		const socket = new SockJS("http://localhost:8080/ws");
		stompClient = Stomp.over(socket);

		stompClient.connect({Authorization: `Bearer ${auth?.accessToken}`}, onConnected, onError);
	}

	function onConnected() {
		console.log("connected");
		stompClient.subscribe(`/user/${senderEmail}/queue/messages`, onMessageReceived);
	}

	function onError(error: any) {
		console.log("error - ", error);
	}

	function onMessageReceived(payload: any) {
		const message = JSON.parse(payload.body);
		console.log("message - ", message);
	}

	function sendMessage(event: any) {
		const chatMessage = {
			senderId: senderId,
			receiverId: receiverId,
			message: message,
			timestamp: new Date(),
		};
		stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
		console.log("msg sent");

		event.preventDefault();
	}

	return (
		<div>
			<button onClick={sendMessage}>send msg</button>
		</div>
	);
};

export default ChatWindow;
