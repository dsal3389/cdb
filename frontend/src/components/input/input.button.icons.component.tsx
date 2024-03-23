import React from "react"

interface InputButtonIconComponentProps {
    icon: React.ReactNode
    className?: string
}

export default function InputButtonIconComponent({ icon, className="" }: InputButtonIconComponentProps) {
    return <button 
        className={"rounded-full p-2 border border-neutral-700 bg-neutral-900 " + className}>
        {icon}
    </button>
}
