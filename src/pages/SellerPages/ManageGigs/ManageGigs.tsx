import Dropdown from "@/components/Dropdown";
import GigCard from "@/components/GigCard";
import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { getGigCards } from "@/pages/Profile/Profile";
import { coverImageUrl, fullImageUrl } from "@/utils/functions";
import { Gig, GigCardData } from "@/utils/types";
import { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { Link } from "react-router-dom";

type Props = {};

const ManageGigs = (props: Props) => {
	const [gigs, setGigs] = useState<Gig[] | undefined>();

	const { auth } = useAuth();

	const axiosPrivate = useAxiosPrivate();

	const getGigs = async () => {
		try {
			const res = await axiosPrivate.get(`api/v1/public/users/${auth!.userId}/gigs`);

			setGigs(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getGigs();
	}, []);

	return (
		<>
			<div className="semilarge-headings mt-8 rounded-sm pb-4 pl-6 text-left text-green-500">Manage Gigs</div>

			<div className="grid grid-cols-[5rem_auto_repeat(6,max-content)] gap-x-4 text-sm">
				<div className="col-span-full my-2 grid grid-cols-subgrid border-b border-zinc-300 py-2 font-bold">
					<div></div>
					<div>Gig</div>
					<div>Visits</div>
					<div>Ongoing</div>
					<div>Completed</div>
					<div>Earning</div>
					<div>Rating</div>
					<div></div>
				</div>
				{gigs ? (
					gigs.map((gig) => (
						<div className="col-span-full grid grid-cols-subgrid items-center py-1" key={`manageGig-${gig.id}`}>
							<img src={coverImageUrl(gig.gigCoverImage)} alt="" className="aspect-[2/1] object-cover" />
							<Link to={`/gigs/${gig.id}`} className="hover:underline">
								{gig.title}
							</Link>
							<div className="text-center">0</div>
							<div className="text-center">0</div>
							<div className="text-center">0</div>
							<div className="text-center">0</div>
							<div className="text-center">0</div>
							<Dropdown
								head={<FaAngleDown />}
								rightAlign
								dropdownClassName="mt-2 min-w-20 rounded-md flex flex-col bg-light-bg text-center transition-all dark:bg-dark-bg"
							>
								<div className="self-stretch px-2 py-1 hover:bg-green-400 hover:text-white">Publish</div>
								<div className="self-stretch px-2 py-1 hover:bg-yellow-400 hover:text-white">Edit</div>
								<div className="self-stretch px-2 py-1 hover:bg-red-400 hover:text-white">Delete</div>
							</Dropdown>
						</div>
					))
				) : (
					<div className="col-span-full aspect-video">
						<Loading />
					</div>
				)}
			</div>
		</>
	);
};

export default ManageGigs;
