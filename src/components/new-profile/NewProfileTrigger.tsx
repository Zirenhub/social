"use client";

import { useEffect } from "react";
import { differenceInMinutes } from "date-fns";

import { useModal } from "@/context/ModalProvider";
import { GetProfileType } from "@/types/profile";
import NewProfileModal from "./NewProfileModal";

type Props = { profile: GetProfileType };

export default function NewProfileModalTrigger({ profile }: Props) {
  const { openModal } = useModal();

  useEffect(() => {
    const isUserNew = differenceInMinutes(new Date(), new Date(profile.createdAt)) <= 5;

    if (isUserNew) {
      openModal(<NewProfileModal profile={profile} />);
    }
  }, [profile, openModal]);

  return null;
}
