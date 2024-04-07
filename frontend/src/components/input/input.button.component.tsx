import { ButtonHTMLAttributes } from "react";

interface InputButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
}

export default function InputButtonComponent({ loading=false, className="",  children, ...props }: InputButtonComponentProps) {
    return <button 
            className={ "w-full bg-neutral-800 border border-neutral-700 py-2 px-4 cursor-pointer disabled:bg-neutral-600/90 disabled:cursor-not-allowed disabled:text-black " + className } {...props}>
            { children }
        </button>
}
