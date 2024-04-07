import { PropsWithChildren, memo } from "react";


interface CardMessageComponentProps extends PropsWithChildren {
    title: string
    type: "info" | "success" | "alert",
    className?: string
}


function CardMessageComponent({title, type, className="", children}: CardMessageComponentProps) {
    let cardClassName = ["border"];

    if(type === "info") {
        cardClassName = cardClassName.concat([
            "border-sky-700",
            "bg-sky-600/20"
        ])
    } else if (type === "alert") {
        cardClassName = cardClassName.concat([
            "border-red-900",
            "bg-red-600/20",
            "text-red-200"
        ])
    } else if (type === "success") {
        cardClassName = cardClassName.concat([
            "border-green-800",
            "bg-green-500/20",
            "text-green-100"
        ])
    }
    return <div className={ cardClassName.join(" ") + " " + className }>
        <div className="p-2 border-b border-inherit">
            <h2 className="text-xl font-bold">{ title }</h2>
        </div>
        <div className="p-2">
            { children }
        </div>
    </div>
}

export default memo(CardMessageComponent)
