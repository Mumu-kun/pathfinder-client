import GigCard from "@/components/GigCard";
import Loading from "@/components/Loading";
import { UnlimitLayoutWidth } from "@/components/wrappers/LimitLayoutWidth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { GigCardData } from "@/utils/types";
import { GIGS_BASE_URL_PRIVATE } from "@/utils/variables";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Recommendations = () => {
	const { pathname, search } = useLocation();
	const [queryParams, setQueryParams] = useState<URLSearchParams>(() => new URLSearchParams(search));

	const [gigs, setGigs] = useState<GigCardData[] | undefined>();
	const [recommId, setRecommId] = useState<string | undefined>();

	const axiosPrivate = useAxiosPrivate();

	const fetchGigs = async () => {
		try {
			const res = await axiosPrivate.get(`${GIGS_BASE_URL_PRIVATE}${pathname}`);

			setGigs(res.data.gigs);
			setRecommId(res.data.recommId);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchNextGigs = async () => {
		try {
			const res = await axiosPrivate.get(`${GIGS_BASE_URL_PRIVATE}/next-recommendations/${recommId}`);

			setGigs(res.data.gigs);
			setRecommId(res.data.recommId);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (search === queryParams.toString()) {
			return;
		}
		setQueryParams(new URLSearchParams(search));
		fetchGigs();
	}, [search]);

	if (!gigs) {
		return <Loading />;
	}

	return (
		<UnlimitLayoutWidth>
			<div className="mx-auto flex w-full flex-1 flex-col items-center pt-4">
				<div className="medium-headings mb-4 w-full max-w-[1200px] px-6 text-left">{queryParams.get("title")}</div>
				<div className="mx-auto my-4 grid w-full grid-cols-3 items-start gap-4 max-[1100px]:grid-cols-2 max-[730px]:grid-cols-1">
					{gigs.length > 0 ? (
						gigs.map((gig) => <GigCard gig={gig} key={gig.id} />)
					) : (
						<div className="col-span-full text-center">No gigs found</div>
					)}
				</div>
				<button onClick={fetchNextGigs} className="solid-btn self-center">
					Show More
				</button>
			</div>
		</UnlimitLayoutWidth>
	);
};

export default Recommendations;
