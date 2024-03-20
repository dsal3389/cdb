import { InputHTMLAttributes } from "react"

interface InputTextComponentProps extends InputHTMLAttributes<HTMLInputElement> {
}

export default function InputTextComponent({ ...props }: InputTextComponentProps) {
    return <div className="p-2 bg-neutral-800 border border-neutral-700">
        <input className="w-full bg-transparent outline-none placeholder:italic" {...props} />
    </div>
}
