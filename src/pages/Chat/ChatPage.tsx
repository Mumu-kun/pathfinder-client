// MVP: there will be 3 columns.
// left - list of users contacts
// middle - chat window with the selected contact
// right - some info. enrollment/session, create/accept, enrollment/session related info will be here.

import { UnlimitLayoutWidth } from "@/components/wrappers/LimitLayoutWidth";
import React, { useEffect, useState } from "react";
import { useBoolean, useMediaQuery } from "usehooks-ts";
import ChatWindow from "./ChatWindow";
import Contacts from "./Contacts";
import Controls from "./Controls";

const ChatPage: React.FC = () => {
	// console.log(id);
	// console.log(auth?.userId);

	// PROBLEM - cant access auth data.

	// this state is passed as a prop because when a new message is sent
	// in the ChatWindow component, we want the info real-time in the Contacts component,
	// to fetch the chat rooms again.
	const [messageSent, setMessageSent] = useState<boolean>(false);

	const isMediaSM = useMediaQuery("(min-width: 640px)");
	const isMediaLG = useMediaQuery("(min-width: 800px)");

	const {
		value: isContactsExpanded,
		toggle: toggleContactsExpanded,
		setValue: setContactsExpanded,
	} = useBoolean(isMediaSM);

	const {
		value: isControlsExpanded,
		toggle: toggleControlsExpanded,
		setValue: setControlsExpanded,
	} = useBoolean(isMediaLG);

	const mediaState: string = isMediaLG ? "LG" : isMediaSM ? "SM" : "XS";

	useEffect(() => {
		if (!isMediaLG) {
			setControlsExpanded(false);
			if (!isMediaSM) {
				setContactsExpanded(false);
			}
		}
	}, [isMediaSM, isMediaLG]);

	return (
		<UnlimitLayoutWidth>
			{/* <p className="text-center text-2xl">ChatPage</p> */}
			<div className="flex min-h-0 flex-1 py-4">
				<div
					className="border-r-2"
					style={{
						flex: isContactsExpanded ? (!isMediaSM ? "1" : "0 0 16rem") : "none",
					}}
				>
					<Contacts
						messageSent={messageSent}
						{...{
							isContactsExpanded,
							toggleContactsExpanded: () => {
								if (mediaState !== "XS") {
									toggleContactsExpanded();

									return;
								}

								toggleContactsExpanded();
								setControlsExpanded(false);
							},
						}}
					/>
				</div>

				<ChatWindow
					messageSent={messageSent}
					setMessageSent={setMessageSent}
					isHidden={
						mediaState === "SM"
							? isControlsExpanded
							: mediaState === "XS"
								? isControlsExpanded || isContactsExpanded
								: false
					}
				/>

				{/* <div> */}
				{/* // todo: let the seller create an enrollment.
                    // todo: let buyer see the created enrollment. */}
				<div
					className="ml-2 flex flex-col items-center border-l-2"
					style={{
						flex: isControlsExpanded ? (!isMediaLG ? "1" : "0 0 24rem") : "none",
					}}
				>
					<Controls
						{...{
							isControlsExpanded,
							toggleControlsExpanded: () => {
								if (mediaState !== "XS") {
									toggleControlsExpanded();

									return;
								}

								toggleControlsExpanded();
								setContactsExpanded(false);
							},
						}}
					/>
				</div>
				{/* </div> */}
			</div>
		</UnlimitLayoutWidth>
	);
};

export default ChatPage;
