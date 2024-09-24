import { coverImageUrl, userProfileImageUrl } from "@/utils/functions";
import { defaultProfileImage } from "@/utils/variables";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import { GrCurrency } from "react-icons/gr";
import { Link } from "react-router-dom";
import { GigCardData } from "../utils/types";
import Tag from "./Tag";

type GigCardProps = {
	gig: GigCardData;
	className?: string;
};

const GigCard = ({ gig, className = "" }: GigCardProps) => {
	return (
		<Link
			to={`/gig/${gig.id}`}
			className={`hover-effect grid cursor-pointer gap-1 rounded-sm bg-light-secondary shadow dark:bg-dark-secondary ${className}`}
			style={{
				gridTemplateColumns: "repeat(12, 1.5rem)",
				gridTemplateRows: "repeat(3, 1.5rem) auto auto 2rem",
			}}
		>
			<img
				src={coverImageUrl(gig.coverImage)}
				className="col-span-full row-[1/span_3] h-full w-full rounded-t-sm object-cover object-center"
				alt=""
			/>

			{!!gig.user && (
				<div className="col-[3/-1] row-[2/span_2] translate-y-1.5 self-end">
					<div className="small-headings w-fit rounded-sm bg-white px-1 py-0.5 text-xs dark:bg-dark-bg">
						{gig.user.firstName} {gig.user.lastName}
					</div>
				</div>
			)}

			<div
				className="small-headings -col-end-1 row-start-4 mt-0.5 items-center self-center truncate px-3 text-left"
				title={gig.title}
				style={{
					gridColumnStart: 1,
					paddingTop: !gig.user ? undefined : "0.2rem",
				}}
			>
				{gig.title}
			</div>

			<div
				className="-col-end-1 row-start-5 mr-2 mt-0.5 flex flex-nowrap items-center self-start overflow-x-auto overflow-y-hidden pl-3 scrollbar-none"
				style={{
					gridColumnStart: 1,
				}}
			>
				{gig.tags.map((tag) => (
					<Tag tag={tag} disabled key={`${gig.id}-tag-${tag}`} />
				))}
			</div>

			{!!gig.user && (
				<div
					className="col-[1/span_2] row-[2/span_2] translate-y-1.5 pl-3 pt-3"
					title={`${gig.user?.firstName} ${gig.user?.lastName}`}
				>
					<img
						src={userProfileImageUrl(gig.user?.id)}
						onError={({ currentTarget }) => {
							currentTarget.onerror = null;
							currentTarget.src = defaultProfileImage;
						}}
						style={{
							backgroundImage: `url(${defaultProfileImage})`,
						}}
						className="h-full w-full rounded-sm border-2 border-white bg-cover bg-center object-cover object-center shadow dark:border-black"
						alt={`${gig.user?.firstName} ${gig.user?.lastName}`}
					/>
				</div>
			)}

			<div className="col-span-6 mt-0.5 flex items-center gap-1 px-3 pb-1">
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

			<div className="col-span-6 mt-0.5 flex items-center justify-end gap-1 px-3 pb-1">
				<GrCurrency className="h-full w-fit py-0.5" />
				<div className="text-base font-semibold">{gig.price}Tk/Hr</div>
			</div>
		</Link>
	);
};

export default GigCard;
