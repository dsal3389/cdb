import { PropsWithChildren } from "react";

interface CardComponentProps extends PropsWithChildren {
    className?: string
}

export default function CardComponent({ className="", children }: CardComponentProps) {
    return <div className={ "border border-neutral-700 bg-neutral-800 p-2 w-full " + className }>
        { children }
    </div>
}
