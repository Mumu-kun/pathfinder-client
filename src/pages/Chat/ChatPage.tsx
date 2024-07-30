// MVP: there will be 3 columns.
// left - list of users contacts
// middle - chat window with the selected contact
// right - some info. enrollment/session, create/accept, enrollment/session related info will be here.

import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Contacts from "./Contacts";
import ChatWindow from "./ChatWindow";
import Controls from "./Controls";

const ChatPage: React.FC = () => {
	const { id } = useParams();
	const { auth } = useAuth();

	console.log(id);
	console.log(auth?.userId);

	// PROBLEM - cant access auth data.

	return (
		<div>
			<p className="text-center text-2xl">ChatPage</p>
			<div className="flex items-center justify-between">
				<div>
					<Contacts />
				</div>
				<div>
					<ChatWindow />
				</div>
				<div>
					{/* // todo: let the seller create an enrollment.
                    // todo: let buyer see the created enrollment. */}
					<Controls />
				</div>
			</div>
			{auth?.email}
		</div>
	);
};

export default ChatPage;
