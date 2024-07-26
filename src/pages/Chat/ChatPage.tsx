// MVP: there will be 3 columns.
// left - list of users contacts
// middle - chat window with the selected contact
// right - some info. enrollment/session, create/accept, enrollment/session related info will be here.

import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ChatPage: React.FC = () => {
	const { id } = useParams();
    const {auth } = useAuth();

    console.log(id);
    console.log(auth?.firstName);

    // PROBLEM - cant access auth data.

	return (
		<div>
			<p className="text-center text-2xl">ChatPage</p>
			<div className="flex items-center justify-between">
				<div>
					<p>contacts</p>
				</div>
				<div>
					<p>chat window</p>
				</div>
				<div>
                    {/* // todo: let the seller create an enrollment.
                    // todo: let buyer see the created enrollment. */}
					<p>info</p>
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
