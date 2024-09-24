import Dropdown from "@/components/Dropdown";
import Loading from "@/components/Loading";
import { coverImageUrl } from "@/utils/functions";
import { GigManage } from "@/utils/types";
import React from "react";
import { FaAngleDown } from "react-icons/fa6";
import { TbCurrencyTaka } from "react-icons/tb";
import { Link } from "react-router-dom";

type Props = {
	gigs: GigManage[] | undefined;
	toggleGigPublish: (gig: GigManage) => Promise<void>;
	setGigDelete: React.Dispatch<React.SetStateAction<GigManage | undefined>>;
};

const ManageGigsList = ({ gigs, toggleGigPublish, setGigDelete }: Props) => {
	return (
		<div className="grid grid-cols-[5rem_1fr_repeat(6,auto)] gap-x-4 gap-y-1 text-sm max-sm:grid-cols-[3rem_1fr_repeat(6,auto)]">
			<div className="col-span-full mb-2 grid grid-cols-subgrid border-b border-zinc-300 py-2 pr-2 font-bold">
				<div></div>
				<div className="mr-auto">Gig</div>
				<div>Score</div>
				<div>Ongoing</div>
				<div>Completed</div>
				<div>Earning</div>
				<div>Rating</div>
				<div>
					<FaAngleDown className="invisible" />
				</div>
			</div>
			{gigs ? (
				gigs.length > 0 ? (
					gigs.map((gig) => (
						<div
							className={`col-span-full grid grid-cols-subgrid items-center rounded p-1 pr-2 ${!gig.accepted ? "bg-red-300 font-medium dark:bg-red-400" : ""}`}
							key={`manageGig-${gig.id}`}
						>
							<img
								src={coverImageUrl(gig.gigCoverImage)}
								alt=""
								className="aspect-[2/1] w-full rounded-sm object-cover"
							/>
							<Link to={`/gig/${gig.id}`} className="hover:underline">
								{gig.title}
							</Link>
							<div className="text-center">{gig.score}</div>
							<div className="text-center">{gig.ongoing}</div>
							<div className="text-center">{gig.completed}</div>
							<div className="flex items-center text-center">
								<TbCurrencyTaka className="h-4 w-4" /> {gig.earning}
							</div>
							<div className="text-center">{gig.rating}</div>
							<Dropdown
								head={<FaAngleDown />}
								rightAlign
								dropdownClassName="mt-2 min-w-20 rounded-md flex flex-col bg-light-bg text-center transition-all dark:bg-dark-bg"
							>
								<div
									className={`cursor-pointer self-stretch px-2 py-1 transition-all duration-100 hover:text-white ${gig.paused ? "hover:bg-green-400" : "hover:bg-red-400"}`}
									onClick={() => toggleGigPublish(gig)}
								>
									{gig.paused ? "Publish" : "Unpublish"}
								</div>
								<Link to={`/gig/${gig.id}`} className="block self-stretch px-2 py-1 hover:bg-zinc-400 hover:text-white">
									View
								</Link>
								<Link
									to={`${gig.id}/edit`}
									className="block self-stretch px-2 py-1 hover:bg-amber-400 hover:text-white"
								>
									Edit
								</Link>
								<div
									className="cursor-pointer self-stretch px-2 py-1 hover:bg-red-400 hover:text-white"
									onClick={() => setGigDelete(gig)}
								>
									Delete
								</div>
							</Dropdown>
						</div>
					))
				) : (
					<div className="col-span-full my-2 inline-block w-fit justify-self-center font-medium">No Gigs To Show</div>
				)
			) : (
				<div className="col-span-full aspect-video">
					<Loading />
				</div>
			)}
		</div>
	);
};

export default ManageGigsList;
