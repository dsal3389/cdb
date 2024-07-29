import { Link, Outlet } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth.provider";
import Header from "@/components/ui/header";


export default function RootLayout() {
  const { user } = useAuth();
  return (
    <>
      <Header position='sticky'>
        <h2 className='text-2xl font-bold'>chess database</h2>
        <div className='flex-1'></div>
        <div className="flex space-x-2">
          {user ?
            <>
              <Button variant="outline">
                <FiPlus className="mr-2 h-4 w-4" /> add game
              </Button>
              <Avatar>
                <AvatarImage src={import.meta.env.VITE_APP_BACKEND_HOSTNAME + "/" + user!.image} />
                <AvatarFallback>{user!.username.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </>
            :
            <Button variant="outline" className='font-bold'>
              <Link to="/auth">login</Link>
            </Button>
          }
        </div>
      </Header>
      <div>
        <Outlet />
      </div>
    </>
  )
}

