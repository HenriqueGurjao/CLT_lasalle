import { HtmlHTMLAttributes, ReactNode } from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { twMerge } from "tailwind-merge";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Ban,
  ChevronsUpDownIcon,
  Flag,
  Info,
  Pause,
  Play,
  X,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface SectorProps extends HtmlHTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  sector: "GK" | "DEF" | "MEI" | "ATA";
}

const Sector = ({ sector, children, ...rest }: SectorProps) => {
  return (
    <div
      {...rest}
      className={twMerge(
        " h-full flex items-center justify-center relative overflow-hidden",
        rest.className
      )}
    >
      <div className="absolute flex items-center justify-evenly w-full z-10">
        {children}
      </div>
      {sector == "GK" && (
        <>
          <div className="w-1/2 h-full flex justify-center items-end relative border-x-4 border-t-4 border-white">
            <div className="absolute top-8 w-1 h-1 bg-white rounded-full" />
            <div className="absolute h-2/4 border-x-4 border-t-4 w-2/4 border-white " />
          </div>
          <div className="absolute h-10 w-10 left-[-0.9rem] bottom-[-0.9rem] border-4 border-white  rounded-full  " />
          <div className="absolute h-10 w-10 right-[-0.9rem] bottom-[-0.9rem] border-4 border-white  rounded-full  " />
        </>
      )}
      {sector == "MEI" && (
        <>
          <div className="w-full h-full flex justify-center items-center relative">
            <div className="absolute  w-full h-1 bg-white rounded-full" />
            <div className="absolute size-20 sm:size-40 border-4  border-white rounded-full " />
            <div className="absolute size-1 border-4  border-white rounded-full " />
          </div>
        </>
      )}
    </div>
  );
};

const PositionPlayer = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full sm:h-16 sm:w-16 overflow-hidden"
          >
            <Avatar className="sm:h-16 sm:w-16">
              <AvatarImage
                src="https://github.com/MatheusSouSoa.png"
                alt="@MatheusSouSoa"
                className="w-full h-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Matheus - MEI - 10</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem className="cursor-pointer">
              Gol
              <DropdownMenuShortcut>
                <SportsSoccerIcon />{" "}
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Substituição
              <DropdownMenuShortcut>
                {" "}
                <ChevronsUpDownIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Advertência</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    Amarelo
                    <DropdownMenuShortcut>
                      <div className="bg-yellow-500 rounded-sm w-4 h-5" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Vermelho
                    <DropdownMenuShortcut>
                      <div className="bg-red-500 rounded-sm w-4 h-5" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="text-white select-none text-xs sm:text-md">
        Matheus - 10
      </div>
    </div>
  );
};

const ActionsContainer = () => {
  return (
    <div className="flex gap-3">
      <Card>
        <Button
          variant={"outline"}
          className="text-purple-700 hover:text-purple-600 border-purple-700 hover:border-purple-600"
        >
          <Play />
        </Button>
      </Card>
      <Card>
        <Button
          variant={"outline"}
          className="text-purple-700 hover:text-purple-600 border-purple-700 hover:border-purple-600"
        >
          <Pause />
        </Button>
      </Card>
      <Card>
        <Button
          variant={"outline"}
          className="text-purple-700 hover:text-purple-600 border-purple-700 hover:border-purple-600"
        >
          <Flag />
        </Button>
      </Card>
      <Card>
        <Button
          variant={"outline"}
          className="text-purple-700 hover:text-purple-600 border-purple-700 hover:border-purple-600"
        >
          <Info />
        </Button>
      </Card>
      <Card>
        <Button variant={"destructive"}>
          <Ban />
        </Button>
      </Card>
    </div>
  );
};

interface HeaderProps {
  timeA: string;
  timeB: string;
  tecnicoA: string;
  tecnicoB: string;
  formacaoA: string;
  formacaoB: string;
}

const Header = ({
  formacaoA,
  formacaoB,
  tecnicoA,
  tecnicoB,
  timeA,
  timeB,
}: HeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Tabs
        defaultValue={`${timeA}`}
        className="w-full flex items-center"
      >
        <TabsList className="grid w-[250px] lg:w-[400px] grid-cols-2 ">
          <TabsTrigger
            className="overflow-hidden flex justify-between"
            value={`${timeA}`}
          >
            <span className="overflow-hidden">{timeA}</span>
            <span className="">3</span>
          </TabsTrigger>
          <TabsTrigger
            className="overflow-hidden flex justify-between"
            value={`${timeB}`}
          >
            <span className="">0</span>
            <span className="overflow-hidden">{timeB}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex gap-4 whitespace-nowrap">
        1T 9:49&apos;
      </div>
    </div>
  );
};

export const Escalacao = {
  Actions: ActionsContainer,
  Header: Header,
  Sector: Sector,
  Player: PositionPlayer,
  SECTORS: ["ATA", "MEI", "DEF", "GK"] as const,
};
