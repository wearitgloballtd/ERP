"use client"

import React, { useState } from "react"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Truck,
  Calendar,
  Building,
  Package,
  Eye,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

const MaterialReceipt = () => {
  const [receipts, setReceipts] = useState([
    {
      id: 1,
      receiptNo: "MR001",
      receiptDate: "2024-01-25",
      poReference: "PO001",
      supplier: "ABC Construction Ltd.",
      supplierCode: "PTY001",
      receivedBy: "John Smith",
      status: "Completed",
      items: [
        {
          itemCode: "ITM001",
          itemName: "Steel Rod 12mm",
          orderedQty: 100,
          receivedQty: 95,
          unit: "KG",
          rate: 45.5,
          amount: 4322.5,
          status: "Partial",
        },
        {
          itemCode: "ITM002",
          itemName: "Cement Portland",
          orderedQty: 50,
          receivedQty: 50,
          unit: "BAG",
          rate: 350.0,
          amount: 17500,
          status: "Complete",
        },
      ],
      totalAmount: 21822.5,
      remarks: "Steel rods had minor quality issues, 5 KG rejected",
      qualityCheck: "Passed",
    },
    {
      id: 2,
      receiptNo: "MR002",
      receiptDate: "2024-01-28",
      poReference: "PO002",
      supplier: "PQR Materials",
      supplierCode: "PTY003",
      receivedBy: "Sarah Wilson",
      status: "Pending",
      items: [
        {
          itemCode: "ITM003",
          itemName: "Paint White",
          orderedQty: 25,
          receivedQty: 25,
          unit: "LTR",
          rate: 125.75,
          amount: 3143.75,
          status: "Complete",
        },
      ],
      totalAmount: 3143.75,
      remarks: "Quality check pending",
      qualityCheck: "Pending",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [editingReceipt, setEditingReceipt] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    receiptNo: "",
    receiptDate: new Date().toISOString().split("T")[0],
    poReference: "",
    supplier: "",
    supplierCode: "",
    receivedBy: "",
    status: "Pending",
    qualityCheck: "Pending",
    remarks: "",
    items: [],
  })

  const [itemForm, setItemForm] = useState({
    itemCode: "",
    itemName: "",
    orderedQty: "",
    receivedQty: "",
    unit: "",
    rate: "",
    amount: 0,
    status: "Complete",
  })

  const statuses = ["Pending", "In Progress", "Completed", "Rejected"]
  const qualityCheckStatuses = ["Pending", "Passed", "Failed", "Conditional"]
  const itemStatuses = ["Complete", "Partial", "Rejected"]

  // Sample data for dropdowns
  const availablePOs = [
    { number: "PO001", supplier: "ABC Construction Ltd.", supplierCode: "PTY001" },
    { number: "PO002", supplier: "PQR Materials", supplierCode: "PTY003" },
    { number: "PO003", supplier: "Steel Works Inc.", supplierCode: "PTY004" },
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
      alert("Please add at least one item to the material receipt")
      return
    }

    const totalAmount = formData.items.reduce((sum, item) => sum + item.amount, 0)

    if (editingReceipt) {
      setReceipts(
        receipts.map((receipt) =>
          receipt.id === editingReceipt.id ? { ...formData, id: editingReceipt.id, totalAmount } : receipt,
        ),
      )
    } else {
      const newReceipt = {
        ...formData,
        id: Date.now(),
        totalAmount,
      }
      setReceipts([...receipts, newReceipt])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      receiptNo: "",
      receiptDate: new Date().toISOString().split("T")[0],
      poReference: "",
      supplier: "",
      supplierCode: "",
      receivedBy: "",
      status: "Pending",
      qualityCheck: "Pending",
      remarks: "",
      items: [],
    })
    setShowForm(false)
    setEditingReceipt(null)
  }

  const handleEdit = (receipt) => {
    setFormData({
      receiptNo: receipt.receiptNo,
      receiptDate: receipt.receiptDate,
      poReference: receipt.poReference,
      supplier: receipt.supplier,
      supplierCode: receipt.supplierCode,
      receivedBy: receipt.receivedBy,
      status: receipt.status,
      qualityCheck: receipt.qualityCheck,
      remarks: receipt.remarks,
      items: [...receipt.items],
    })
    setEditingReceipt(receipt)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this material receipt?")) {
      setReceipts(receipts.filter((receipt) => receipt.id !== id))
    }
  }

  const addItemToReceipt = () => {
    if (!itemForm.itemCode || !itemForm.orderedQty || !itemForm.receivedQty || !itemForm.rate) {
      alert("Please fill all item details")
      return
    }

    const selectedItem = availableItems.find((item) => item.code === itemForm.itemCode)
    const receivedQty = Number.parseFloat(itemForm.receivedQty)
    const rate = Number.parseFloat(itemForm.rate)
    const amount = receivedQty * rate

    const newItem = {
      itemCode: itemForm.itemCode,
      itemName: selectedItem.name,
      orderedQty: Number.parseFloat(itemForm.orderedQty),
      receivedQty,
      unit: selectedItem.unit,
      rate,
      amount,
      status: itemForm.status,
    }

    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    })

    setItemForm({
      itemCode: "",
      itemName: "",
      orderedQty: "",
      receivedQty: "",
      unit: "",
      rate: "",
      amount: 0,
      status: "Complete",
    })
  }

  const removeItemFromReceipt = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const viewItems = (receipt) => {
    setSelectedReceipt(receipt)
    setShowItemsModal(true)
  }

  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.poReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-destructive text-destructive-foreground"
      case "In Progress":
        return "bg-primary text-primary-foreground"
      case "Completed":
        return "bg-secondary text-secondary-foreground"
      case "Rejected":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getQualityCheckColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-destructive text-destructive-foreground"
      case "Passed":
        return "bg-secondary text-secondary-foreground"
      case "Failed":
        return "bg-destructive text-destructive-foreground"
      case "Conditional":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getItemStatusColor = (status) => {
    switch (status) {
      case "Complete":
        return "text-secondary"
      case "Partial":
        return "text-accent"
      case "Rejected":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  // Calculate amount when received quantity or rate changes
  React.useEffect(() => {
    const receivedQty = Number.parseFloat(itemForm.receivedQty) || 0
    const rate = Number.parseFloat(itemForm.rate) || 0
    setItemForm((prev) => ({ ...prev, amount: receivedQty * rate }))
  }, [itemForm.receivedQty, itemForm.rate])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Material Receipt</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Receipt
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search receipts by number, supplier, PO reference, or status..."
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
            {editingReceipt ? "Edit Material Receipt" : "Create New Material Receipt"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Receipt No.</label>
                <input
                  type="text"
                  required
                  value={formData.receiptNo}
                  onChange={(e) => setFormData({ ...formData, receiptNo: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Receipt Date</label>
                <input
                  type="date"
                  required
                  value={formData.receiptDate}
                  onChange={(e) => setFormData({ ...formData, receiptDate: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">PO Reference</label>
                <select
                  required
                  value={formData.poReference}
                  onChange={(e) => {
                    const selectedPO = availablePOs.find((po) => po.number === e.target.value)
                    setFormData({
                      ...formData,
                      poReference: e.target.value,
                      supplier: selectedPO ? selectedPO.supplier : "",
                      supplierCode: selectedPO ? selectedPO.supplierCode : "",
                    })
                  }}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select PO</option>
                  {availablePOs.map((po) => (
                    <option key={po.number} value={po.number}>
                      {po.number} - {po.supplier}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Received By</label>
                <input
                  type="text"
                  required
                  value={formData.receivedBy}
                  onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
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
                <label className="block text-sm font-medium text-card-foreground mb-1">Quality Check</label>
                <select
                  value={formData.qualityCheck}
                  onChange={(e) => setFormData({ ...formData, qualityCheck: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {qualityCheckStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-card-foreground mb-1">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  readOnly
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg"
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Remarks</label>
              <textarea
                rows={2}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Add Items Section */}
            <div className="border-t border-border pt-6">
              <h4 className="text-md font-heading font-semibold text-card-foreground mb-4">Add Items</h4>
              <div className="grid grid-cols-1 md:grid-cols-8 gap-4 mb-4">
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
                  <label className="block text-sm font-medium text-card-foreground mb-1">Ordered Qty</label>
                  <input
                    type="number"
                    value={itemForm.orderedQty}
                    onChange={(e) => setItemForm({ ...itemForm, orderedQty: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Received Qty</label>
                  <input
                    type="number"
                    value={itemForm.receivedQty}
                    onChange={(e) => setItemForm({ ...itemForm, receivedQty: e.target.value })}
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
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Status</label>
                  <select
                    value={itemForm.status}
                    onChange={(e) => setItemForm({ ...itemForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {itemStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addItemToReceipt}
                    className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium text-card-foreground mb-3">Items in Receipt:</h5>
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
                            Ordered: {item.orderedQty} | Received: {item.receivedQty} {item.unit} | Rate: ₹{item.rate} |
                            Amount: ₹{item.amount.toFixed(2)} | Status:{" "}
                            <span className={getItemStatusColor(item.status)}>{item.status}</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItemFromReceipt(index)}
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
                {editingReceipt ? "Update Receipt" : "Create Receipt"}
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

      {/* Receipts Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Receipt Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Supplier & PO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status & Quality
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
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Truck className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <div className="text-sm font-medium text-card-foreground">{receipt.receiptNo}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(receipt.receiptDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Received by: {receipt.receivedBy}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-card-foreground">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{receipt.supplier}</div>
                        <div className="text-muted-foreground">{receipt.supplierCode}</div>
                        <div className="text-xs text-accent font-medium">PO: {receipt.poReference}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(receipt.status)}`}
                      >
                        {receipt.status}
                      </span>
                      <div className="flex items-center">
                        {receipt.qualityCheck === "Passed" ? (
                          <CheckCircle className="h-4 w-4 text-secondary mr-1" />
                        ) : receipt.qualityCheck === "Failed" ? (
                          <AlertCircle className="h-4 w-4 text-destructive mr-1" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-muted-foreground mr-1" />
                        )}
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${getQualityCheckColor(receipt.qualityCheck)}`}
                        >
                          QC: {receipt.qualityCheck}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm font-medium text-card-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />₹{receipt.totalAmount.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Package className="h-4 w-4 mr-1" />
                      {receipt.items.length} items
                      <button
                        onClick={() => viewItems(receipt)}
                        className="ml-2 p-1 text-primary hover:bg-primary/10 rounded"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(receipt)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(receipt.id)}
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
      {showItemsModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg border border-border max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Items in {selectedReceipt.receiptNo}
              </h3>
              <button onClick={() => setShowItemsModal(false)} className="p-2 hover:bg-muted rounded-lg">
                ×
              </button>
            </div>
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">PO Reference:</span>
                  <div className="font-medium">{selectedReceipt.poReference}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Quality Check:</span>
                  <div className={`font-medium ${getItemStatusColor(selectedReceipt.qualityCheck)}`}>
                    {selectedReceipt.qualityCheck}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Received By:</span>
                  <div className="font-medium">{selectedReceipt.receivedBy}</div>
                </div>
              </div>
              {selectedReceipt.remarks && (
                <div className="mt-3">
                  <span className="text-sm text-muted-foreground">Remarks:</span>
                  <p className="text-sm text-card-foreground mt-1">{selectedReceipt.remarks}</p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {selectedReceipt.items.map((item, index) => (
                <div key={index} className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Item Code:</span>
                      <div className="font-medium">{item.itemCode}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Item Name:</span>
                      <div className="font-medium">{item.itemName}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Ordered:</span>
                      <div className="font-medium">
                        {item.orderedQty} {item.unit}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Received:</span>
                      <div className="font-medium">
                        {item.receivedQty} {item.unit}
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
                    <div>
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <div className={`font-medium ${getItemStatusColor(item.status)}`}>{item.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right border-t border-border pt-4">
              <span className="text-xl font-bold">Total Amount: ₹{selectedReceipt.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {filteredReceipts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No material receipts found matching your search criteria.
        </div>
      )}
    </div>
  )
}

export default MaterialReceipt
