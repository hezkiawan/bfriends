import Image from "next/image";
import Link from "next/link";
import redditMobile from "../../public/reddit-full.svg";
import RedditText from "../../public/logo-name.svg";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { UserDropdown } from "./UserDropdown";
import { getUserData } from "../lib/user";
import SearchCommunity from "./SearchCommunity";

export async function Navbar() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const userData = user ? await getUserData(user.id) : null;

  return (
    <nav className="h-[10vh] w-full flex items-center border-b px-5 lg:px-14 justify-between">
      <Link href="/" className="flex items-center gap-x-3">
        <Image
          src={redditMobile}
          alt="BFriends mobile icon"
          className="h-10 w-fit"
        />
        <Image
          src={RedditText}
          alt="Reddit Desktop"
          className="h-9 w-fit hidden lg:block"
        />
      </Link>

      <SearchCommunity />

      <div className="flex items-center gap-x-4">
        <ThemeToggle />
        {user ? (
          <UserDropdown
            userImage={user.picture}
            userName={userData?.userName ?? ""}
          />
        ) : (
          <div className="flex items-center gap-x-4">
            <Button variant={"secondary"} asChild>
              <RegisterLink>Sign up</RegisterLink>
            </Button>
            <Button asChild>
              <LoginLink>Log in</LoginLink>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
