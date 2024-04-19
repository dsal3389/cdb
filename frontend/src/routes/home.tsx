import { useAuth } from "api/auth.context";
import InputButtonComponent from "components/input/input.button.component";
import { Navigate } from "react-router-dom";

export default function Home() {
    const { isAuthenticated } = useAuth()

    if(isAuthenticated){
        return <Navigate to="/games"/>
    }

    return <div>
        <div className="relative w-full h-[350px] bg-neutral-300 text-neutral-800 overflow-hidden select-none">
            <img className="absolute h-[320px] right-1/4 -translate-x-2/4 opacity-35" draggable="false" src={ `${process.env.PUBLIC_URL}/kinght.png` }/>
            <div className="absolute w-[90%] top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 text-center overflow-hidden">
                <h2 className="text-5xl font-bold">chess database</h2>
                <p>Keep track of your chess games.</p>
                <div className="m-auto mt-12 max-w-[192px]">
                    <InputButtonComponent className=" w-[160px] bg-transparent" to="/games">
                        view game list
                    </InputButtonComponent>
                </div>    
            </div>
        </div>
        <div className="m-auto mt-4 px-2 max-w-2xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold">approval system</h2>
                <p>when adding a game, both players must approve the game</p>
            </div> 
        </div>
    </div>
}
