import { memo } from "react";
import { LuArrowUpFromDot, LuBadgeCheck, LuBadgeAlert } from "react-icons/lu";
import { UserBrief, GameType, GameStatus } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface GameCardAvatarProps {
  id: string,
  username: string,
  image: string,
  elo: number
}

interface GameCardProps {
  id: number,
  approved: boolean,
  time_control: string,
  white_player: UserBrief,
  black_player: UserBrief,
  status: GameStatus,
  register_date: string,
  play_date: string,
  type: GameType
}

function GameCardAvatar({ id, username, image, elo }: GameCardAvatarProps) {
  return (
    <div className="flex items-center">
      <Avatar>
        <AvatarImage src={`${import.meta.env.VITE_APP_BACKEND_HOSTNAME}/${image}`} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="ml-2 leading-[.9] text-sm">
        <p>{username}</p>
        <small className="italic">elo: {elo}</small>
      </div>
    </div>
  )
}

function GameCard({
  id,
  approved,
  time_control,
  white_player,
  black_player,
  status,
  register_date,
  play_date,
  type
}: GameCardProps) {
  let indicatorStyle = "";
  if (status == GameStatus.black_win) {
    indicatorStyle = "border-l-0 border-t-white border-b-white";
  } else if (status == GameStatus.white_win) {
    indicatorStyle = "border-r-0 border-l-white";
  } else {
    indicatorStyle = "border-l-white border-b-white";
  }

  return (
    <div className="flex border h-[62px] rounded-md overflow-hidden">
      <div className="w-2/4 p-2 bg-white text-black flex justify-center">
        <GameCardAvatar {...white_player} />
      </div>
      <div className={"w-0 h-0 border-black border-[30px]" + " " + indicatorStyle}></div>
      <div className="border-r w-2/4 p-2 bg-black text-white flex justify-center">
        <GameCardAvatar {...black_player} />
      </div>
      <div className="p-2">
        <Drawer>
          <DrawerTrigger>
            <Button variant="outline" size="icon" asChild>
              <div>
                <LuArrowUpFromDot />
              </div>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="">
              <div className="mx-auto px-4 w-full max-w-screen-md min-h-[40vh]">
                <DrawerHeader>
                  <DrawerTitle></DrawerTitle>
                  <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <div className="space-y-2">
                  {
                    approved ?
                      <div className="border rounded-md p-2 flex items-center">
                        <LuBadgeCheck size={24} />
                        <p className="pl-2">game is approved by both parties</p>
                      </div>
                      :
                      <div className="border border-red-600 rounded-md p-2 flex bg-red-600/20 items-center">
                        <LuBadgeAlert size={24} />
                        <p className="pl-2">game is not approved</p>
                      </div>
                  }
                  <div className="border rounded-md p-2">
                    <GameCardAvatar {...white_player} />
                  </div>
                  <div className="border rounded-md p-2">
                    <p>game registered at {register_date}</p>
                  </div>
                  <div className="border rounded-md p-2">
                    <p>game was played at {play_date}</p>
                  </div>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}

export default memo(GameCard);
