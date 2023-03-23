import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { capitalizeString } from "../utils/functions";

type Props = {};

const NavigationMenu = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    const path = router.pathname;
    const lastSegment = path.split("/").pop();
    setPage(capitalizeString(lastSegment as string) || "Home");
  }, [router.pathname]);

  const [page, setPage] = useState("");
  console.log(page);
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {page}
      </MenuButton>
      <MenuList>
        <MenuItem>
          <Link onClick={() => setPage("Home")} href={"/"} className="w-full">
            Home
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            onClick={() => setPage("Podcasts")}
            href={"/podcasts"}
            className="w-full"
          >
            Podcasts
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            onClick={() => setPage("Sponsors")}
            href={"/sponsors"}
            className="w-full"
          >
            Sponsors
          </Link>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default NavigationMenu;
