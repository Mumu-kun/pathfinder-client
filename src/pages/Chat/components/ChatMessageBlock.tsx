import { isValidUrl } from "@/utils/functions";
import { ChatMessage } from "@/utils/types";
import { ReactTinyLink } from "react-tiny-link";
import { useBoolean } from "usehooks-ts";

type ChatMessageBlockProps = {
	message: ChatMessage;
	showSenderName: boolean;
	senderId: number;
};

const ChatMessageBlock = ({ message, showSenderName, senderId }: ChatMessageBlockProps) => {
	const { value, toggle } = useBoolean(false);

	return (
		<div key={message.id}>
			{showSenderName && (
				<p className={`flex ${message.senderId === senderId ? "justify-end" : "justify-start"} p-1 text-xs`}>
					{message.senderId === senderId ? "You" : message.senderFullName}
				</p>
			)}
			{value && (
				<p className={`flex ${message.senderId === senderId ? "justify-end" : "justify-start"} p-1 text-xs`}>
					{message.timeStamp}
				</p>
			)}
			<div
				className={`flex ${message.senderId === senderId ? "justify-end" : "justify-start"} py-0.5`}
				onClick={toggle}
			>
				<p className="normal-text max-w-80 rounded-md bg-green-300 px-3 py-2 text-left dark:bg-green-600">
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
};

export default ChatMessageBlock;
