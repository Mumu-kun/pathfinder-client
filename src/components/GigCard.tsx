import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import { GrCurrency } from "react-icons/gr";
import { GigCardData } from "../utils/types";
import Tag from "./Tag";
import { Link } from "react-router-dom";

type GigCardProps = {
	gig: GigCardData;
};

const GigCard = ({ gig }: GigCardProps) => {
	return (
		<div className="grid grid-cols-[repeat(12,2rem)] grid-rows-[repeat(6,2rem)] gap-1 rounded-sm bg-light-secondary shadow dark:bg-dark-secondary">
			<img
				src={gig.coverImage}
				className="col-span-full row-[1/span_3] h-full w-full rounded-t-sm object-cover object-center"
				alt=""
			/>

			{!!gig.user && (
				<div className="col-[4/-1] row-start-3 self-end">
					<div className="w-fit translate-y-1.5 rounded-sm bg-white px-1 py-0.5 text-xs dark:bg-dark-bg">
						From{" "}
						<Link to={`/profile/${gig.user.id}`} className="font-medium hover:underline">
							{gig.user.firstName} {gig.user.lastName}
						</Link>
					</div>
				</div>
			)}

			<div className="col-[4/-1] row-start-4 items-center self-center text-lg font-bold" title={gig.title}>
				{gig.title}
			</div>

			<div className="col-[4/-1] row-start-5 mr-2 flex flex-nowrap items-center self-start overflow-x-auto overflow-y-hidden scrollbar-none">
				{gig.tags.map((tag) => (
					<Tag tag={tag} disabled key={`${gig.id}-tag-${tag}`} />
				))}
			</div>

			<div className="col-[1/span_3] row-[3/span_3] p-2" title={`${gig.user?.firstName} ${gig.user?.lastName}`}>
				<img
					src={gig.user?.profileImage}
					className="h-full w-full rounded-sm border-4 border-white object-cover object-center shadow dark:border-black"
					alt={`${gig.user?.firstName} ${gig.user?.lastName}`}
				/>
			</div>
			<div className="col-span-6 flex items-center gap-1 px-4 pb-2">
				<Rating
					value={gig.rating}
					className="max-w-28"
					readOnly
					itemStyles={{
						itemShapes: ThinRoundedStar,
						activeFillColor: "#4ade80",
						inactiveFillColor: "white",
						activeStrokeColor: "#157010",
						itemStrokeWidth: 2,
					}}
				/>
				<div className="font-bold">{gig.rating}</div>
				<div className="text-xs font-medium">({gig.ratedByCount})</div>
			</div>

			<div className="col-span-6 flex items-center justify-end gap-1 px-4 pb-2">
				<GrCurrency className="h-full w-fit" />
				<div className="text-base font-semibold">{gig.price}Tk/Hr</div>
			</div>
		</div>
	);
};

export default GigCard;