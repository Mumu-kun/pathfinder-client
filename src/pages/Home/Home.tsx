import React from "react";
import { Link } from "react-router-dom";
import Categories from "./Categories";
import ChangeTheme from "../../components/ChangeTheme";
import { UnlimitLayoutWidth } from "@/components/wrappers/LimitLayoutWidth";
import Intro from "./Intro";
import GigRecommendationsShowcase from "../Profile/GigShowcase";

const Home: React.FC = () => {
	return (
		<>
			<UnlimitLayoutWidth>
				<Intro />
			</UnlimitLayoutWidth>
			<GigRecommendationsShowcase
				title="Recommended"
				urlPath={`recommendations`}
				showMorePath="/recommendations?title=Recommended"
			/>
			<GigRecommendationsShowcase
				title="Popular Gigs"
				urlPath={`recommendations/popular-gigs`}
				needAuth
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

			<ChangeTheme />
			<Link to="/profile" className="solid-btn">
				Profile
			</Link>
		</>
	);
};

export default Home;
