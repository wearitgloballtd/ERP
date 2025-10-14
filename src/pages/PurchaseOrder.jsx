"use client"

import React, { useState } from "react"
import { Plus, Search, Edit, Trash2, ShoppingCart, Calendar, Building, Package, Eye, DollarSign } from "lucide-react"

const PurchaseOrder = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      poNumber: "PO001",
      poDate: "2024-01-18",
      supplier: "ABC Construction Ltd.",
      supplierCode: "PTY001",
      indentRef: "PI001",
      deliveryDate: "2024-01-25",
      status: "Pending",
      paymentTerms: "30 Days",
      items: [
        { itemCode: "ITM001", itemName: "Steel Rod 12mm", quantity: 100, unit: "KG", rate: 45.5, amount: 4550 },
        { itemCode: "ITM002", itemName: "Cement Portland", quantity: 50, unit: "BAG", rate: 350.0, amount: 17500 },
      ],
      totalAmount: 22050,
      remarks: "Delivery required at site location",
    },
    {
      id: 2,
      poNumber: "PO002",
      poDate: "2024-01-19",
      supplier: "PQR Materials",
      supplierCode: "PTY003",
      indentRef: "PI002",
      deliveryDate: "2024-01-28",
      status: "Approved",
      paymentTerms: "15 Days",
      items: [
        { itemCode: "ITM003", itemName: "Paint White", quantity: 25, unit: "LTR", rate: 125.75, amount: 3143.75 },
      ],
      totalAmount: 3143.75,
      remarks: "Quality check required before delivery",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [editingOrder, setEditingOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    poNumber: "",
    poDate: new Date().toISOString().split("T")[0],
    supplier: "",
    supplierCode: "",
    indentRef: "",
    deliveryDate: "",
    status: "Pending",
    paymentTerms: "30 Days",
    remarks: "",
    items: [],
  })

  const [itemForm, setItemForm] = useState({
    itemCode: "",
    itemName: "",
    quantity: "",
    unit: "",
    rate: "",
    amount: 0,
  })

  const statuses = [
    "Pending",
    "Approved",
    "Sent to Supplier",
    "Acknowledged",
    "Partially Received",
    "Completed",
    "Cancelled",
  ]
  const paymentTermsList = ["15 Days", "30 Days", "45 Days", "60 Days", "Advance", "COD"]

  // Sample data for dropdowns
  const availableSuppliers = [
    { code: "PTY001", name: "ABC Construction Ltd." },
    { code: "PTY003", name: "PQR Materials" },
    { code: "PTY004", name: "Steel Works Inc." },
  ]

  const availableIndents = [
    { number: "PI001", date: "2024-01-15" },
    { number: "PI002", date: "2024-01-16" },
    { number: "PI003", date: "2024-01-17" },
  ]

  const availableItems = [
    { code: "ITM001", name: "Steel Rod 12mm", unit: "KG", rate: 45.5 },
    { code: "ITM002", name: "Cement Portland", unit: "BAG", rate: 350.0 },
    { code: "ITM003", name: "Paint White", unit: "LTR", rate: 125.75 },
    { code: "ITM004", name: "Brick Red", unit: "PCS", rate: 8.5 },
    { code: "ITM005", name: "Wire Copper", unit: "MTR", rate: 25.0 },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.items.length === 0) {
      alert("Please add at least one item to the purchase order")
      return
    }

    const totalAmount = formData.items.reduce((sum, item) => sum + item.amount, 0)

    if (editingOrder) {
      setOrders(
        orders.map((order) =>
          order.id === editingOrder.id ? { ...formData, id: editingOrder.id, totalAmount } : order,
        ),
      )
    } else {
      const newOrder = {
        ...formData,
        id: Date.now(),
        totalAmount,
      }
      setOrders([...orders, newOrder])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      poNumber: "",
      poDate: new Date().toISOString().split("T")[0],
      supplier: "",
      supplierCode: "",
      indentRef: "",
      deliveryDate: "",
      status: "Pending",
      paymentTerms: "30 Days",
      remarks: "",
      items: [],
    })
    setShowForm(false)
    setEditingOrder(null)
  }

  const handleEdit = (order) => {
    setFormData({
      poNumber: order.poNumber,
      poDate: order.poDate,
      supplier: order.supplier,
      supplierCode: order.supplierCode,
      indentRef: order.indentRef,
      deliveryDate: order.deliveryDate,
      status: order.status,
      paymentTerms: order.paymentTerms,
      remarks: order.remarks,
      items: [...order.items],
    })
    setEditingOrder(order)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this purchase order?")) {
      setOrders(orders.filter((order) => order.id !== id))
    }
  }

  const addItemToOrder = () => {
    if (!itemForm.itemCode || !itemForm.quantity || !itemForm.rate) {
      alert("Please fill all item details")
      return
    }

    const selectedItem = availableItems.find((item) => item.code === itemForm.itemCode)
    const quantity = Number.parseFloat(itemForm.quantity)
    const rate = Number.parseFloat(itemForm.rate)
    const amount = quantity * rate

    const newItem = {
      itemCode: itemForm.itemCode,
      itemName: selectedItem.name,
      quantity,
      unit: selectedItem.unit,
      rate,
      amount,
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
      rate: "",
      amount: 0,
    })
  }

  const removeItemFromOrder = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const viewItems = (order) => {
    setSelectedOrder(order)
    setShowItemsModal(true)
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.indentRef.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-destructive text-destructive-foreground"
      case "Approved":
        return "bg-secondary text-secondary-foreground"
      case "Sent to Supplier":
        return "bg-accent text-accent-foreground"
      case "Acknowledged":
        return "bg-primary text-primary-foreground"
      case "Partially Received":
        return "bg-muted text-muted-foreground"
      case "Completed":
        return "bg-secondary text-secondary-foreground"
      case "Cancelled":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // Calculate amount when quantity or rate changes
  React.useEffect(() => {
    const quantity = Number.parseFloat(itemForm.quantity) || 0
    const rate = Number.parseFloat(itemForm.rate) || 0
    setItemForm((prev) => ({ ...prev, amount: quantity * rate }))
  }, [itemForm.quantity, itemForm.rate])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Purchase Order</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create PO
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search purchase orders by PO number, supplier, status, or indent reference..."
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
            {editingOrder ? "Edit Purchase Order" : "Create New Purchase Order"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">PO Number</label>
                <input
                  type="text"
                  required
                  value={formData.poNumber}
                  onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">PO Date</label>
                <input
                  type="date"
                  required
                  value={formData.poDate}
                  onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Supplier</label>
                <select
                  required
                  value={formData.supplierCode}
                  onChange={(e) => {
                    const selectedSupplier = availableSuppliers.find((s) => s.code === e.target.value)
                    setFormData({
                      ...formData,
                      supplierCode: e.target.value,
                      supplier: selectedSupplier ? selectedSupplier.name : "",
                    })
                  }}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Supplier</option>
                  {availableSuppliers.map((supplier) => (
                    <option key={supplier.code} value={supplier.code}>
                      {supplier.code} - {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Indent Reference</label>
                <select
                  value={formData.indentRef}
                  onChange={(e) => setFormData({ ...formData, indentRef: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Indent</option>
                  {availableIndents.map((indent) => (
                    <option key={indent.number} value={indent.number}>
                      {indent.number} - {indent.date}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Delivery Date</label>
                <input
                  type="date"
                  required
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
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
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Payment Terms</label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {paymentTermsList.map((term) => (
                    <option key={term} value={term}>
                      {term}
                    </option>
                  ))}
                </select>
              </div>
              <div>
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
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
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
                        rate: selectedItem ? selectedItem.rate.toString() : "",
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
                  <label className="block text-sm font-medium text-card-foreground mb-1">Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    value={itemForm.rate}
                    onChange={(e) => setItemForm({ ...itemForm, rate: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Amount</label>
                  <input
                    type="number"
                    value={itemForm.amount.toFixed(2)}
                    readOnly
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addItemToOrder}
                    className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium text-card-foreground mb-3">Items in Purchase Order:</h5>
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
                            Qty: {item.quantity} {item.unit} | Rate: ₹{item.rate} | Amount: ₹{item.amount.toFixed(2)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItemFromOrder(index)}
                          className="p-1 text-destructive hover:bg-destructive/10 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <span className="text-lg font-semibold">
                      Total Amount: ₹{formData.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingOrder ? "Update PO" : "Create PO"}
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

      {/* Orders Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  PO Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Supplier Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Delivery & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount & Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <ShoppingCart className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <div className="text-sm font-medium text-card-foreground">{order.poNumber}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(order.poDate).toLocaleDateString()}
                        </div>
                        {order.indentRef && <div className="text-xs text-muted-foreground">Ref: {order.indentRef}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-card-foreground">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{order.supplier}</div>
                        <div className="text-muted-foreground">{order.supplierCode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-card-foreground">
                      Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                    <div className="text-xs text-muted-foreground mt-1">Payment: {order.paymentTerms}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm font-medium text-card-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />₹{order.totalAmount.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Package className="h-4 w-4 mr-1" />
                      {order.items.length} items
                      <button
                        onClick={() => viewItems(order)}
                        className="ml-2 p-1 text-primary hover:bg-primary/10 rounded"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
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
      {showItemsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg border border-border max-w-5xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Items in {selectedOrder.poNumber}
              </h3>
              <button onClick={() => setShowItemsModal(false)} className="p-2 hover:bg-muted rounded-lg">
                ×
              </button>
            </div>
            <div className="space-y-3">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                      <span className="text-sm text-muted-foreground">Rate:</span>
                      <div className="font-medium">₹{item.rate.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Amount:</span>
                      <div className="font-medium">₹{item.amount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right border-t border-border pt-4">
              <span className="text-xl font-bold">Total Amount: ₹{selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No purchase orders found matching your search criteria.
        </div>
      )}
    </div>
  )
}

export default PurchaseOrder
