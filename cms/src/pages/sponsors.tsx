import { useMutation, useQuery } from "@apollo/client";
import { Button, Spinner, useDisclosure, useToast } from "@chakra-ui/react";
import { GetServerSideProps, GetStaticProps } from "next";
import Image from "next/image";
import React, { useState } from "react";
import { Operations } from "../graphql/operations";
import DeleteModal from "../components/DeleteModal";

interface SponsorsData {
  getSponsors: Sponsor[];
}

export interface Sponsor {
  name: string;
  url: string;
  imageUrl: string;
}

const Sponsors = () => {
  const toast = useToast();
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [deleteSponsor] = useMutation(Operations.Mutations.DeleteSponsor);
  const {
    data,
    refetch: refetchSponsors,
    loading,
  } = useQuery<SponsorsData>(Operations.Queries.GetSponsors);
  const [sponsorToDelete, setSponsorToDelete] = useState<Sponsor>({
    name: "",
    url: "",
    imageUrl: "",
  });

  const sponsorsData = data?.getSponsors;

  const handleDeleteSponsor = async (sponsor: Sponsor | undefined) => {
    onClose();
    await deleteSponsor({
      variables: {
        input: {
          sponsor: sponsor?.name,
        },
      },
    });
    await refetchSponsors();

    toast({
      title: "Success.",
      description: "Deleted.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const openDeleteModal = (sponsor: Sponsor) => {
    setSponsorToDelete(sponsor);
    onOpen();
  };
  if (loading) return <Spinner />;
  return (
    <div className="grid grid-cols-8 mt-10 space-y-4 px-6">
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        handleDeleteSponsor={handleDeleteSponsor}
        sponsor={sponsorToDelete}
      />
      {sponsorsData?.map((sponsor: Sponsor) => (
        <div
          key={sponsor.name}
          className=" flex flex-col justify-center items-center border-r-2 border-[#7b7b7b]"
        >
          <Image
            src={sponsor?.imageUrl}
            alt={sponsor?.name}
            width={100}
            height={100}
            className={"rounded-3xl"}
            onClick={() => setSponsorToDelete(sponsor)}
          />
          <h1 className="text-white text-xs font-semibold">{sponsor.name}</h1>
          <div className="flex item-center justify-center w-full">
            <Button colorScheme={"cyan"} className="mt-2 mx-2">
              Edit
            </Button>
            <Button
              colorScheme={"red"}
              className="mt-2 mx-2"
              onClick={() => openDeleteModal(sponsor)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sponsors;
