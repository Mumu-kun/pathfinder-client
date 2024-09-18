import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { coverImageUrl, sleep } from "@/utils/functions";
import { GigManage } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import ManageGigsList from "./ManageGigsList";
import { toast } from "react-toastify";

const ManageGigs = () => {
	const [gigs, setGigs] = useState<GigManage[] | undefined>();

	const publishedGigs = useMemo(() => gigs?.filter((gig) => !gig.paused), [gigs]);
	const unpublishedGigs = useMemo(() => gigs?.filter((gig) => gig.paused), [gigs]);
	const hasUnacceptedGigs = useMemo(() => (gigs?.filter((gig) => !gig.accepted).length ?? 0) > 0, [gigs]);

	const axiosPrivate = useAxiosPrivate();

	const getGigs = async () => {
		try {
			const res = axiosPrivate.get(`api/v1/users/my/gigs/manage`);

			await Promise.all([res, sleep(500)]);

			const data: any = (await res).data;

			setGigs(data);
		} catch (error) {
			console.error(error);
		}
	};

	const toggleGigPublish = async (gig: GigManage) => {
		try {
			await axiosPrivate.put(`/api/v1/gigs/pause-unpause-gig/${gig.id}`);

			const newGigs = gigs?.map((g) => (g.id === gig.id ? { ...g, paused: !g.paused } : g));

			setGigs(newGigs);

			toast.success(`Gig set as ${gig.paused ? "published" : "unpublished"}`);
		} catch (error) {
			console.error(error);
		}
	};

	const [gigDelete, setGigDelete] = useState<GigManage | undefined>();

	useEffect(() => {
		getGigs();
	}, []);

	return (
		<>
			<div className="medium-headings mt-8 rounded-sm pb-4 pl-6 text-left text-green-500">Manage Gigs</div>

			{hasUnacceptedGigs && (
				<div className="mb-4 rounded-sm bg-red-300 p-2 text-center font-medium dark:bg-red-400">
					Gigs marked in red are not accepted yet. Please wait for the admin to accept them.
				</div>
			)}
			<div className="small-headings text-left">Published</div>
			<ManageGigsList gigs={publishedGigs} toggleGigPublish={toggleGigPublish} setGigDelete={setGigDelete} />

			<div className="small-headings mt-8 text-left">Unpublished</div>
			<ManageGigsList gigs={unpublishedGigs} toggleGigPublish={toggleGigPublish} setGigDelete={setGigDelete} />

			<Link to="create" className="solid-btn mx-auto my-4 inline-block w-fit justify-self-center">
				Create a New Gig
			</Link>

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
