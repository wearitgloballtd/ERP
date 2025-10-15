"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, FileText, Calendar, User, Package, Eye } from "lucide-react"

const PurchaseIndent = () => {
  const [indents, setIndents] = useState([
    {
      id: 1,
      indentNo: "PI001",
      indentDate: "2024-01-15",
      requestedBy: "John Doe",
      department: "Production",
      priority: "High",
      status: "Pending",
      items: [
        { itemCode: "ITM001", itemName: "Steel Rod 12mm", quantity: 100, unit: "KG", requiredDate: "2024-01-20" },
        { itemCode: "ITM002", itemName: "Cement Portland", quantity: 50, unit: "BAG", requiredDate: "2024-01-20" },
      ],
      totalItems: 2,
      remarks: "Urgent requirement for Project A",
    },
    {
      id: 2,
      indentNo: "PI002",
      indentDate: "2024-01-16",
      requestedBy: "Sarah Wilson",
      department: "Maintenance",
      priority: "Medium",
      status: "Approved",
      items: [{ itemCode: "ITM003", itemName: "Paint White", quantity: 25, unit: "LTR", requiredDate: "2024-01-25" }],
      totalItems: 1,
      remarks: "For building maintenance work",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [selectedIndent, setSelectedIndent] = useState(null)
  const [editingIndent, setEditingIndent] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    indentNo: "",
    indentDate: new Date().toISOString().split("T")[0],
    requestedBy: "",
    department: "",
    priority: "Medium",
    status: "Pending",
    remarks: "",
    items: [],
  })

  const [itemForm, setItemForm] = useState({
    itemCode: "",
    itemName: "",
    quantity: "",
    unit: "",
    requiredDate: "",
  })

  const departments = ["Production", "Maintenance", "Quality", "Administration", "Sales"]
  const priorities = ["Low", "Medium", "High", "Urgent"]
  const statuses = ["Pending", "Approved", "Rejected", "Partially Approved"]
  const units = ["KG", "LTR", "PCS", "BAG", "MTR", "SQM"]

  // Sample items for selection
  const availableItems = [
    { code: "ITM001", name: "Steel Rod 12mm", unit: "KG" },
    { code: "ITM002", name: "Cement Portland", unit: "BAG" },
    { code: "ITM003", name: "Paint White", unit: "LTR" },
    { code: "ITM004", name: "Brick Red", unit: "PCS" },
    { code: "ITM005", name: "Wire Copper", unit: "MTR" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.items.length === 0) {
      alert("Please add at least one item to the indent")
      return
    }

    if (editingIndent) {
      setIndents(
        indents.map((indent) =>
          indent.id === editingIndent.id
            ? { ...formData, id: editingIndent.id, totalItems: formData.items.length }
            : indent,
        ),
      )
    } else {
      const newIndent = {
        ...formData,
        id: Date.now(),
        totalItems: formData.items.length,
      }
      setIndents([...indents, newIndent])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      indentNo: "",
      indentDate: new Date().toISOString().split("T")[0],
      requestedBy: "",
      department: "",
      priority: "Medium",
      status: "Pending",
      remarks: "",
      items: [],
    })
    setShowForm(false)
    setEditingIndent(null)
  }

  const handleEdit = (indent) => {
    setFormData({
      indentNo: indent.indentNo,
      indentDate: indent.indentDate,
      requestedBy: indent.requestedBy,
      department: indent.department,
      priority: indent.priority,
      status: indent.status,
      remarks: indent.remarks,
      items: [...indent.items],
    })
    setEditingIndent(indent)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this indent?")) {
      setIndents(indents.filter((indent) => indent.id !== id))
    }
  }

  const addItemToIndent = () => {
    if (!itemForm.itemCode || !itemForm.quantity || !itemForm.requiredDate) {
      alert("Please fill all item details")
      return
    }

    const selectedItem = availableItems.find((item) => item.code === itemForm.itemCode)
    const newItem = {
      itemCode: itemForm.itemCode,
      itemName: selectedItem.name,
      quantity: Number.parseInt(itemForm.quantity),
      unit: selectedItem.unit,
      requiredDate: itemForm.requiredDate,
    }

    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    })

    setItemForm({
      itemCode: "",
      itemName: "",
      quantity: "",
      unit: "",
      requiredDate: "",
    })
  }

  const removeItemFromIndent = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const viewItems = (indent) => {
    setSelectedIndent(indent)
    setShowItemsModal(true)
  }

  const filteredIndents = indents.filter(
    (indent) =>
      indent.indentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      indent.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-destructive text-destructive-foreground"
      case "Approved":
        return "bg-secondary text-secondary-foreground"
      case "Rejected":
        return "bg-muted text-muted-foreground"
      case "Partially Approved":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "text-muted-foreground"
      case "Medium":
        return "text-accent"
      case "High":
        return "text-destructive"
      case "Urgent":
        return "text-destructive font-bold"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Purchase Indent</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Indent
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search indents by number, requester, department, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
            {editingIndent ? "Edit Purchase Indent" : "Create New Purchase Indent"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Indent No.</label>
                <input
                  type="text"
                  required
                  value={formData.indentNo}
                  onChange={(e) => setFormData({ ...formData, indentNo: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Indent Date</label>
                <input
                  type="date"
                  required
                  value={formData.indentDate}
                  onChange={(e) => setFormData({ ...formData, indentDate: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Requested By</label>
                <input
                  type="text"
                  required
                  value={formData.requestedBy}
                  onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Department</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-card-foreground mb-1">Remarks</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Add Items Section */}
            <div className="border-t border-border pt-6">
              <h4 className="text-md font-heading font-semibold text-card-foreground mb-4">Add Items</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Item</label>
                  <select
                    value={itemForm.itemCode}
                    onChange={(e) => {
                      const selectedItem = availableItems.find((item) => item.code === e.target.value)
                      setItemForm({
                        ...itemForm,
                        itemCode: e.target.value,
                        itemName: selectedItem ? selectedItem.name : "",
                        unit: selectedItem ? selectedItem.unit : "",
                      })
                    }}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select Item</option>
                    {availableItems.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code} - {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Quantity</label>
                  <input
                    type="number"
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Unit</label>
                  <input
                    type="text"
                    value={itemForm.unit}
                    readOnly
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Required Date</label>
                  <input
                    type="date"
                    value={itemForm.requiredDate}
                    onChange={(e) => setItemForm({ ...itemForm, requiredDate: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addItemToIndent}
                    className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium text-card-foreground mb-3">Items in Indent:</h5>
                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-card p-3 rounded border border-border"
                      >
                        <div className="flex-1">
                          <span className="font-medium">
                            {item.itemCode} - {item.itemName}
                          </span>
                          <span className="ml-4 text-muted-foreground">
                            Qty: {item.quantity} {item.unit} | Required: {item.requiredDate}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItemFromIndent(index)}
                          className="p-1 text-destructive hover:bg-destructive/10 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingIndent ? "Update Indent" : "Create Indent"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Indents Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Indent Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Requester Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Priority & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredIndents.map((indent) => (
                <tr key={indent.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <div className="text-sm font-medium text-card-foreground">{indent.indentNo}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(indent.indentDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-card-foreground flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {indent.requestedBy}
                    </div>
                    <div className="text-sm text-muted-foreground">{indent.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${getPriorityColor(indent.priority)}`}>
                      {indent.priority} Priority
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(indent.status)}`}
                    >
                      {indent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-card-foreground">{indent.totalItems} items</span>
                      <button
                        onClick={() => viewItems(indent)}
                        className="ml-2 p-1 text-primary hover:bg-primary/10 rounded"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(indent)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(indent.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Items Modal */}
      {showItemsModal && selectedIndent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg border border-border max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Items in {selectedIndent.indentNo}
              </h3>
              <button onClick={() => setShowItemsModal(false)} className="p-2 hover:bg-muted rounded-lg">
                ×
              </button>
            </div>
            <div className="space-y-3">
              {selectedIndent.items.map((item, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Item Code:</span>
                      <div className="font-medium">{item.itemCode}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Item Name:</span>
                      <div className="font-medium">{item.itemName}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Quantity:</span>
                      <div className="font-medium">
                        {item.quantity} {item.unit}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Required Date:</span>
                      <div className="font-medium">{new Date(item.requiredDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {filteredIndents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No purchase indents found matching your search criteria.
        </div>
      )}
    </div>
  )
}

export default PurchaseIndent
