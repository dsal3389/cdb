import { InputHTMLAttributes, LegacyRef, forwardRef } from "react"

interface InputTextComponentProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    description?: string
}

function InputTextComponent({ label, description, ...props }: InputTextComponentProps, ref: LegacyRef<HTMLInputElement>) {
    return <div className="relative border-neutral-700">
        { label ? 
            <div className="absolute top-[-10px] left-[8px] bg-neutral-800 border border-inherit px-1 text-sm select-none">
                <p>{ label }</p>
            </div>
        : null }
        <div className="p-2 bg-neutral-800 border border-inherit text-base">
            <input ref={ref} className="w-full bg-transparent outline-none placeholder:italic" {...props} />
        </div>
        { description ?
            <small className="text-xs italic select-none">
                {description}
            </small>
        : null }
    </div>
}

export default forwardRef(InputTextComponent)
