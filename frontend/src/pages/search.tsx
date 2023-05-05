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
import { useSetCurrentPage } from "../utils/hooks";
import { PodcastData, SponsorData } from "../utils/types";

interface PodcastQuery {
  getPodcasts: PodcastData[];
}

interface SponsorQuery {
  getSponsors: SponsorData[];
}

interface CategoryData {
  name: string;
}

interface PodcastSearchResults {
  title: string;
  imageUrl: string;
  publisher: string;
}

interface SponsorSearchResults {
  name: string;
  url: string;
  imageUrl: string;
}
const Search = () => {
  useSetCurrentPage({ home: false, podcasts: false, search: true });
  const searchCategories = ["Podcasts", "Sponsors"];
  const [podcastFilter, setPodcastFilter] = useState(true);
  const [sponsorFilter, setSponsorFilter] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [display, setDisplay] = useState({ filter: false });
  const [podcastSearch, setPodcastSearch] = useState<PodcastSearchResults[]>([
    { imageUrl: "", title: "", publisher: "" },
  ]);

  const [sponsorSearch, setSponsorSearch] = useState<SponsorSearchResults[]>([
    { imageUrl: "", name: "", url: "" },
  ]);

  const [getPodcasts] = useLazyQuery(Operations.Queries.GetPodcasts);
  const [getSponsors] = useLazyQuery(Operations.Queries.GetSponsors);
  const [getPodcastCategory, { data: categoryData }] = useLazyQuery(
    Operations.Queries.GetPodcastCategory
  );

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

  const handleSelect = async (podcast: string) => {
    await getPodcastCategory({
      variables: {
        input: {
          podcast,
        },
      },
    });
  };

  const category = categoryData?.getPodcastCategory.name;
  console.log(category);

  return (
    <div className="flex">
      <Sidebar />
      <div className="h-screen w-full bg-gradient-to-t from-[#151515] via-[#151515] to-[#282727]">
        <div className="w-full p-6">
          <div className="flex items-center justify-center text-[#5b5a5a]">
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
            <div className="flex items-center justify-center">
              <div className="w-full p-6 flex gap-4 justify-evenly items-center sm:w-10/12 md:w-8/12 lg:w-6/12">
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
          <div>
            {podcastFilter &&
              searchText &&
              podcastSearch.map((podcast) => (
                <div
                  key={podcast.title}
                  className="p-2 flex items-center justify-center"
                >
                  {podcast.imageUrl ? (
                    <Link
                      href={`/podcasts/${category}/${podcast.title}`}
                      className="w-full"
                    >
                      <div
                        onClick={() => handleSelect(podcast.title)}
                        className="sm:w-10/12 md:w-8/12 lg:w-6/12 flex items-center bg-[#222222] rounded-lg shadow-black hover:cursor-pointer hover:bg-[#3f3f3f]"
                      >
                        <div className="p-4">
                          <Image
                            src={podcast.imageUrl}
                            width={100}
                            height={100}
                            alt={podcast.title}
                            className=" shadow-black shadow-2xl min-w-[100px] rounded-lg"
                          />
                        </div>
                        <div className="flex flex-col p-4 ">
                          <h1 className="font-extrabold">{podcast.title}</h1>
                          <p className="text-[#aaaaaa] base:text-xs xs:text-sm">
                            {podcast.publisher}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Spinner />
                  )}
                </div>
              ))}
            {sponsorFilter &&
              searchText &&
              sponsorSearch.map((sponsor) => (
                <div
                  key={sponsor?.name}
                  className="p-2 flex items-center justify-center"
                >
                  {sponsor.imageUrl ? (
                    <Link href={`/${sponsor.name}`} className="w-full">
                      <div className="sm:w-10/12 md:w-8/12 lg:w-6/12 flex items-center bg-[#222222] rounded-lg shadow-black hover:cursor-pointer hover:bg-[#3f3f3f]">
                        <div className="p-4">
                          <Image
                            src={sponsor.imageUrl}
                            width={100}
                            height={100}
                            alt={sponsor.name}
                            className=" shadow-black shadow-2xl min-w-[100px] rounded-lg"
                          />
                        </div>
                        <div className="flex flex-col p-4 ">
                          <h1 className="font-extrabold">{sponsor.name}</h1>
                          <p className="text-[#aaaaaa] text-xs">
                            {sponsor.url}
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
        <Footer />
      </div>
    </div>
  );
};

export default Search;
