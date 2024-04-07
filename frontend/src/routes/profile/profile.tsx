import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { GoPencil } from "react-icons/go";
import { useAuth } from "api/auth.context";
import { getUserProfile, getUserProfileGames } from "api/profile.http";
import LoaderComponent from "components/loader/loader.component";
import InputButtonIconComponent from "components/input/input.button.icons.component";
import GamesListComponent from "components/bundles/games.list.component";


interface ProfileUserGamesProps {
    userId: string
}


function ProfileUserGames({ userId }: ProfileUserGamesProps) {
    const fetchUserGames = (p: number) => getUserProfileGames(userId!, p)
    return <div className="m-2">
        <GamesListComponent
            queryKeys={["games", userId!]} 
            queryFunc={fetchUserGames}
        />
    </div>
}

export default function Profile() {
    const { userId } = useParams();
    const { data, isLoading } = useQuery(["profile", userId], () => getUserProfile(userId!));
    const { user } = useAuth();

    if(isLoading) {
        return <div>
            <LoaderComponent/>
        </div>
    }

    const { profile, games_status } = data!;

    return <div className="min-h-screen max-w-2xl m-auto border-x border-neutral-700">
        <div className="sticky top-[64px] border-b border-inherit z-[100] bg-neutral-950/60 p-4 flex">
            <h2 className=" text-xl font-bold flex-1 items-center select-none">
                { data!.profile.username }
            </h2>
            <div className="border border-inherit rounded-full px-4 bg-neutral-800 select-none">
                <p className="italic">ELO: { data!.profile.elo }</p>
            </div>    
        </div>
        <div className="relative border-b border-inherit h-[128px] bg-neutral-800">
            { user?.id === userId! ? 
                <InputButtonIconComponent className="m-2" icon={ <GoPencil/> } />
            : null}
            <img 
                draggable="false"
                className="h-[120px] absolute right-6 bottom-[-50px] border border-inherit rounded-full"
                src={ process.env.REACT_APP_BACKEND_HOSTNAME + "/" + profile.image }/>
        </div>
        <div className="p-2 pb-6 border-inherit">
            <p>description</p>
        </div>
        <div>
            <div className="sticky top-[64px] bg-neutral-900 border-b border-inherit p-2">
                <h2 className="text-xl font-bold">Games information</h2>
            </div>
            <div className="p-2 font-bold border-inherit">
                <table className="w-full text-center">
                    <tr>
                        <th>wins as white</th>
                        <th>draw</th>
                        <th>wins as black</th>
                    </tr>
                    <tr>
                        <td>{games_status.white_win }</td>
                        <td>{games_status.draw }</td>
                        <td>{games_status.black_win }</td>
                    </tr>
                </table>
            </div>
            <ProfileUserGames userId={ userId! } />
        </div>
    </div>
}
