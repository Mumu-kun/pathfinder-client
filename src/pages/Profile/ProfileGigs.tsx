import Carousel from "@/components/Carousel";
import { NumberInputComponent, TextAreaInputComponent, TextInputComponent } from "@/components/FormComponents";
import GigCard from "@/components/GigCard";
import Loading from "@/components/Loading";
import { GigCardData } from "@/utils/types";
import { Field, Form, Formik } from "formik";
import { useState } from "react";
import { Modal } from "react-responsive-modal";

type ProfileGigsProps = {
	gigs: GigCardData[] | undefined;
	isOwnerProfile: boolean;
};

const ProfileGigs = ({ gigs, isOwnerProfile }: ProfileGigsProps) => {
	const [formOpen, setFormOpen] = useState(false);

	if (!gigs) {
		return <Loading />;
	}

	return (
		<div className="mt-8">
			{gigs.length > 0 && (
				<>
					<div className="mb-2 flex items-center text-xl font-semibold">Gigs from this Mentor</div>
					<Carousel>
						{gigs.map((value) => (
							<GigCard gig={value} key={`profileGig-${value.id}`} />
						))}
					</Carousel>
				</>
			)}
			{isOwnerProfile && (
				<>
					<button
						className="solid-btn"
						onClick={() => {
							setFormOpen(true);
						}}
					>
						Create a New Gig
					</button>
					<Modal
						open={formOpen}
						onClose={() => {
							setFormOpen(false);
						}}
						center
					>
						<GigCreateForm />
					</Modal>
				</>
			)}
		</div>
	);
};

export default ProfileGigs;

const GigCreateForm = () => {
	const initialValues: {
		title?: string;
		description?: string;
		price?: number;
		category?: string;
		tags?: string[];
	} = {};
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={async (values) => {
				console.log(values);
			}}
		>
			{({ isSubmitting }) => (
				<Form className="grid grid-cols-[max-content_auto] place-items-start gap-x-8 gap-y-4">
					<Field isGrid name="title" placeholder="Title" component={TextInputComponent} label="Title" />
					<Field
						isGrid
						name="description"
						placeholder="Description"
						component={TextAreaInputComponent}
						label="Description"
					/>
					<Field isGrid name="price" placeholder="Hourly Rate" component={NumberInputComponent} label="Hourly Rate" />
					<button type="submit" className="solid-btn col-span-full justify-self-center" disabled={isSubmitting}>
						Create Gig
					</button>
				</Form>
			)}
		</Formik>
	);
};
