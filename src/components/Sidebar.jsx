"use client"
import { Link, useLocation } from "react-router-dom"
import { Home, Package, Users, FileText, ShoppingCart, Wrench, Truck, Receipt, Menu, X, ChevronDown, Settings } from "lucide-react"
import { useState, useEffect, useRef } from "react"

const menuItems = [
  { path: "/", icon: Home, label: "Dashboard" },
  { 
    label: "Master", 
    icon: Settings, 
    hasDropdown: true,
    children: [
      { path: "/item-master", icon: Package, label: "Item Master" },
      { path: "/party-master", icon: Users, label: "Party Master" }
    ]
  },
  { path: "/purchase-indent", icon: FileText, label: "Purchase Indent" },
  { path: "/purchase-order", icon: ShoppingCart, label: "Purchase Order" },
  { path: "/job-work-order", icon: Wrench, label: "Job Work Order" },
  { path: "/material-receipt", icon: Truck, label: "Material Receipt" },
  { path: "/sales-invoice", icon: Receipt, label: "Sales Invoice" },
]

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const [openDropdown, setOpenDropdown] = useState(null)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
          <nav ref={dropdownRef} className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const isActive = item.path ? location.pathname === item.path : 
                (item.children && item.children.some(child => location.pathname === child.path))
              const isDropdownOpen = openDropdown === index

              if (item.hasDropdown) {
                return (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isDropdownOpen ? null : index)}
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
                      <ChevronDown className={`h-3 w-3 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-sidebar-border rounded-lg shadow-lg z-50">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon
                          const isChildActive = location.pathname === child.path
                          
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`
                                flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg
                                ${
                                  isChildActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                }
                              `}
                            >
                              <ChildIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                              {child.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

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
              {menuItems.map((item, index) => {
                const Icon = item.icon
                const isActive = item.path ? location.pathname === item.path : 
                  (item.children && item.children.some(child => location.pathname === child.path))
                const isDropdownOpen = openDropdown === index

                if (item.hasDropdown) {
                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => setOpenDropdown(isDropdownOpen ? null : index)}
                        className={`
                          w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                          ${
                            isActive
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isDropdownOpen && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children.map((child) => {
                            const ChildIcon = child.icon
                            const isChildActive = location.pathname === child.path
                            
                            return (
                              <Link
                                key={child.path}
                                to={child.path}
                                onClick={onClose}
                                className={`
                                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                                  ${
                                    isChildActive
                                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                  }
                                `}
                              >
                                <ChildIcon className="h-4 w-4 mr-3 flex-shrink-0" />
                                {child.label}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }

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
