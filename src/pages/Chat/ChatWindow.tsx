import React, { useState, useEffect, useRef } from "react";

import useStomp from "@/hooks/useStomp";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { ChatMessageInput, ChatMessage } from "../../utils/types";
// import axiosPrivate from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import NoContactSelected from "./NoContactSelected";

interface ChatWindowProps {
	messageSent: boolean;
	setMessageSent: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CurrentContactData {
	fullName: string;
	profileImage?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messageSent, setMessageSent }) => {
	const { auth } = useAuth();
	const senderId = auth?.userId;
	const { id } = useParams();
	const receiverId = id ? parseInt(id) : undefined;
	const [message, setMessage] = useState<string>("");
	const axiosPrivate = useAxiosPrivate();

	const chatMessageInput: ChatMessageInput = {
		senderId: senderId,
		receiverId: receiverId,
		message: message,
		timeStamp: new Date().toISOString(),
	};

	const [currentContactData, setCurrentContactData] = useState<CurrentContactData>({ fullName: "", profileImage: "" });

	useEffect(() => {
		const fetchContactData = async () => {
			if (!receiverId) return;

			try {
				const response = await axiosPrivate.get(`api/v1/users/find/${receiverId}`);
				// TODO: change profile_image to camelcase in the backend.
				setCurrentContactData({ fullName: response.data.fullName, profileImage: response.data.profile_image });
			} catch (error) {
				console.log(error);
			}
		};

		fetchContactData();
	}, [receiverId]);

	useEffect(() => {
		chatMessageInput.senderId = senderId;
		chatMessageInput.receiverId = receiverId;
		chatMessageInput.message = message;
		chatMessageInput.timeStamp = new Date().toISOString();
	}, [senderId, receiverId, message]);

	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

	// to refetch messages when a new message is sent.

	useEffect(() => {
		const fetchMessages = async () => {
			if (!senderId || !receiverId) return;

			try {
				const response = await axiosPrivate.get(`api/v1/chat/messages/${senderId}/${receiverId}`);
				console.log(response.data);
				setChatMessages(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		fetchMessages();
	}, [senderId, receiverId, messageSent]);

	const { isConnected, receivedMessage, sendMessage } = useStomp();

	useEffect(() => {
		const readSingleMessage = async (messageId: number) => {
			try {
				await axiosPrivate.put(`api/v1/chat/messages/read/${messageId}`);
			} catch (error) {
				console.log(error);
			}
		};

		if (receivedMessage) {
			// making sure wo don't show some other chat rooms msg in this chat window.
			if (receivedMessage.senderId === receiverId) {
				setChatMessages([...chatMessages, receivedMessage]);
			}

			// if the user is in the current chat room, make the msg seen.
			if (receivedMessage.senderId === receiverId) {
				readSingleMessage(receivedMessage.id);
			}
		}
	}, [receivedMessage]);

	const formSubmitted = (e: React.FormEvent) => {
		e.preventDefault();
		chatMessageInput.timeStamp = new Date().toISOString();
		console.log(chatMessageInput);

		sendMessage(chatMessageInput)
			.then(() => {
				// Clear the input field and update the state to indicate the message was sent
				setMessage("");
				setMessageSent(!messageSent);
			})
			.catch((error) => {
				console.error("Error sending message:", error);
				// Handle the error appropriately, e.g., by showing a notification to the user
			});
	};

	let prevSenderId: number | null = null;

	// auto scroll to the bottom functionalty.
	const messagesEndRef = useRef<null | HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messageSent, receivedMessage]);

	return (
		<div className="w-[500px] px-5">
			{senderId == receiverId ? (
				<NoContactSelected />
			) : (
				<div>
					<div className="">
						<p className="small-headings">{currentContactData.fullName}</p>
						{chatMessages.length === 0 && <div>No messages to show</div>}
						{chatMessages.map((message, index) => {
							const showSenderName = message.senderId !== prevSenderId;

							// Update prevSenderId for next iteration
							prevSenderId = message.senderId;

							return (
								<div key={message.id}>
									{showSenderName && (
										<p
											className={`flex ${message.senderId === senderId ? "justify-end" : "justify-start"} p-1 text-xs`}
										>
											{message.senderId === senderId ? "You" : message.senderFullName}
										</p>
									)}
									<div className={`flex ${message.senderId === senderId ? "justify-end" : "justify-start"} p-1`}>
										<p className="normal-text rounded-md bg-light-secondary px-2 py-1 dark:bg-dark-secondary">
											{message.message}
										</p>
									</div>
								</div>
							);
						})}
					</div>
					<div className="flex justify-center">
						<form onSubmit={formSubmitted} className="fixed bottom-5">
							<div className="flex items-center justify-center">
								<input
									type="text"
									placeholder="Enter a message"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
								/>
								<button type="submit">Send</button>
							</div>
						</form>
					</div>
					<div className="pb-16"></div>
					<div ref={messagesEndRef}></div>
				</div>
			)}
		</div>
	);
};

export default ChatWindow;
