"use client"
import { Link, useLocation } from "react-router-dom"
import { Home, Package, Users, FileText, ShoppingCart, Wrench, Truck, Receipt, X } from "lucide-react"

const menuItems = [
  { path: "/", icon: Home, label: "Dashboard" },
  { path: "/item-master", icon: Package, label: "Item Master" },
  { path: "/party-master", icon: Users, label: "Party Master" },
  { path: "/purchase-indent", icon: FileText, label: "Purchase Indent" },
  { path: "/purchase-order", icon: ShoppingCart, label: "Purchase Order" },
  { path: "/job-work-order", icon: Wrench, label: "Job Work Order" },
  { path: "/material-receipt", icon: Truck, label: "Material Receipt" },
  { path: "/sales-invoice", icon: Receipt, label: "Sales Invoice" },
]

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
          <h1 className="text-xl font-heading font-bold text-sidebar-foreground">ERP System</h1>
          <button onClick={onClose} className="lg:hidden p-2 rounded-md hover:bg-sidebar-accent">
            <X className="h-5 w-5 text-sidebar-foreground" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center px-3 py-3 mb-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}

export default Sidebar
