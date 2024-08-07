import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ChatRoom } from "@/utils/types";
import useStomp from "@/hooks/useStomp";

interface ContactsProps {
	messageSent: boolean;
}

const Contacts: React.FC<ContactsProps> = ({ messageSent }) => {
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
		console.log('useeffect ran');
		const getContacts = async () => {
			try {
				const response = await axiosPrivate.get(`api/v1/chat-room/all/${userId}`);
				console.log(response.data);
				setChatRooms(response.data);
			} catch (error) {
				console.log(error);
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
		<div>
			<p className="text-center text-2xl">Contacts</p>
			<div>
				{chatRooms.map((chatRoom) => {
					return (
						<div key={chatRoom.id}>
							<Link
								to={
									userId == chatRoom.firstUserId
										? { pathname: `/message/user/${chatRoom.secondUserId}` }
										: { pathname: `/message/user/${chatRoom.firstUserId}` }
								}
							>
								{/* // here the 3rd condition makes sure when I click on a new unseen chat, it becomes seen on the frontend right away. */}
								<div
									className={`${chatRoom?.lastMessage?.read || chatRoom?.lastMessage?.senderId == userId || chatRoom?.lastMessage?.senderId == urlId ? "" : "font-bold"}`}
								>
									{chatRoom.firstUserId == userId ? (
										<p className="text-left text-lg">{chatRoom.secondUserFullName}</p>
									) : (
										<p className="text-left text-lg">{chatRoom.firstUserFullName}</p>
									)}

									{chatRoom?.lastMessage?.senderId == userId ? (
										<p>Me: {chatRoom?.lastMessage?.message}</p>
									) : (
										<p>{chatRoom?.lastMessage?.message}</p>
									)}
								</div>
							</Link>
							<hr />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default Contacts;
