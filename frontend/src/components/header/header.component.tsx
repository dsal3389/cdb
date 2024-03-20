import { PropsWithChildren } from "react";

interface HeaderComponentProps extends PropsWithChildren {
    className?: string
}

export default function HeaderComponent({ className = "" , children }: HeaderComponentProps) {
    return (
        <header className={ "p-4 border-b select-none " + className }>
            { children }
        </header>
    );
}
