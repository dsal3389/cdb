import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import LoaderComponent from 'components/loader/loader.component';
import CardGameComponent from 'components/card/card.game.component';
import InputTextComponent from 'components/input/input.text.component';
import { ListGames } from 'api/game.http';
import CardComponent from 'components/card/card.component';
import InputButtonComponent from 'components/input/input.button.component';

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isLoading } = useQuery(["games"], () => (
        ListGames({ index: searchParams.get("page") || 1, approved_only: false })
    ), { cacheTime: 5*300*1000 });
    return (
        <div className='flex flex-row flex-1 justify-center'>
            <div className="flex-1 max-w-2xl px-2 border-r border-neutral-700 flex-grow flex-shrink">
                <div className="py-4">
                    <h2 className='text-3xl font-bold mb-4'>search filters</h2>
                    <div className='flex space-x-2'>
                        <div className='flex-1'>
                            <InputTextComponent placeholder="white player" />
                        </div>    
                        <div className='flex-1'>
                            <InputTextComponent placeholder="black player" />
                        </div>
                    </div>    
                </div>
                {!isLoading ?
                    data!.results.map((gameInfo, i) => {
                        return <div className='my-2' key={ i }>
                            <CardGameComponent 
                                whitePlayer={gameInfo.white_player} 
                                blackPlayer={gameInfo.black_player} 
                                status={gameInfo.status}
                                playDate={gameInfo.play_date}
                                registerDate={gameInfo.register_date}
                                approved={gameInfo.approved}
                                type={gameInfo.type}/>
                        </div>
                    }) 
                :
                    <div className=' w-min m-auto flex-grow flex-shrink'>
                        <LoaderComponent/>
                    </div>
                }
            </div>
            <div className='p-2 w-[260px] space-y-2 select-none leading-tight'>
                <CardComponent>
                    <InputButtonComponent>
                        <p className='font-bold'>add game</p>
                    </InputButtonComponent>
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

