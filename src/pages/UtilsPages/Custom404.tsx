import React from "react";

const Custom404: React.FC<{ message: string }> = ({ message }) => {
	return (
		<div>
			<p>OOPS. NOT FOUND.</p>
			<p>{message}</p>
		</div>
	);
};

export default Custom404;
