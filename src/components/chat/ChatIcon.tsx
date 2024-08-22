import React, { useEffect } from "react";
import useStomp from "@/hooks/useStomp";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useParams, Link } from "react-router-dom";

const ChatIcon: React.FC = () => {
	const { auth } = useAuth();
	const userId = auth?.userId;
	const { receivedMessage } = useStomp();
	const axiosPrivate = useAxiosPrivate();

	const { id } = useParams();
	const chatContactId = id ? parseInt(id) : undefined;

	const [hasUnreadMessages, setHasUnreadMessages] = React.useState<boolean>(false);
	const [latestMessageContactId, setLatestMessageContactId] = React.useState<number | undefined>(userId);

	const getUnreadMessages = async () => {
		try {
			const response = await axiosPrivate.get(`api/v1/chat/messages/has-unread-messages/${userId}`);

			setHasUnreadMessages(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getUnreadMessages();
	}, [receivedMessage, userId, chatContactId]);

	useEffect(() => {
		if (receivedMessage) {
			setLatestMessageContactId(receivedMessage.senderId);
		}
	}, [receivedMessage]);

	return (
		<div onClick={() => setHasUnreadMessages(false)}>
			<Link to={{ pathname: `/interaction/user/${latestMessageContactId}` }} title="Chat">
				<div className="text-xl">
					{hasUnreadMessages ? (
						<div className="relative flex animate-bounce items-center justify-center">
							<i className="bx bx-message-rounded-dots"></i>
							<p className="absolute bottom-2 left-4 text-3xl font-extrabold text-red-700">.</p>
						</div>
					) : (
						<i className="bx bx-message-rounded-dots"></i>
					)}
				</div>
			</Link>
		</div>
	);
};

export default ChatIcon;
