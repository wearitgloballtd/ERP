"use client"
import { Menu, Bell, User } from "lucide-react"

const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md hover:bg-muted">
          <Menu className="h-5 w-5 text-foreground" />
        </button>
        <h2 className="ml-4 lg:ml-0 text-lg font-heading font-semibold text-foreground">Receipt Management System</h2>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-md hover:bg-muted">
          <Bell className="h-5 w-5 text-foreground" />
        </button>
        <button className="p-2 rounded-md hover:bg-muted">
          <User className="h-5 w-5 text-foreground" />
        </button>
      </div>
    </header>
  )
}

export default Header
