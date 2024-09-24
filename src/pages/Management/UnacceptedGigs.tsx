import Dropdown from "@/components/Dropdown";
import Loading from "@/components/Loading";
import Tag from "@/components/Tag";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { coverImageUrl, sleep } from "@/utils/functions";
import { Gig, Page } from "@/utils/types";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { TbCurrencyTaka } from "react-icons/tb";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ManagementNavbar from "./ManagementNavbar";

const UnacceptedGigs = () => {
	const axiosPrivate = useAxiosPrivate();
	const [unacceptedGigs, setUnacceptedGigs] = useState<Page<Gig> | undefined>();

	const [currPage, setCurrPage] = useState<number>(0);
	const pages = useMemo(() => {
		if (!unacceptedGigs) {
			return [0];
		}

		const start = Math.max(0, unacceptedGigs.number - 2);
		const end = Math.min(unacceptedGigs.totalPages, unacceptedGigs.number + 3);

		return Array.from({ length: end - start }, (_, i) => i + start);
	}, [unacceptedGigs]);

	const pageNav = (condition: boolean, pageNo: number) => {
		if (!condition) {
			return;
		}

		setCurrPage(pageNo);
	};

	const getUnacceptedGigs = async (page: number = 0) => {
		try {
			const res = await axiosPrivate.get("api/v1/platform-management/gigs/unaccepted", {
				params: {
					page,
				},
			});

			await Promise.all([res, sleep(500)]);

			const data: any = (await res).data;
			console.log(data);

			setUnacceptedGigs(data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getUnacceptedGigs(currPage);
	}, [currPage]);

	const acceptGig = async (gigId: number) => {
		try {
			await axiosPrivate.put(`api/v1/platform-management/accept-gig/${gigId}`);

			setUnacceptedGigs((prev) => {
				if (!prev) {
					return prev;
				}
				const gigs = prev.content.filter((gig) => gig.id !== gigId);
				return { ...prev, content: gigs };
			});

			toast.success("Gig Accepted Successfully");
		} catch (error) {
			console.error(error);
			if (isAxiosError(error)) {
				toast.error(error.response?.data.message);
			}
		}
	};
	return (
		<>
			<ManagementNavbar />
			<div className="medium-headings mb-4 mt-8 rounded-sm pb-4 pl-16 text-left text-green-500">
				Manage Unaccepted Gigs
			</div>
			<div className="grid auto-rows-min grid-cols-[5rem_1fr_10rem_10rem_16rem_repeat(3,auto)] gap-x-4 gap-y-1 pl-10 text-sm max-sm:grid-cols-[3rem_1fr_repeat(6,auto)]">
				<div className="col-span-full mb-1 grid grid-cols-subgrid border-b border-zinc-300 py-2 pr-2 text-center font-bold">
					<div></div>
					<div className="mr-auto">Gig</div>
					<div>Mentor</div>
					<div>Category</div>
					<div>Tags</div>
					<div className="px-4">Price</div>
					<div className="px-4">Created At</div>
					<div>
						<FaAngleDown className="invisible" />
					</div>
				</div>
				{unacceptedGigs ? (
					unacceptedGigs.content.length > 0 ? (
						<>
							{unacceptedGigs.content.map((gig) => (
								<div
									className={`col-span-full grid grid-cols-subgrid items-center rounded p-1 pr-2`}
									key={`manageGig-${gig.id}`}
								>
									<img
										src={coverImageUrl(gig.gigCoverImage)}
										alt=""
										className="aspect-[3/1] w-full rounded-sm object-cover"
									/>
									<Link to={`/gig/${gig.id}`} className="hover:underline">
										{gig.title}
									</Link>
									<Link to={`/profile/${gig.seller.id}`} className="w-[10rem] text-center hover:underline">
										{gig.seller.fullName}
									</Link>
									<div className="text-center">{gig.category}</div>
									<div className="flex flex-wrap items-center justify-center gap-y-1">
										{gig.tags.map((tag: any) => (
											<Tag key={tag.name} tag={tag.name} />
										))}
									</div>
									<div className="flex items-center text-center">
										<TbCurrencyTaka className="h-4 w-4" /> {gig.price}
									</div>
									<div className="text-center">{new Date(gig.createdAt).toLocaleDateString()}</div>
									<Dropdown
										head={<FaAngleDown />}
										rightAlign
										dropdownClassName="mt-2 min-w-20 rounded-md flex flex-col bg-light-bg text-center transition-all dark:bg-dark-bg"
									>
										<Link to={`/gig/${gig.id}`} className="block self-stretch bg-zinc-400 px-2 py-1 text-white">
											View
										</Link>
										<div
											onClick={() => acceptGig(gig.id)}
											className="cursor-pointer self-stretch bg-green-400 px-2 py-1 text-white transition-all duration-100"
										>
											Accept
										</div>
									</Dropdown>
								</div>
							))}
						</>
					) : (
						<div className="col-span-full my-2 inline-block w-fit self-stretch justify-self-center font-medium">
							No Unaccepted Gigs Pending
						</div>
					)
				) : (
					<div className="col-span-full aspect-video">
						<Loading />
					</div>
				)}
			</div>
			{unacceptedGigs && unacceptedGigs.totalPages > 1 && (
				<div className="col-span-full ml-10 mt-auto flex items-center gap-1 self-stretch rounded bg-light-secondary px-3 py-2 font-semibold dark:bg-dark-secondary">
					<FaAngleDoubleLeft
						className="hover-effect-no-shadow cursor-pointer"
						size={20}
						onClick={() => pageNav(unacceptedGigs.number > 0, 0)}
					/>
					<FaAngleLeft
						className="hover-effect-no-shadow mr-auto cursor-pointer"
						size={20}
						onClick={() => pageNav(unacceptedGigs.number > 0, unacceptedGigs.number - 1)}
					/>

					{pages.map((i) => (
						<p
							key={i}
							className={`hover-effect cursor-pointer select-none rounded px-2 py-0.5 text-sm ${i === unacceptedGigs.number ? "bg-green-400 text-white" : "bg-white text-black"}`}
							onClick={() => pageNav(i !== unacceptedGigs.number, i)}
						>
							{i + 1}
						</p>
					))}

					<FaAngleRight
						className="hover-effect-no-shadow ml-auto cursor-pointer"
						size={20}
						onClick={() => pageNav(!unacceptedGigs.last, unacceptedGigs.number + 1)}
					/>
					<FaAngleDoubleRight
						className="hover-effect-no-shadow cursor-pointer"
						size={20}
						onClick={() => pageNav(!unacceptedGigs.last, unacceptedGigs.totalPages - 1)}
					/>
				</div>
			)}
		</>
	);
};

export default UnacceptedGigs;
