import { PropsWithChildren } from "react"

interface HeaderProps extends PropsWithChildren {
  position?: "static" | "sticky" | "fixed",
  top?: number
}

export default function Header({ position = "static", top = 0, children }: HeaderProps) {
  return (
    <div className="flex border-b p-4 backdrop-blur-md bg-black/30" style={{ position, top }}>
      {children}
    </div>
  )
}
