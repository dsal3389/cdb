import { useSearchParams } from 'react-router-dom';
import CardGameComponent from 'components/card/card.game.component';
import { ListGames } from 'api/game.http';
import { useQuery } from 'react-query';
import LoaderComponent from 'components/loader/loader.component';

export default function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data, isLoading } = useQuery(["games"], () => (
        ListGames({ index: searchParams.get("page") || 1, approved_only: true })
    ), { cacheTime: 5*300*1000 })
    console.log(data)
    return (
        <div className="max-w-[860px] m-auto mt-4 px-4">
            {!isLoading ?
                data!.results.map((gameInfo, i) => {
                    return <div className='my-2' key={ i }>
                        <CardGameComponent 
                            white_player={gameInfo.white_player} 
                            black_player={gameInfo.black_player} 
                            status={gameInfo.status}/>
                    </div>
                }) 
            :
                <div>
                    <LoaderComponent/>
                </div>
            }
        </div>
    )
}

