import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

interface AppProps {
  userImage: string | null;
  userName: string | null;
}

export function UserDropdown({ userImage, userName }: AppProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-xl border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3 cursor-pointer">
          <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5" />

          <img
            src={
              userImage ??
              "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png"
            }
            alt="Alternate User"
            className="rounded-full h-8 w-8 hidden lg:block"
          />

          <h1 className="font-semibold">{userName ?? ""}</h1>
        </div>
      </DropdownMenuTrigger>

      {/* Drop down content */}
      <DropdownMenuContent align="start" className="w-[233px]">
        <DropdownMenuItem>
          <Link className="w-full" href="/p/create">
            Create Community
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="w-full" href="/p/binus/create">
            Create Post
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link className="w-full" href="/settings">
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem>
          <LogoutLink className="w-full">Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
