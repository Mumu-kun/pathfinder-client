import Carousel from "@/components/Carousel";
import GigCard from "@/components/GigCard";
import Loading from "@/components/Loading";
import { GigCardData } from "@/utils/types";

type ProfileGigsProps = {
	gigs: GigCardData[] | undefined;
	refreshGigs: () => void;
	isOwnerProfile: boolean;
};

const ProfileGigs = ({ gigs, refreshGigs, isOwnerProfile }: ProfileGigsProps) => {
	if (!gigs) {
		return <Loading />;
	}

	return (
		<div className="mt-8">
			{gigs.length > 0 && (
				<>
					<div className="medium-headings mb-2 text-left">Gigs from this Mentor</div>
					<Carousel>
						{gigs.map((value) => (
							<GigCard gig={value} key={`profileGig-${value.id}`} />
						))}
					</Carousel>
				</>
			)}
		</div>
	);
};

export default ProfileGigs;
