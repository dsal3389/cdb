import { useRef, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { lookupUsersProfileBrief } from "@/lib/api/profile";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProfileBrief } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AutoCompleteState {
  open: boolean,
  players: ProfileBrief[],
  selected: ProfileBrief | null,
  requestTimout: NodeJS.Timeout | null,
}

interface AutoCompletePlayerProps {
  onSelect?: (player: ProfileBrief) => void,
  color?: "white" | "black"
}

export default function AutoCompletePlayer({ onSelect, color = "black" }: AutoCompletePlayerProps) {
  const triggerBtnRef = useRef<HTMLButtonElement>(null);
  const [autocompleteState, setAutocompleteState] = useState<AutoCompleteState>({
    open: false,
    players: [],
    selected: null,
    requestTimout: null,
  })

  function setOpenState(state: boolean) {
    setAutocompleteState((prev) => {
      return { ...prev, open: state }
    })
  }

  async function onChangeSearchInput(text: string) {
    if (autocompleteState.requestTimout) {
      clearTimeout(autocompleteState.requestTimout);
    }

    setAutocompleteState((prev) => {
      return {
        ...prev,
        players: [],
        requestTimout: setTimeout(async () => {
          const results = await lookupUsersProfileBrief(text);
          setAutocompleteState((prev) => {
            return { ...prev, players: results.results, requestTimout: null };
          })
        }, 3000)
      };
    })
  }

  return (
    <Popover open={autocompleteState.open} onOpenChange={setOpenState}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="outline"
          className={cn(color === "white" ? "bg-white text-black" : "bg-black text-white", "w-full")}
          aria-expanded={autocompleteState.open}
          ref={triggerBtnRef}>
          {autocompleteState.selected ?
            <div className="flex p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={import.meta.env.VITE_APP_BACKEND_HOSTNAME + "/" + autocompleteState.selected.image} />
              </Avatar>
              <p className="ml-2 content-center">{autocompleteState.selected.username}</p>
            </div> : `select ${color} player`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" style={{ width: `${triggerBtnRef.current?.clientWidth || 200}px` }}>
        <Command>
          <CommandInput onValueChange={onChangeSearchInput} placeholder="start typing player name" />
          <CommandList>
            <CommandEmpty>
              {autocompleteState.requestTimout ?
                "loading..." : "no match"}
            </CommandEmpty>
            <CommandGroup>
              {autocompleteState.players.map((player) => (
                <CommandItem key={player.username} value={player.username} onSelect={() => {
                  setAutocompleteState((prev) => {
                    return {
                      ...prev,
                      open: false,
                      selected: player
                    }
                  });

                  if (onSelect) {
                    onSelect(player);
                  }
                }}>
                  <Avatar className="mr-2">
                    <AvatarImage className="h-8 rounded-full" src={import.meta.env.VITE_APP_BACKEND_HOSTNAME + "/" + player.image} />
                  </Avatar>
                  {player.username}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover >
  )
}

