import { GameStatus, ProfileBrief } from "api/types"

interface CardGameComponentProps {
    white_player: ProfileBrief,
    black_player: ProfileBrief,
    status: GameStatus
}

function GamePlayerInfoComponent({ player }: {player: ProfileBrief}) {
    return <div className="flex items-center">
        <img className="h-[32px] rounded-full border border-neutral-500" draggable="false" src={ process.env.REACT_APP_BACKEND_HOSTNAME + "/" + player.image } />
        <p className="ml-2">{ player.username }</p>
    </div>
}

export default function CardGameComponent({ black_player, white_player, status }: CardGameComponentProps) {
    let whiteSideClassName: string[] = ['flex', 'items-center', 'p-2', 'bg-neutral-300', 'text-neutral-800', 'justify-end'];
    let blackSideClassName: string[] = ['flex', 'items-center', 'p-2', 'bg-neutral-800', 'text-neutral-300'];
    let arrowClassName: string[] = ['w-0', 'h-0', 'border-t-[30px]', 'border-b-[30px]'];

    if(status == "white_win"){
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
    } else if (status == "black_win") {
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

    return <div className="h-[62px] flex border border-neutral-700">
        <div className={ whiteSideClassName.join(' ') }>
            <GamePlayerInfoComponent player={ white_player } />
        </div>
        <div className={ arrowClassName.join(' ') }></div>
        <div className={ blackSideClassName.join(' ') + '' }>
            <GamePlayerInfoComponent player={ black_player } />
        </div>
    </div>
}
