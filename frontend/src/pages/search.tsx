import { useLazyQuery } from "@apollo/client";
import { Spinner } from "@chakra-ui/react";
import Fuse from "fuse.js";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { Operations } from "../graphql/operations";
import { convertToSlug, truncateString } from "../utils/functions";
import { useSetCurrentPage } from "../utils/hooks";
import { Category, PodcastData, SponsorData } from "../utils/types";

interface PodcastQuery {
  getPodcasts: PodcastData[];
}

interface SponsorQuery {
  getSponsors: SponsorData[];
}

interface PodcastSearchResults {
  title: string;
  imageUrl: string;
  publisher: string;
  category: [Category];
}

interface SponsorSearchResults {
  name: string;
  url: string;
  imageUrl: string;
}
const Search = () => {
  useSetCurrentPage({
    home: false,
    podcasts: false,
    search: true,
    offers: false,
  });
  const searchCategories = ["Podcasts", "Sponsors"];
  const [podcastFilter, setPodcastFilter] = useState(true);
  const [sponsorFilter, setSponsorFilter] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [display, setDisplay] = useState({ filter: false });
  const [podcastSearch, setPodcastSearch] = useState<PodcastSearchResults[]>([
    { imageUrl: "", title: "", publisher: "", category: [{ name: "" }] },
  ]);

  const [sponsorSearch, setSponsorSearch] = useState<SponsorSearchResults[]>([
    { imageUrl: "", name: "", url: "" },
  ]);

  const [getPodcasts] = useLazyQuery(Operations.Queries.GetPodcasts);
  const [getSponsors] = useLazyQuery(Operations.Queries.GetSponsors);

  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setDisplay((prev) => ({ ...prev, filter: true }));
    if (event.target.value === "") {
      setDisplay((prev) => ({ ...prev, filter: false }));
    }

    if (podcastFilter) {
      const { data: podcastsData }: { data: PodcastQuery } =
        await getPodcasts();

      const podcastList = podcastsData?.getPodcasts;
      const fuse = new Fuse(podcastList, {
        keys: ["title", "publisher"],
      });
      const podcastSearchResults = fuse
        .search(event.target.value)
        .map((data) => data.item)
        .slice(0, 4);

      setPodcastSearch(podcastSearchResults);
    }

    if (sponsorFilter) {
      const { data: sponsorsData }: { data: SponsorQuery } =
        await getSponsors();
      const sponsorList = sponsorsData?.getSponsors;
      const fuse = new Fuse(sponsorList, {
        keys: ["name"],
      });

      const sponsorSearchResults = fuse
        .search(event.target.value)
        .map((data) => data.item)
        .slice(0, 4);

      setSponsorSearch(sponsorSearchResults);
    }
  };

  const handleFilter = async (category: string) => {
    if (category === "Podcasts") {
      setPodcastFilter((prev) => !prev);
      setSponsorFilter(false);

      const { data: podcastsData }: { data: PodcastQuery } =
        await getPodcasts();
      const podcastList = podcastsData?.getPodcasts;
      const fuse = new Fuse(podcastList, {
        keys: ["title", "publisher"],
      });
      const podcastSearchResults = fuse
        .search(searchText)
        .map((data) => data.item)
        .slice(0, 4);

      setPodcastSearch(podcastSearchResults);
    }
    if (category === "Sponsors") {
      setSponsorFilter((prev) => !prev);
      setPodcastFilter(false);

      const { data: sponsorsData }: { data: SponsorQuery } =
        await getSponsors();
      const sponsorList = sponsorsData?.getSponsors;
      const fuse = new Fuse(sponsorList, {
        keys: ["name"],
      });

      const sponsorSearchResults = fuse
        .search(searchText)
        .map((data) => data.item)
        .slice(0, 4);

      setSponsorSearch(sponsorSearchResults);
    }
  };

  return (
    <div className="flex base:mb-[40px] xs:mb-[50px] lg:mb-0">
      <Sidebar />
      <div className="h-screen w-full bg-gradient-to-t from-[#151515] via-[#151515] to-[#282727]">
        <div className="w-full p-6 flex flex-col justify-center items-center ">
          <div className="flex items-center justify-center text-[#5b5a5a] w-full">
            <div className="bg-[#292929] h-10 rounded-l-md flex items-center justify-center p-2">
              <BiSearch size={20} />
            </div>

            <input
              className=" text-white outline-none focus:outline-none rounded-r-md w-10/12 sm:w-8/12 md:w-6/12 lg:w-4/12 p-2 bg-[#202020]"
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => handleSearch(e)}
            />
          </div>
          {display.filter && (
            <div className="flex items-center justify-center ">
              <div className="w-full p-6 text-xs xs:text-sm  flex gap-4 justify-evenly items-center ">
                {searchCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilter(category)}
                    className={`active:scale-95 rounded-full outline outline-[#5b5a5a] outline-1 px-8 py-1 items-center flex justify-center ${
                      podcastFilter &&
                      category === "Podcasts" &&
                      "bg-[#3f3f3f] "
                    } ${
                      sponsorFilter && category === "Sponsors" && "bg-[#3f3f3f]"
                    }`}
                  >
                    <p className=" font-medium">{category}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="">
            {podcastFilter &&
              searchText &&
              podcastSearch.map((podcast) => (
                <div
                  key={podcast.title}
                  className="p-2 flex items-center justify-center "
                >
                  {podcast.imageUrl ? (
                    <Link
                      href={`/podcasts/${
                        podcast.category[0].name
                      }/${convertToSlug(podcast.title)}`}
                      className="w-full"
                    >
                      <div className="flex items-center bg-[#222222] rounded-lg shadow-black hover:cursor-pointer hover:bg-[#3f3f3f] lg:min-w-[550px] min-w-[200px] xs:min-w-[300px] sm:min-w-[350px] md:min-w-[420px]">
                        <div className="p-4">
                          <Image
                            src={podcast.imageUrl}
                            width={100}
                            height={100}
                            alt={podcast.title}
                            className="shadow-black base:max-w-[70px] shadow-2xl xs:min-w-[90px] sm:min-w-[100px] rounded-lg"
                          />
                        </div>
                        <div className="flex flex-col p-4 ">
                          <h1 className="font-bold text-xs xs:font-extrabold xs:text-sm">
                            {truncateString(podcast.title, 30)}
                          </h1>
                          <p className="text-[#aaaaaa] text-xs lg:text-sm">
                            {truncateString(podcast.publisher, 35)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Spinner />
                  )}
                </div>
              ))}
            <div>
              {sponsorFilter &&
                searchText &&
                sponsorSearch.map((sponsor) => (
                  <div
                    key={sponsor?.name}
                    className="p-2 flex items-center justify-center w-full"
                  >
                    {sponsor.imageUrl ? (
                      <Link
                        href={`/${convertToSlug(sponsor.name)}`}
                        className="w-full"
                      >
                        <div className="flex items-center bg-[#222222] rounded-lg shadow-black hover:cursor-pointer hover:bg-[#3f3f3f] lg:min-w-[550px] min-w-[200px] xs:min-w-[300px] sm:min-w-[350px] md:min-w-[420px]">
                          <div className="p-4">
                            <Image
                              src={sponsor.imageUrl}
                              width={100}
                              height={100}
                              alt={sponsor.name}
                              className="shadow-black base:max-w-[70px]  shadow-2xl xs:min-w-[90px] sm:min-w-[100px] rounded-lg"
                            />
                          </div>
                          <div className="flex flex-col p-4 ">
                            <h1 className="font-bold text-xs xs:font-extrabold xs:text-sm">
                              {" "}
                              {truncateString(sponsor.name, 30)}
                            </h1>
                            <p className="text-[#aaaaaa] text-xs xs:text-sm">
                              {truncateString(sponsor.url, 35)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Spinner />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Search;
