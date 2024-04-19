import { ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";

interface InputButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
    to?: string
}

export default function InputButtonComponent({ to, loading=false, className="",  children, ...props }: InputButtonComponentProps) {
    const btn = <button 
            className={ "w-full bg-neutral-800 border border-neutral-700 py-2 px-4 cursor-pointer disabled:bg-neutral-600/90 disabled:cursor-not-allowed disabled:text-black " + className } {...props}>
            { children }
        </button>

    if(to){
        return <Link to={to}>
            {btn}
        </Link>
    }
    return btn
}
