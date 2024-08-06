// MVP: there will be 3 columns.
// left - list of users contacts
// middle - chat window with the selected contact
// right - some info. enrollment/session, create/accept, enrollment/session related info will be here.

import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Contacts from "./Contacts";
import ChatWindow from "./ChatWindow";
import Controls from "./Controls";
import axios from "../../api/axios";

const ChatPage: React.FC = () => {
	const { id } = useParams();
	const { auth } = useAuth();

	console.log(id);
	console.log(auth?.userId);

	// PROBLEM - cant access auth data.

	// this state is passed as a prop because when a new message is sent 
	// in the ChatWindow component, we want the info real-time in the Contacts component,
	// to fetch the chat rooms again.
	const [messageSent, setMessageSent] = useState<boolean>(false);

	return (
		<div>
			<p className="text-center text-2xl">ChatPage</p>
			<div className="flex justify-between">
				<div>
					<Contacts messageSent={messageSent}/>
				</div>
				<div>
					<ChatWindow messageSent={messageSent} setMessageSent={setMessageSent}/>
				</div>
				<div>
					{/* // todo: let the seller create an enrollment.
                    // todo: let buyer see the created enrollment. */}
					<Controls />
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
