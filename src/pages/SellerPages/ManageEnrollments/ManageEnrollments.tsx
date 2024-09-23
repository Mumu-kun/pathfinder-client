import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { GigManage } from "@/utils/types";
import { useEffect, useState } from "react";
import GigEnrollmentsList from "./GigEnrollmentsList";

type Props = {};

const ManageEnrollments = ({}: Props) => {
	const axiosPrivate = useAxiosPrivate();

	const [gigs, setGigs] = useState<GigManage[] | undefined>();

	const getGigs = async () => {
		try {
			const res = await axiosPrivate.get(`api/v1/users/my/gigs/manage`);
			const data: any = res.data;

			setGigs(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getGigs();
	}, []);

	return (
		<>
			<div className="medium-headings mb-4 mt-8 rounded-sm pb-4 pl-6 text-left text-green-500">Manage Enrollments</div>

			{gigs && gigs.length > 0 ? (
				gigs.map((gig) => <GigEnrollmentsList key={gig.id} gig={gig} />)
			) : (
				<div className="flex h-52 flex-col items-center justify-center text-center">
					<h1 className="small-headings mb-2">No Enrollments Found</h1>
					<p>Create and publish a gig to get enrollments</p>
				</div>
			)}
		</>
	);
};

export default ManageEnrollments;
