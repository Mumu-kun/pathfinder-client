import React from "react";

import useStomp from "@/hooks/useStomp";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ChatWindow: React.FC = () => {
	const { auth } = useAuth();
	const senderId = auth?.userId;
	const senderEmail = auth?.email;
	const { id } = useParams();
	const receiverId = id;
	const message = `hii there from user ${auth?.userId}`;

	const { isConnected, lastSentMessage, sendMessage } = useStomp();

	return (
		<div>
			<p>ChatWindow</p>
			{isConnected ? <p>connected</p> : <p>not connected</p>}
			<p>last sent message - {lastSentMessage}</p>
			<button
				onClick={() => {
					sendMessage("abc");
				}}
			>
				send msg
			</button>
		</div>
	);
};

export default ChatWindow;
