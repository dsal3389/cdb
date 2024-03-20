import { PropsWithChildren } from "react";

interface CardComponentProps extends PropsWithChildren {
    className?: string
}

export default function CardComponent({ className="", children }: CardComponentProps) {
    return <div className={ "" + className }>
        { children }
    </div>
}
