import useStomp from "@/hooks/useStomp";
import { userProfileImageUrl } from "@/utils/functions";
import { ChatRoom } from "@/utils/types";
import { defaultProfileImage } from "@/utils/variables";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

interface ContactsProps {
	messageSent: boolean;
	isContactsExpanded: boolean;
	toggleContactsExpanded: () => void;
}

const Contacts: React.FC<ContactsProps> = ({
	messageSent,
	isContactsExpanded: isExpanded,
	toggleContactsExpanded: toggleExpanded,
}) => {
	const { id } = useParams();
	const urlId = id ? parseInt(id) : undefined;
	const { auth } = useAuth();

	const userId = auth?.userId;
	const axiosPrivate = useAxiosPrivate();
	const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

	const { receivedMessage } = useStomp();

	// trying to fix bug 1
	const [messageReceivedState, setMessageRecivedState] = useState<boolean>(false);

	useEffect(() => {
		const getContacts = async () => {
			try {
				const response = await axiosPrivate.get(`api/v1/chat-room/all/${userId}`);
				// console.log(response.data);
				setChatRooms(response.data);
			} catch (error) {
				console.error(error);
			}
		};

		getContacts();
	}, [userId, urlId, messageSent, messageReceivedState]);

	// fixed-(gojamil diya). Should be good enough if we add loading. BUG 1 - when im in a chat room and a new message received for that chatroom, the chat shows read(int the list)
	// but if i go to a diff chat room and come back, it shows unread.

	// possibly fixed. BUG 2 - when a new message is sent, from the senders view, the contacts sometimes do not update.
	// most likely a issue with the states not updating properly. Have to look into this.

	// handle real-time stuff when a message is received.
	useEffect(() => {
		setMessageRecivedState(!messageReceivedState);

		if (!receivedMessage) return;
		let receivedChatId = receivedMessage.chatId;

		// corresponding chat room
		let currChatRoom = chatRooms.find((chatRoom) => chatRoom.chatId === receivedChatId);
		if (!currChatRoom) {
			// new incoming message from a NEW user.
			currChatRoom = {
				id: null, // we possible may not need the id here(we actually do not know the id in this case.)
				chatId: receivedChatId,
				firstUserId: receivedMessage.senderId,
				firstUserFullName: receivedMessage.senderFullName,
				secondUserId: receivedMessage.receiverId,
				secondUserFullName: receivedMessage.receiverFullName,
				lastActive: receivedMessage.timeStamp,
				lastMessage: receivedMessage,
			};
		}

		currChatRoom.lastMessage = receivedMessage;

		// delete the chatRoom from chat rooms and append it at the front because we want the
		// latest msg to be on top.
		if (currChatRoom) {
			setChatRooms((prevChatRooms) => {
				const filteredChatRooms = prevChatRooms.filter((room) => room.chatId !== receivedChatId);
				return [currChatRoom, ...filteredChatRooms];
			});
		}
	}, [receivedMessage]);

	return (
		<>
			<div
				className="hover-effect-no-shadow mx-auto flex h-8 cursor-pointer items-center justify-center gap-2 px-4"
				onClick={toggleExpanded}
			>
				<i className="bx bx-message-rounded-dots text-2xl"></i>
				<p
					className="small-headings text-center"
					style={{
						display: isExpanded ? "block" : "none",
					}}
				>
					Contacts
				</p>
			</div>
			<div className="my-2 space-y-1 px-2">
				{chatRooms.map((chatRoom) => {
					const senderId = chatRoom.firstUserId == userId ? chatRoom.secondUserId : chatRoom.firstUserId;

					return (
						<Link
							key={chatRoom.id}
							className={`border-b border-light-secondary hover:bg-light-secondary dark:border-dark-secondary dark:hover:bg-dark-secondary ${urlId == senderId ? "rounded-md bg-light-secondary dark:bg-dark-secondary" : ""} flex flex-shrink items-center gap-2 px-2 py-2 transition-all`}
							to={{ pathname: `/interaction/user/${senderId}` }}
						>
							{/* // here the 3rd condition makes sure when I click on a new unseen chat, it becomes seen on the frontend right away. */}
							<img
								src={userProfileImageUrl(senderId)}
								onError={({ currentTarget }) => {
									currentTarget.onerror = null;
									currentTarget.src = defaultProfileImage;
								}}
								style={{
									background: `url(${defaultProfileImage}) center center / cover no-repeat`,
								}}
								className={`h-10 w-10 rounded-full object-cover object-center ${chatRoom?.lastMessage?.read || chatRoom?.lastMessage?.senderId == userId || chatRoom?.lastMessage?.senderId == urlId ? "" : "outline outline-2 outline-red-500"}`}
								title={chatRoom.firstUserId == userId ? chatRoom.secondUserFullName : chatRoom.firstUserFullName}
							/>
							<div
								className={`${chatRoom?.lastMessage?.read || chatRoom?.lastMessage?.senderId == userId || chatRoom?.lastMessage?.senderId == urlId ? "" : "font-bold"} min-w-0 max-w-[16rem] overflow-hidden`}
								style={{
									display: isExpanded ? "block" : "none",
								}}
							>
								{chatRoom.firstUserId == userId ? (
									<p className="text-left font-medium">{chatRoom.secondUserFullName}</p>
								) : (
									<p className="text-left font-medium">{chatRoom.firstUserFullName}</p>
								)}

								{chatRoom?.lastMessage?.senderId == userId ? (
									<p className="w-full truncate text-sm">Me: {chatRoom?.lastMessage?.message}</p>
								) : (
									<p className="w-full truncate text-sm">{chatRoom?.lastMessage?.message}</p>
								)}
							</div>
						</Link>
					);
				})}
			</div>
		</>
	);
};

export default Contacts;
