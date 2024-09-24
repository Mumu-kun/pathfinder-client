import axios from "@/api/axios";
import Carousel from "@/components/Carousel";
import GigCard from "@/components/GigCard";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { GigCardData } from "@/utils/types";
import { GIGS_BASE_URL, GIGS_BASE_URL_PRIVATE } from "@/utils/variables";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Props = {
	title: string;
	urlPath: string;
	showMorePath?: string;
	needAuth?: boolean;
};

const GigRecommendationsShowcase = ({ title, urlPath, showMorePath, needAuth = false }: Props) => {
	const { auth } = useAuth();
	const axiosPrivate = useAxiosPrivate();

	const [gigs, setGigs] = useState<GigCardData[] | undefined>();

	const getGigs = async () => {
		try {
			const res = await (auth
				? axiosPrivate.get(`${GIGS_BASE_URL_PRIVATE}/${urlPath}`)
				: axios.get(`${GIGS_BASE_URL}/${urlPath}`));

			const gigs: GigCardData[] = res.data.gigs;
			gigs.forEach((gig) => {
				window.localStorage.setItem(`gig-recommId-${gig.id}`, res.data.recommId);
			});

			setGigs(res.data.gigs);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		(!needAuth || !!auth) && getGigs();
	}, [urlPath]);

	if (!gigs || gigs.length === 0) {
		return null;
	}

	return (
		<div className="mb-8">
			<div className="flex justify-between">
				<div className="medium-headings text-left">{title}</div>
				{showMorePath && (
					<Link to={showMorePath} className="outline-btn mr-2 self-end text-xs">
						Show All
					</Link>
				)}
			</div>

			<Carousel>
				{gigs.map((value) => (
					<GigCard gig={value} key={`profileGig-${value.id}`} />
				))}
			</Carousel>
		</div>
	);
};

export default GigRecommendationsShowcase;
