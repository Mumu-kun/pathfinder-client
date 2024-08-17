import axios from "@/api/axios";
import Carousel from "@/components/Carousel";
import { NumberInputComponent, TextAreaInputComponent, TextInputComponent } from "@/components/FormComponents";
import GigCard from "@/components/GigCard";
import Loading from "@/components/Loading";
import { GigCardData } from "@/utils/types";
import { ErrorMessage, Field, FieldArray, FieldProps, Form, Formik } from "formik";
import { SingleValue } from "node_modules/react-select/dist/declarations/src";
import { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Modal } from "react-responsive-modal";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { TbCurrencyTaka } from "react-icons/tb";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import * as Yup from "yup";

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
