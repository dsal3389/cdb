import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { Link, Outlet } from "react-router-dom";


export default function RootLayout() {
  return (
    <>
      <Header position='sticky'>
        <h2 className='text-2xl font-bold'>chess database</h2>
        <div className='flex-1'></div>
        <div>
          <Button variant="outline" className='font-bold'>
            <Link to="/auth">login</Link>
          </Button>
        </div>
      </Header>
      <div>
        <Outlet />
      </div>
    </>
  )
}

