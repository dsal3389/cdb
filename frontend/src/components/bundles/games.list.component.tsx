import React, { useState } from "react";
import { useQuery } from "react-query"
import { GameInfo, Page } from "api/types"
import CardGameComponent from "components/card/card.game.component";
import LoaderComponent from "components/loader/loader.component";
import InputButtonComponent from "components/input/input.button.component";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

interface GamesListComponentProps {
    initPage?: number,
    queryKeys: unknown[],
    queryFunc: (page: number) => Promise<Page<GameInfo>>,
    onPageChange?: (page: number) => void
}

function GamesListComponent({ queryKeys, queryFunc, onPageChange, initPage=1 }: GamesListComponentProps) {
    const [page, setPage] = useState(initPage);
    const { data, isLoading } = useQuery(queryKeys.concat(page), () => queryFunc(page), {
        cacheTime: 5 * 60 * 1000
    });

    const changePageIndex = (index: number) => {
        return () => {
            setPage(index);
            
            if(onPageChange){
                onPageChange(index);
            }
        }
    }

    if(isLoading) {
        return <div className=' w-min m-auto flex-grow flex-shrink'>
            <LoaderComponent/>
        </div>
    }

    return <div className="space-y-2">
        {data!.count ? 
            <>
                {data!.results.map((game, i) => {
                    return <div key={ i }>
                        <CardGameComponent 
                            whitePlayer={game.white_player}
                            blackPlayer={game.black_player}
                            status={game.status}
                            playDate={game.play_date}
                            registerDate={game.register_date}
                            approved={game.approved}
                            type={game.type} />
                    </div>
                })}

                <div className='flex space-x-2'>
                    <InputButtonComponent 
                        className='flex justify-center bg-transparent' 
                        onClick={changePageIndex(data!.index-1)} 
                        disabled={!(data!.prev)}>
                        <GoChevronLeft/>
                    </InputButtonComponent>
                    <InputButtonComponent 
                        className='flex justify-center bg-transparent' 
                        onClick={changePageIndex(data!.index+1)} 
                        disabled={!(data!.next)}>
                        <GoChevronRight/>
                    </InputButtonComponent>
                </div>
            </>
        :
            <p>no games</p>
        }
    </div>
}

export default React.memo(GamesListComponent)
