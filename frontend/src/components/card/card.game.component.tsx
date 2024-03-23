import { GameStatus, GameType, ProfileBrief } from "api/types"
import { MouseEvent, MouseEventHandler, memo, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

interface CardGameComponentProps {
    whitePlayer: ProfileBrief,
    blackPlayer: ProfileBrief,
    status: GameStatus,
    registerDate: string,
    playDate: string,
    approved: boolean,
    type: GameType
}

function GamePlayerInfoComponent({ player }: {player: ProfileBrief}) {
    return <Link to={ `/profile/${player.id}` }>
        <div className="flex items-center flex-nowrap overflow-hidden">
            <img className="h-[32px] rounded-full border border-neutral-500" draggable="false" src={ process.env.REACT_APP_BACKEND_HOSTNAME + "/" + player.image } />
            <div className="ml-2 leading-none">
                <p>{ player.username }</p>
                <small>{ player.elo }</small>
            </div>    
        </div>
    </Link>    
}

function CardGameComponent({ blackPlayer, whitePlayer, status, playDate, registerDate, approved, type }: CardGameComponentProps) {
    const tooltipRef = useRef<HTMLDivElement>(null);
    let whiteSideClassName: string[] = ['flex', 'items-center', 'p-2', 'bg-neutral-300', 'text-neutral-800', 'justify-end'];
    let blackSideClassName: string[] = ['flex', 'items-center', 'p-2', 'bg-neutral-800', 'text-neutral-300'];
    let arrowClassName: string[] = ['w-0', 'h-0', 'border-t-[26px]', 'border-b-[26px]'];
    let cardclassName: string[] = ['h-[54px]', 'flex', 'border'];
    let imgPath;

    if(status === "white_win"){
        whiteSideClassName = whiteSideClassName.concat([
            'flex-1',
            'float-right'
        ]);
        arrowClassName = arrowClassName.concat([ // draw arrow pointing to the right
            'border-l-[20px]',
            'border-l-neutral-300',
            'border-t-neutral-800',
            'border-b-neutral-800',
        ]);
    } else if (status === "black_win") {
        blackSideClassName = blackSideClassName.concat([
            "flex-1"
        ]);
        arrowClassName = arrowClassName.concat([  // draw arrow pointing to the left
            'border-r-[20px]',
            'border-r-neutral-800',
            'border-t-neutral-300',
            'border-b-neutral-300',
        ]);
    } else {
        whiteSideClassName.push('flex-1');
        blackSideClassName.push('flex-1');
        arrowClassName = arrowClassName.concat([  // draw a slashing line
            'border-r-[15px]',
            'border-l-[15px]',
            'border-r-neutral-800',
            'border-l-neutral-300',
            'border-t-neutral-800',
            'border-b-neutral-300',
        ]);
    }

    if(approved) {
        cardclassName.push('border-neutral-700');
    } else {
        cardclassName.push('border-red-800')
    }

    if(type == "BULLET") {
        imgPath = process.env.PUBLIC_URL + "/bullet.png";
    } else if(type == "BLITZ") {
        imgPath = process.env.PUBLIC_URL + "/blitz.png";
    } else {
        imgPath = process.env.PUBLIC_URL + "/rapid.png";
    }

    const handleMouseMove = (event: MouseEvent) => {
        if(tooltipRef.current === null){
            return;
        }

        tooltipRef.current.style.display = "block";
        tooltipRef.current.style.left = event.pageX - (tooltipRef.current.offsetWidth / 2) + 'px';
        tooltipRef.current.style.top = event.pageY - tooltipRef.current.offsetHeight - 20 + 'px';
    }

    const handleMouseLeave = () => {
        if(tooltipRef.current === null){
            return;
        }
        tooltipRef.current.style.display = "none";
    }

    return <>
        <div 
            className={cardclassName.join(' ')} 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}>
            <div className={ whiteSideClassName.join(' ') }>
                <GamePlayerInfoComponent player={ whitePlayer } />
            </div>
            <div className={ arrowClassName.join(' ') }></div>
            <div className={ blackSideClassName.join(' ') + '' }>
                <GamePlayerInfoComponent player={ blackPlayer } />
            </div>
            <img 
                title={ type }
                draggable="false"
                className="border-l border-neutral-700 h-[24px] px-2 py-[15px] box-content justify-center self-center select-none" 
                src={ imgPath } />

            <div className="hidden absolute bg-neutral-900/90 border border-neutral-600 p-2 z-[1001] leading-tight text-sm rounded" ref={ tooltipRef }>
                <p>register date: {registerDate}</p>
                <p>play date: {playDate}</p>
                <p>type: {type}</p>
                <p>results: {status.replace('_', ' ')}</p>
                {!approved ? 
                    <div className="border-t border-red-500 mt-2">
                        <p className="font-bold text-red-200 text-center">waiting for approval</p>
                    </div>
                : null}
            </div>
        </div>
    </>    
}

export default memo(CardGameComponent);
