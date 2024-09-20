type Props = {
	viewType: "buyer" | "seller";
};

const Enrollments = ({ viewType }: Props) => {
	return (
		<>
			<div className="medium-headings mt-8 rounded-sm pb-4 pl-6 text-left text-green-500">
				{viewType == "buyer" ? "My Enrollments" : "Manage Enrollments"}
			</div>
		</>
	);
};

export default Enrollments;
