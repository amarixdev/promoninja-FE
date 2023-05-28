import { useLazyQuery, useQuery } from "@apollo/client";
import {
  Button,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import EditSponsorModal from "../components/EditSponsorModal";
import { Operations } from "../graphql/operations";

export interface SponsorsData {
  getSponsors: Sponsor[];
}

export interface Sponsor {
  name: string;
  url: string;
  imageUrl: string;
}

interface GetSponsor {
  getSponsor: Sponsor;
}

const Sponsors = () => {
  const toast = useToast();
  const [searchText, setSearchText] = useState("");
  const [searchPreview, setSearchPreview] = useState<Sponsor[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor>({
    name: "",
    imageUrl: "",
    url: "",
  });
  const [currentCategory, setCurrentCategory] = useState("");
  const [displayPreview, setDisplayPreview] = useState(true);
  const {
    onOpen: onOpenEdit,
    isOpen: isOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const [getSponsor] = useLazyQuery<GetSponsor>(Operations.Queries.GetSponsor);
  const {
    data,
    refetch: refetchSponsors,
    loading,
  } = useQuery<SponsorsData>(Operations.Queries.GetSponsors, {
    variables: {
      input: {
        offerPage: false,
      },
    },
  });
  const sponsorsData = data?.getSponsors;
  const [
    getSponsorCategory,
    { data: sponsorCategoryData, refetch: refetchSponsorCategory },
  ] = useLazyQuery(Operations.Queries.GetSponsorCategory);

  const handleSearch = (event: any) => {
    setDisplayPreview(true);
    setSearchText(event.target.value);
    const result = sponsorsData?.filter((sponsor) =>
      sponsor.name.toLowerCase().includes(searchText.toLowerCase())
    );

    if (result) {
      setSearchPreview(result);
    }
  };

  const handleSelectSponsor = async (sponsor: Sponsor) => {
    setDisplayPreview(false);
    const { data } = await getSponsor({
      variables: {
        input: {
          name: sponsor.name,
        },
      },
    });

    await getSponsorCategory({
      variables: {
        input: {
          sponsor: sponsor.name,
        },
      },
    });
    setCurrentCategory(sponsorCategoryData?.getSponsorCategory?.name);

    const sponsorData = data?.getSponsor;
    if (sponsorData) {
      setSelectedSponsor(sponsorData);
    }
    onOpenEdit();
  };

  console.log(sponsorCategoryData);

  if (loading) return <Spinner />;

  return (
    <div className="w-full h-[80vh] flex-col flex justify-center items-center">
      <div className="w-3/12">
        <Input
          value={searchText}
          onChange={(e) => handleSearch(e)}
          className="text-white text-center"
          placeholder="Search Sponsors"
        />
      </div>
      <div className="flex absolute top-[450px] flex-col gap-1 justify-start items-center">
        {displayPreview &&
          searchPreview.map((preview) => (
            <div key={preview.name}>
              <Button onClick={() => handleSelectSponsor(preview)}>
                {preview.name}
              </Button>
            </div>
          ))}
      </div>
      <EditSponsorModal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        onOpen={onOpenEdit}
        sponsor={selectedSponsor}
        sponsorsData={sponsorsData}
        refetchSponsors={refetchSponsors}
        currentCategory={sponsorCategoryData?.getSponsorCategory?.name}
        setCurrentCategory={setCurrentCategory}
        refetchSponsorCategory={refetchSponsorCategory}
      />
    </div>
  );
};

export default Sponsors;
