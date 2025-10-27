"use client"
import { Link, useLocation } from "react-router-dom"
import { Home, Package, Users, FileText, ShoppingCart, Wrench, Truck, Receipt, Menu, X } from "lucide-react"

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

      {/* Top Navigation Bar */}
      <div className="w-full bg-sidebar border-b border-sidebar-border shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <h1 className="text-xl font-heading font-bold text-sidebar-foreground">ERP System</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={onClose} 
            className="lg:hidden p-2 rounded-md hover:bg-sidebar-accent"
          >
            {isOpen ? <X className="h-5 w-5 text-sidebar-foreground" /> : <Menu className="h-5 w-5 text-sidebar-foreground" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-sidebar-border bg-sidebar">
            <nav className="px-4 py-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                      ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </div>
    </>
  )
}

export default Sidebar
