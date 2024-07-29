import { useQuery } from "react-query";
import { games } from "@/lib/api/games";
import GameCard from "@/components/ui/game-card";


export default function IndexRoute() {
  const { data, isLoading } = useQuery({
    queryKey: "games",
    queryFn: games
  })

  if (isLoading) {
    return <div>loading...</div>
  }

  return (
    <>
      <div className="h-[120px] border-b">

      </div>
      <div className="m-4">
        {data!.results.map((gameInfo, i) => (
          <div key={i}>
            <GameCard
              id={gameInfo.id}
              approved={gameInfo.approved}
              white_player={gameInfo.white_player}
              black_player={gameInfo.black_player}
              status={gameInfo.status}
              time_control={gameInfo.time_control}
              register_date={gameInfo.register_date}
              play_date={gameInfo.play_date}
              type={gameInfo.type}
            />
          </div>
        ))}
      </div>
    </>
  )
}

