import React, { useState, useEffect } from "react";
import ManagementNavbar from "./ManagementNavbar";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Gig } from "@/utils/types";

const UnacceptedGigs = () => {
	const axiosPrivate = useAxiosPrivate();
	const [unacceptedGigs, setUnacceptedGigs] = useState<Gig[]>([]);

	useEffect(() => {
		const getUnacceptedGigs = async () => {
			try {
				const response = await axiosPrivate.get("api/v1/platform-management/gigs/unaccepted");
				console.log(response.data);
				setUnacceptedGigs(response.data.content);
			} catch (error) {
				console.log(error);
			}
		};

		getUnacceptedGigs();
	}, []);

	const accpetGig = async (gigId: number) => {
		try {
			await axiosPrivate.put(`api/v1/platform-management/accept-gig/${gigId}`);
			setUnacceptedGigs(unacceptedGigs.filter((gig) => gig.id !== gigId));
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			<ManagementNavbar />
			<div>
				{unacceptedGigs.length > 0 ? (
					<div>
						<p className="small-headings">Unaccepted Gigs</p>
						{/* // todo : improve gig data here. */}
						{unacceptedGigs.map((gig) => (
							<div
								key={gig.id}
								className="flex items-center justify-between border-b bg-light-secondary p-2 dark:bg-dark-secondary rounded m-2"
							>
								<p>{gig.title}</p>
								<button onClick={() => accpetGig(gig.id)} className="solid-btn-sm">
									Accept
								</button>
							</div>
						))}
					</div>
				) : (
					<p className="small-headings">No unaccepted gigs</p>
				)}
			</div>
		</div>
	);
};

export default UnacceptedGigs;
