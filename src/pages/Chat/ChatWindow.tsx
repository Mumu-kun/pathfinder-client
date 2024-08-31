import React, { useEffect, useRef, useState } from "react";

import { TextInputComponent } from "@/components/FormComponents";
import Loading from "@/components/Loading";
import useStomp from "@/hooks/useStomp";
import { Field, Form, Formik } from "formik";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ChatMessage, ChatMessageInput } from "../../utils/types";
import NoContactSelected from "./components/NoContactSelected";
import { ReactTinyLink } from "react-tiny-link";

interface ChatWindowProps {
	messageSent: boolean;
	setMessageSent: React.Dispatch<React.SetStateAction<boolean>>;
	isHidden?: boolean;
}

interface CurrentContactData {
	fullName: string;
	profileImage?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messageSent, setMessageSent, isHidden = false }) => {
	const { auth } = useAuth();
	const senderId = auth?.userId;
	const { id } = useParams();
	const receiverId = id ? parseInt(id) : undefined;
	const axiosPrivate = useAxiosPrivate();
	const [pageInfo, setPageInfo] = useState({
		number: 0,
		numberOfElements: 0,
		last: true,
		totalElements: 0,
		totalPages: 0,
	});

	// console.log(auth);

	const [currentContactData, setCurrentContactData] = useState<CurrentContactData>({ fullName: "", profileImage: "" });

	useEffect(() => {
		const fetchContactData = async () => {
			if (!receiverId) return;

			try {
				const response = await axiosPrivate.get(`api/v1/users/find/${receiverId}`);
				// TODO: change profile_image to camelcase in the backend.
				setCurrentContactData({ fullName: response.data.fullName, profileImage: response.data.profile_image });
			} catch (error) {
				console.error(error);
			}
		};

		fetchContactData();
	}, [receiverId]);

	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

	// to refetch messages when a new message is sent.

	const fetchMessages = async (pageNum: number = 0) => {
		if (!senderId || !receiverId) return;

		try {
			const response = await axiosPrivate.get(`api/v1/chat/messages/${senderId}/${receiverId}?page=${pageNum}`);
			// console.log(response);

			setPageInfo({
				number: response.data.number,
				numberOfElements: response.data.numberOfElements,
				last: response.data.last,
				totalElements: response.data.totalElements,
				totalPages: response.data.totalPages,
			});

			if (pageNum === 0) {
				setChatMessages(response.data.content);
			} else {
				setChatMessages((prev) => [...prev, ...response.data.content]);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			fetchMessages();
		}, 100);
	
		return () => clearTimeout(timeoutId); // Cleanup to avoid multiple timeouts
	}, [senderId, receiverId, messageSent]);
	

	const { receivedMessage, sendMessage } = useStomp();

	useEffect(() => {
		const readSingleMessage = async (messageId: number) => {
			try {
				await axiosPrivate.put(`api/v1/chat/messages/read/${messageId}`);
			} catch (error) {
				console.error(error);
			}
		};

		if (receivedMessage) {
			// making sure wo don't show some other chat rooms msg in this chat window.
			if (receivedMessage.senderId === receiverId) {
				// setChatMessages([...chatMessages, receivedMessage]);
				fetchMessages();
			}

			// if the user is in the current chat room, make the msg seen.
			if (receivedMessage.senderId === receiverId) {
				readSingleMessage(receivedMessage.id);
			}
		}
	}, [receivedMessage]);

	// auto scroll to the bottom functionalty.
	const messagesEndRef = useRef<null | HTMLDivElement>(null);

	const scrollToBottom = () => {
		const scrollableDiv = document.getElementById("scrollableDiv");
		if (scrollableDiv) {
			scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom();
	}, [messageSent, receivedMessage]);

	useEffect(() => {
		const scrollableDiv = document.getElementById("scrollableDiv");
		const infScrollOuterDiv = document.querySelector("#scrollableDiv > div");

		if (!!scrollableDiv && !!infScrollOuterDiv) {
			if (scrollableDiv.clientHeight > infScrollOuterDiv.clientHeight && !pageInfo.last) {
				fetchMessages(pageInfo.number + 1);
			}
		}
	}, [chatMessages]);

	const isValidUrl = (text: string) => {
		try {
			new URL(text);
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<div
			className="flex flex-1 flex-col self-stretch"
			style={{
				display: isHidden ? "none" : undefined,
			}}
		>
			{senderId == receiverId ? (
				<NoContactSelected />
			) : (
				<>
					<Link to={`/profile/${senderId}`} className="medium-headings h-8 hover:underline">
						{currentContactData.fullName}
					</Link>
					<div
						className="flex min-h-0 flex-1 flex-col-reverse overflow-auto pl-4 pr-2 pt-2 scrollbar-thin"
						id="scrollableDiv"
					>
						{chatMessages.length === 0 && (
							<div className="flex flex-1 items-center justify-center">No messages to show</div>
						)}
						{chatMessages.length > 0 && (
							<InfiniteScroll
								dataLength={chatMessages.length}
								next={() => fetchMessages(pageInfo.number + 1)}
								hasMore={!pageInfo.last}
								loader={<Loading isTransparent />}
								scrollableTarget="scrollableDiv"
								inverse={true}
								className="flex flex-col-reverse"
								endMessage={
									<p style={{ textAlign: "center" }}>
										<b>Yay! You have seen it all</b>
									</p>
								}
							>
								{chatMessages.map((message, index) => {
									const prevSenderId = chatMessages[index + 1]?.senderId;

									const showSenderName = message.senderId !== prevSenderId;

									return (
										<div key={message.id}>
											{showSenderName && (
												<p
													className={`flex ${message.senderId === senderId ? "justify-end" : "justify-start"} p-1 text-xs`}
												>
													{message.senderId === senderId ? "You" : message.senderFullName}
												</p>
											)}
											<div className={`flex ${message.senderId === senderId ? "justify-end" : "justify-start"} py-0.5`}>
												<p className="normal-text max-w-72 break-all rounded-md bg-green-300 px-3 py-2 text-left dark:bg-green-600">
													{isValidUrl(message.message) ? (
														<ReactTinyLink
															cardSize="small"
															showGraphic={true}
															maxLine={2}
															minLine={1}
															url={message.message}
															onError={<p>{message.message}</p>}
														/>
													) : (
														message.message
													)}
												</p>
											</div>
										</div>
									);
								})}
							</InfiniteScroll>
						)}
					</div>

					<Formik
						initialValues={{ message: "" }}
						onSubmit={async (values, { resetForm }) => {
							if (!values.message) {
								return;
							}

							const chatMessageInput: ChatMessageInput = {
								senderId: senderId,
								receiverId: receiverId,
								message: values.message,
								timeStamp: new Date().toISOString(),
							};

							console.log(chatMessageInput);

							try {
								await sendMessage(chatMessageInput);
								setMessageSent((prev) => !prev);

								// setChatMessages([{ ...chatMessageInput, senderFullName: "You", read: false }, ...chatMessages, ]);

								resetForm();
							} catch (error) {
								console.error("Error sending message:", error);
								// Handle the error appropriately, e.g., by showing a notification to the user
							}
						}}
					>
						{({ isSubmitting }) => (
							<Form className="mt-2 flex items-center justify-center gap-2 px-4">
								<Field
									name="message"
									type="text"
									placeholder="Enter a message"
									isFullWidth
									isGrid
									component={TextInputComponent}
									className="!rounded"
								/>

								<button type="submit" className="solid-btn self-stretch px-4 py-0" disabled={isSubmitting}>
									Send
								</button>
							</Form>
						)}
					</Formik>

					{/* <div ref={messagesEndRef}></div> */}
				</>
			)}
		</div>
	);
};

export default ChatWindow;
