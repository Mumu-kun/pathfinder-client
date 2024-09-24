import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Enrollment, Page } from "@/utils/types";
import { useEffect, useState } from "react";
import EnrollmentsList from "./EnrollmentsList";

type Props = {};

const Enrollments = ({}: Props) => {
	const { auth } = useAuth();
	const axios = useAxiosPrivate();
	const [enrollments, setEnrollments] = useState<Page<Enrollment> | undefined>();

	const getEnrollments = async (page: number = 0) => {
		try {
			const res = await axios.get(`/api/v1/enrollments/buyer/${auth?.userId}`, {
				params: {
					page,
				},
			});

			console.log(res.data);
			setEnrollments(res.data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		getEnrollments();
	}, []);

	return (
		<>
			<div className="medium-headings mb-4 mt-8 rounded-sm pb-4 pl-6 text-left text-green-500">My Enrollments</div>

			<EnrollmentsList enrollments={enrollments} getEnrollments={getEnrollments} />
		</>
	);
};

export default Enrollments;
