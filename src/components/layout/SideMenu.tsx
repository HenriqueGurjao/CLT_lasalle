"use client";

import Link from "next/link";
import { useMenuItems } from "./useSideMenuItems";
import { ProfileField } from "./ProfileField";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CardDescription, CardTitle } from "../ui/card";
import { usePathname } from "next/navigation";

export const SideMenu = () => {
  const menuItems = useMenuItems();
  const path = usePathname();

  console.log(path);
  return (
    <>
      {path != "/" && (
        <aside className="hidden xl:block border-r w-[20%] h-full">
          <nav className=" mt-5 pr-2">
            <ul className="flex flex-col w-full">
              <li className="mb-2">
                <ProfileField.Container>
                  <Avatar>
                    <Link href={`/perfil/${"id"}`}>
                      <AvatarImage
                        src="https://github.com/MatheusSouSoa.png"
                        alt="@MatheusSouSoa"
                      />
                      <AvatarFallback>MT</AvatarFallback>
                    </Link>
                  </Avatar>
                  <div className="flex flex-col items-start pl-2 overflow-hidden">
                    <CardTitle className="text-md">
                      <Link
                        className="hover:underline"
                        href={"perfil"}
                      >
                        Matheus Soares
                      </Link>
                    </CardTitle>
                    <CardDescription>matheusg32@hotmail.com</CardDescription>
                  </div>
                </ProfileField.Container>
              </li>
              {menuItems.map((menuItem, index) => (
                <li key={index}>
                  <Link
                    className={`${
                      path.includes(menuItem.link)
                        ? "bg-purple-700 text-white hover:bg-purple-600 dark:hover:bg-purple-600"
                        : "hover:bg-zinc-200 "
                    } flex items-center cursor-pointer dark:hover:bg-slate-700 p-3 w-full gap-2 rounded-lg`}
                    href={menuItem.link}
                  >
                    <menuItem.icon /> {menuItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}
    </>
  );
};
