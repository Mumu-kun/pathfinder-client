import React from "react";
import Modal from "react-responsive-modal";

type ZoomableImgProps = React.ImgHTMLAttributes<HTMLImageElement>;

const ZoomableImg = (props: ZoomableImgProps) => {
	const [zoomed, setZoomed] = React.useState(false);

	return (
		<>
			<img {...props} style={{ cursor: "zoom-in" }} onClick={() => setZoomed(true)} />
			<Modal
				open={zoomed}
				onClose={() => setZoomed(false)}
				closeIcon={<></>}
				center
				classNames={{
					modal: "!p-0 !max-w-[90vw] !max-h-[90vh] w-fit !m-0 !object-contain !bg-transparent",
				}}
			>
				<img {...props} className={`${props.className} !m-0 !max-h-[90vh] w-full !max-w-[90vw] !object-contain !p-0`} />
			</Modal>
		</>
	);
};

export default ZoomableImg;
