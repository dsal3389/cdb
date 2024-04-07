import { Link, useSearchParams } from 'react-router-dom';
import { ListGames } from 'api/game.http';
import CardComponent from 'components/card/card.component';
import InputButtonComponent from 'components/input/input.button.component';
import GamesListComponent from 'components/bundles/games.list.component';

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") || "1");

    const onPageChange = (index: number) => {
        setSearchParams({ page: index.toString() });
    } 

    return (
        <div className='flex flex-row flex-1 justify-center max-sm:flex-col-reverse'>
            <div className="flex-1 max-w-2xl px-2 border-r border-neutral-700 flex-grow flex-shrink py-2">
                <GamesListComponent
                    initPage={page!}
                    queryKeys={["games"]}
                    queryFunc={(i: number) =>  ListGames({ index: i })}
                    onPageChange={onPageChange}
                />
            </div>
            <div className='p-2 w-[260px] space-y-2 select-none leading-tight max-sm:w-full'>
                <CardComponent>
                    <Link to="/games/add">
                        <InputButtonComponent>
                            <p className='font-bold'>add game</p>
                        </InputButtonComponent>
                    </Link>    
                </CardComponent>
                <CardComponent className='bg-transparent'>
                    <div className='flex'>
                        <img draggable="false" className='h-[32px] self-center pr-2' src={ process.env.PUBLIC_URL + "/" + "bullet.png" } />
                        <h2 className='text-xl font-bold'>bullet</h2> 
                    </div>
                    <p>usually one minute per player, characterized by lightning-fast moves and intense time pressure.</p>
                </CardComponent>
                <CardComponent className='bg-transparent'>
                    <div className='flex'>
                        <img draggable="false" className='h-[32px] self-center pr-2' src={ process.env.PUBLIC_URL + "/" + "blitz.png" } />
                        <h2 className='text-xl font-bold'>blitz</h2> 
                    </div>
                    <p>games with limited time (usually 3 to 5 minutes), resulting in quick and intense gameplay.</p>
                </CardComponent>
                <CardComponent className='bg-transparent'>
                    <div className='flex'>
                        <img draggable="false" className='h-[32px] self-center pr-2' src={ process.env.PUBLIC_URL + "/" + "rapid.png" } />
                        <h2 className='text-xl font-bold'>rapid</h2> 
                    </div>
                    <p>often ranging from 10 to 30 minutes per player per game, allows for more thoughtful play</p>
                </CardComponent>
            </div>
        </div>
    )
}

