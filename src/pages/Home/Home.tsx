import { UnlimitLayoutWidth } from "@/components/wrappers/LimitLayoutWidth";
import React from "react";
import GigRecommendationsShowcase from "../Profile/GigShowcase";
import Categories from "./Categories";
import Intro from "./Intro";

const Home: React.FC = () => {
	return (
		<>
			<UnlimitLayoutWidth>
				<Intro />
			</UnlimitLayoutWidth>
			<GigRecommendationsShowcase
				title="Featured"
				urlPath={`recommendations/homepage`}
				needAuth
				showMorePath="/recommendations?title=Featured"
			/>
			<GigRecommendationsShowcase
				title="Recommended for You"
				urlPath={`recommendations/user`}
				needAuth
				showMorePath="/recommendations?title=Recommended+For+You"
			/>
			<GigRecommendationsShowcase
				title="Popular Gigs"
				urlPath={`recommendations/popular-gigs`}
				showMorePath="/recommendations?title=Popular+Gigs"
			/>
			<Categories />
			<GigRecommendationsShowcase
				title="Top Picks"
				urlPath={`recommendations/top-picks`}
				needAuth
				showMorePath="/recommendation?title=Top+Picks"
			/>
			<GigRecommendationsShowcase
				title="Recently Viewed"
				urlPath={`recommendations/recently-viewed`}
				needAuth
				showMorePath="/recommendation?title=Recently+Viewed"
			/>
		</>
	);
};

export default Home;
