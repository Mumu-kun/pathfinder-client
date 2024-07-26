import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Gig, Review } from "../../utils/types";
import axios from "../../api/axios";
import Custom404 from "../UtilsPages/Custom404";
import { getRect } from "react-sticky-el/lib/helpers/rect";

const GigPage: React.FC = () => {
	const { id } = useParams();

	const [gig, setGig] = useState<Gig | null>(null);

	const getGig = async () => {
		try {
			const res = await axios.get(`/api/v1/public/gigs/${id}`);
			setGig(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	const [reviews, setReviews] = useState<Review[] | null>(null);
	const getGigReviews = async () => {
		try {
			const res = await axios.get(`/api/v1/public/gigs/${id}/reviews`);
			setReviews(res.data);
			console.log(res.data);
		} catch (err) {
			console.log(err);
		}
	};

	const getSimilarGigs = async () => {
		// TODO
	};

	useEffect(() => {
		getGig();
		getGigReviews();
	}, [id]);

	// TODO: handle loading.

	return (
		<div>
			{gig && (
				<div>
					<p>{gig?.title}</p>
					{reviews && (
						<div>
							<p className="mt-5">Reviews</p>
							{reviews.map((item) => (
								<div>
									<p>{item.title}</p>
									<p>{item.text}</p>
								</div>
							))}
						</div>
					)}
				</div>
			)}
			{!gig && <Custom404 message={"Gig khuje pacchi na bondhu."} />}
		</div>
	);
};

export default GigPage;
