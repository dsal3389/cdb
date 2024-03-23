import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { GoPencil } from "react-icons/go";
import { useAuth } from "api/auth.context";
import { getUserProfile } from "api/profile.http";
import LoaderComponent from "components/loader/loader.component";
import InputButtonIconComponent from "components/input/input.button.icons.component";

export default function Profile() {
    const { userId } = useParams();
    const { data, isLoading } = useQuery([userId], () => getUserProfile(userId!));
    const { user, isAuthenticated } = useAuth();

    console.log(userId)

    if(isLoading) {
        return <div>
            <LoaderComponent/>
        </div>
    }

    return <div className="min-h-screen max-w-2xl m-auto border-x border-neutral-700">
        <div className="relative border-b border-neutral-700 h-[128px] bg-neutral-800">
            { user?.id === userId ? 
                <InputButtonIconComponent className="m-2" icon={ <GoPencil/> } />
            : null}
            <img 
                draggable="false"
                className="h-[120px] absolute right-6 bottom-[-50px] border border-neutral-700 rounded-full"
                src={ process.env.REACT_APP_BACKEND_HOSTNAME + "/" + data!.image }/>
        </div>
        <div className="p-2 border-b border-neutral-700">
            <h2 className=" text-3xl font-bold">{ data!.username }</h2>
            <p>description</p>
        </div>
    </div>
}
