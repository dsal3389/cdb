import { ButtonHTMLAttributes } from "react";

interface InputButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
}

export default function InputButtonComponent({ loading=false, className="",  children, ...props }: InputButtonComponentProps) {
    return <button 
        className={ "w-full bg-neutral-800 border border-neutral-700 p-2 cursor-pointer " + className } {...props}>
        { children }
    </button>
}
