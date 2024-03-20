import { useAuth } from "api/auth.context";
import HeaderComponent from "components/header/header.component";
import { Link, Outlet } from "react-router-dom";

export default function Root() {
    const { user, isAuthenticated } = useAuth();
    return (<>
        <HeaderComponent className="top-0 h-[64px] z-[1000] border-b-1 border-neutral-700 bg-neutral-900 overflow-hidden sticky flex backdrop-blur-md">
            <img 
                className="h-[220px] absolute right-[170px] top-[-30px] rotate-[-30deg] z-[999] invert opacity-40 hover:opacity-75 duration-200" 
                src={ `${process.env.PUBLIC_URL}/kinght.png` } alt="kinght chess" draggable={ false } />
            <div>
                <Link style={{"textDecoration": "unset"}} to="/">
                    <h2 className="text-2xl font-bold text-stone-200">cdb</h2>
                </Link>    
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center">
                { isAuthenticated ? 
                    <>
                        <div className="mr-4 font-bold bg-neutral-800 px-2 py-1 rounded-full border border-neutral-700">
                            <p>ELO: { user!.elo }</p>
                        </div>    
                        <div className="h-9 rounded-full overflow-hidden border-2 border-neutral-700">
                            <img className="h-full" src={ process.env.REACT_APP_BACKEND_HOSTNAME + '/' + user!.image } draggable={ false } />
                        </div>
                    </>    
                : 
                    <h2>hello</h2>
                }
            </div>
        </HeaderComponent>
        <main>
            <Outlet/>
        </main>
    </>);
}
