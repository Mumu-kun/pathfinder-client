import Dropdown from "@/components/Dropdown";
import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { coverImageUrl, sleep } from "@/utils/functions";
import { Gig } from "@/utils/types";
import { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";

const ManageGigs = () => {
	const [gigs, setGigs] = useState<Gig[] | undefined>();

	const { auth } = useAuth();

	const axiosPrivate = useAxiosPrivate();

	const getGigs = async () => {
		try {
			const res = await axiosPrivate.get(`api/v1/public/users/${auth!.userId}/gigs`);

			await sleep(500);

			setGigs(res.data);
		} catch (error) {
			console.error(error);
		}
	};

	const [gigDelete, setGigDelete] = useState<Gig | undefined>();

	useEffect(() => {
		getGigs();
	}, []);

	return (
		<>
			<div className="semilarge-headings mt-8 rounded-sm pb-4 pl-6 text-left text-green-500">Manage Gigs</div>

			<div className="grid grid-cols-[5rem_1fr_repeat(6,auto)] gap-x-4 text-sm max-sm:grid-cols-[3rem_1fr_repeat(6,auto)]">
				<div className="col-span-full my-2 grid grid-cols-subgrid border-b border-zinc-300 py-2 font-bold">
					<div></div>
					<div className="mr-auto">Gig</div>
					<div>Visits</div>
					<div>Ongoing</div>
					<div>Completed</div>
					<div>Earning</div>
					<div>Rating</div>
					<div>
						<FaAngleDown className="invisible" />
					</div>
				</div>
				{gigs ? (
					<>
						{gigs.map((gig) => (
							<div className="col-span-full grid grid-cols-subgrid items-center py-1" key={`manageGig-${gig.id}`}>
								<img src={coverImageUrl(gig.gigCoverImage)} alt="" className="aspect-[2/1] w-full object-cover" />
								<Link to={`/gig/${gig.id}`} className="hover:underline">
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
									<Link
										to={`/gig/${gig.id}`}
										className="block self-stretch px-2 py-1 hover:bg-zinc-400 hover:text-white"
									>
										View
									</Link>
									<Link
										to={`${gig.id}/edit`}
										className="block self-stretch px-2 py-1 hover:bg-yellow-400 hover:text-white"
									>
										Edit
									</Link>
									<div
										className="self-stretch px-2 py-1 hover:bg-red-400 hover:text-white"
										onClick={() => setGigDelete(gig)}
									>
										Delete
									</div>
								</Dropdown>
							</div>
						))}
						<Link to="create" className="solid-btn col-span-full my-4 inline-block w-fit justify-self-center">
							Create a New Gig
						</Link>
					</>
				) : (
					<div className="col-span-full aspect-video">
						<Loading />
					</div>
				)}
			</div>

			<Modal
				open={!!gigDelete}
				onClose={() => setGigDelete(undefined)}
				closeIcon={<IoCloseCircleOutline className="h-6 w-6" />}
				classNames={{
					modalContainer: "!overflow-x-auto px-8 modal-grand-parent",
					modal: "rounded !p-12 dark:!bg-dark-secondary !max-w-[30rem] !mx-0 modal-parent",
				}}
				center
			>
				<div>
					<p className="small-headings">Are you sure you want to delete this gig?</p>
					<div
						className="flex h-20 items-center justify-center bg-light-secondary p-4"
						key={`manageGig-${gigDelete?.id}`}
					>
						<img src={coverImageUrl(gigDelete?.gigCoverImage)} alt="" className="aspect-[2/1] object-cover" />
						<Link to={`/gig/${gigDelete?.id}`} className="hover:underline">
							{gigDelete?.title}
						</Link>
					</div>
					<div className="flex items-center justify-center">
						<button className="solid-cancel-btn m-1" onClick={() => setGigDelete(undefined)}>
							No
						</button>
						<button className="solid-btn m-1" onClick={() => setGigDelete(undefined)}>
							Yes
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ManageGigs;
