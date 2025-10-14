import { Package, Users, FileText, ShoppingCart, Receipt } from "lucide-react"

const Dashboard = () => {
  const stats = [
    { title: "Total Items", value: "1,234", icon: Package, color: "text-primary" },
    { title: "Active Parties", value: "567", icon: Users, color: "text-secondary" },
    { title: "Pending Indents", value: "89", icon: FileText, color: "text-destructive" },
    { title: "Purchase Orders", value: "234", icon: ShoppingCart, color: "text-accent" },
  ]

  const recentActivities = [
    { action: "New Purchase Order", item: "PO-2024-001", time: "2 hours ago" },
    { action: "Material Receipt", item: "MR-2024-045", time: "4 hours ago" },
    { action: "Sales Invoice", item: "SI-2024-123", time: "6 hours ago" },
    { action: "Item Added", item: "Steel Rod 12mm", time: "1 day ago" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-card p-6 rounded-lg border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-heading font-bold text-card-foreground">{stat.value}</p>
                </div>
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
              >
                <div>
                  <p className="font-medium text-card-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.item}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Package className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Add Item</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">Add Party</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
              <FileText className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">New Indent</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors">
              <Receipt className="h-6 w-6 mb-2" />
              <span className="text-sm font-medium">New Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
