"use client"

import React, { useState } from "react"
import { Plus, Search, Edit, Trash2, Wrench, Calendar, Building, Package, Eye, DollarSign, Clock } from "lucide-react"

const JobWorkOrder = () => {
  const [jobOrders, setJobOrders] = useState([
    {
      id: 1,
      jobOrderNo: "JWO001",
      jobOrderDate: "2024-01-20",
      contractor: "XYZ Enterprises",
      contractorCode: "PTY002",
      jobType: "Manufacturing",
      startDate: "2024-01-25",
      expectedEndDate: "2024-02-10",
      status: "In Progress",
      priority: "High",
      items: [
        { itemCode: "ITM001", itemName: "Steel Rod 12mm", quantity: 50, unit: "KG", rate: 15.0, amount: 750 },
        { itemCode: "ITM003", itemName: "Paint White", quantity: 10, unit: "LTR", rate: 25.0, amount: 250 },
      ],
      totalAmount: 1000,
      workDescription: "Steel fabrication and painting work for Project A",
      remarks: "Quality check required at each stage",
    },
    {
      id: 2,
      jobOrderNo: "JWO002",
      jobOrderDate: "2024-01-22",
      contractor: "ABC Construction Ltd.",
      contractorCode: "PTY001",
      jobType: "Assembly",
      startDate: "2024-01-28",
      expectedEndDate: "2024-02-05",
      status: "Pending",
      priority: "Medium",
      items: [{ itemCode: "ITM002", itemName: "Cement Portland", quantity: 20, unit: "BAG", rate: 50.0, amount: 1000 }],
      totalAmount: 1000,
      workDescription: "Assembly and installation work",
      remarks: "Site preparation required before start",
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [selectedJobOrder, setSelectedJobOrder] = useState(null)
  const [editingJobOrder, setEditingJobOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    jobOrderNo: "",
    jobOrderDate: new Date().toISOString().split("T")[0],
    contractor: "",
    contractorCode: "",
    jobType: "",
    startDate: "",
    expectedEndDate: "",
    status: "Pending",
    priority: "Medium",
    workDescription: "",
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

  const jobTypes = ["Manufacturing", "Assembly", "Repair", "Maintenance", "Installation", "Testing"]
  const statuses = ["Pending", "In Progress", "On Hold", "Completed", "Cancelled", "Quality Check"]
  const priorities = ["Low", "Medium", "High", "Urgent"]

  // Sample data for dropdowns
  const availableContractors = [
    { code: "PTY001", name: "ABC Construction Ltd." },
    { code: "PTY002", name: "XYZ Enterprises" },
    { code: "PTY005", name: "Tech Solutions Inc." },
  ]

  const availableItems = [
    { code: "ITM001", name: "Steel Rod 12mm", unit: "KG", rate: 15.0 },
    { code: "ITM002", name: "Cement Portland", unit: "BAG", rate: 50.0 },
    { code: "ITM003", name: "Paint White", unit: "LTR", rate: 25.0 },
    { code: "ITM004", name: "Brick Red", unit: "PCS", rate: 5.0 },
    { code: "ITM005", name: "Wire Copper", unit: "MTR", rate: 12.0 },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.items.length === 0) {
      alert("Please add at least one item to the job work order")
      return
    }

    const totalAmount = formData.items.reduce((sum, item) => sum + item.amount, 0)

    if (editingJobOrder) {
      setJobOrders(
        jobOrders.map((order) =>
          order.id === editingJobOrder.id ? { ...formData, id: editingJobOrder.id, totalAmount } : order,
        ),
      )
    } else {
      const newJobOrder = {
        ...formData,
        id: Date.now(),
        totalAmount,
      }
      setJobOrders([...jobOrders, newJobOrder])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      jobOrderNo: "",
      jobOrderDate: new Date().toISOString().split("T")[0],
      contractor: "",
      contractorCode: "",
      jobType: "",
      startDate: "",
      expectedEndDate: "",
      status: "Pending",
      priority: "Medium",
      workDescription: "",
      remarks: "",
      items: [],
    })
    setShowForm(false)
    setEditingJobOrder(null)
  }

  const handleEdit = (jobOrder) => {
    setFormData({
      jobOrderNo: jobOrder.jobOrderNo,
      jobOrderDate: jobOrder.jobOrderDate,
      contractor: jobOrder.contractor,
      contractorCode: jobOrder.contractorCode,
      jobType: jobOrder.jobType,
      startDate: jobOrder.startDate,
      expectedEndDate: jobOrder.expectedEndDate,
      status: jobOrder.status,
      priority: jobOrder.priority,
      workDescription: jobOrder.workDescription,
      remarks: jobOrder.remarks,
      items: [...jobOrder.items],
    })
    setEditingJobOrder(jobOrder)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this job work order?")) {
      setJobOrders(jobOrders.filter((order) => order.id !== id))
    }
  }

  const addItemToJobOrder = () => {
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

  const removeItemFromJobOrder = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const viewItems = (jobOrder) => {
    setSelectedJobOrder(jobOrder)
    setShowItemsModal(true)
  }

  const filteredJobOrders = jobOrders.filter(
    (order) =>
      order.jobOrderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.jobType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-destructive text-destructive-foreground"
      case "In Progress":
        return "bg-primary text-primary-foreground"
      case "On Hold":
        return "bg-muted text-muted-foreground"
      case "Completed":
        return "bg-secondary text-secondary-foreground"
      case "Cancelled":
        return "bg-destructive text-destructive-foreground"
      case "Quality Check":
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

  // Calculate amount when quantity or rate changes
  React.useEffect(() => {
    const quantity = Number.parseFloat(itemForm.quantity) || 0
    const rate = Number.parseFloat(itemForm.rate) || 0
    setItemForm((prev) => ({ ...prev, amount: quantity * rate }))
  }, [itemForm.quantity, itemForm.rate])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Job Work Order</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Job Order
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search job orders by number, contractor, job type, or status..."
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
            {editingJobOrder ? "Edit Job Work Order" : "Create New Job Work Order"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Job Order No.</label>
                <input
                  type="text"
                  required
                  value={formData.jobOrderNo}
                  onChange={(e) => setFormData({ ...formData, jobOrderNo: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Job Order Date</label>
                <input
                  type="date"
                  required
                  value={formData.jobOrderDate}
                  onChange={(e) => setFormData({ ...formData, jobOrderDate: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Contractor</label>
                <select
                  required
                  value={formData.contractorCode}
                  onChange={(e) => {
                    const selectedContractor = availableContractors.find((c) => c.code === e.target.value)
                    setFormData({
                      ...formData,
                      contractorCode: e.target.value,
                      contractor: selectedContractor ? selectedContractor.name : "",
                    })
                  }}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Contractor</option>
                  {availableContractors.map((contractor) => (
                    <option key={contractor.code} value={contractor.code}>
                      {contractor.code} - {contractor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Job Type</label>
                <select
                  required
                  value={formData.jobType}
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Job Type</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Expected End Date</label>
                <input
                  type="date"
                  required
                  value={formData.expectedEndDate}
                  onChange={(e) => setFormData({ ...formData, expectedEndDate: e.target.value })}
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
            </div>

            {/* Work Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Work Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.workDescription}
                  onChange={(e) => setFormData({ ...formData, workDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Remarks</label>
                <textarea
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Add Items Section */}
            <div className="border-t border-border pt-6">
              <h4 className="text-md font-heading font-semibold text-card-foreground mb-4">Add Materials/Items</h4>
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
                    onClick={addItemToJobOrder}
                    className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium text-card-foreground mb-3">Materials/Items in Job Order:</h5>
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
                          onClick={() => removeItemFromJobOrder(index)}
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
                {editingJobOrder ? "Update Job Order" : "Create Job Order"}
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

      {/* Job Orders Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Job Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contractor & Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Timeline & Status
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
              {filteredJobOrders.map((jobOrder) => (
                <tr key={jobOrder.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Wrench className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <div className="text-sm font-medium text-card-foreground">{jobOrder.jobOrderNo}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(jobOrder.jobOrderDate).toLocaleDateString()}
                        </div>
                        <div className={`text-sm font-medium ${getPriorityColor(jobOrder.priority)}`}>
                          {jobOrder.priority} Priority
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-card-foreground">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{jobOrder.contractor}</div>
                        <div className="text-muted-foreground">{jobOrder.contractorCode}</div>
                        <div className="text-xs text-accent font-medium">{jobOrder.jobType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm text-card-foreground flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        Start: {new Date(jobOrder.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        End: {new Date(jobOrder.expectedEndDate).toLocaleDateString()}
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(jobOrder.status)}`}
                      >
                        {jobOrder.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm font-medium text-card-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />₹{jobOrder.totalAmount.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Package className="h-4 w-4 mr-1" />
                      {jobOrder.items.length} items
                      <button
                        onClick={() => viewItems(jobOrder)}
                        className="ml-2 p-1 text-primary hover:bg-primary/10 rounded"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(jobOrder)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(jobOrder.id)}
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
      {showItemsModal && selectedJobOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg border border-border max-w-5xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Materials/Items in {selectedJobOrder.jobOrderNo}
              </h3>
              <button onClick={() => setShowItemsModal(false)} className="p-2 hover:bg-muted rounded-lg">
                ×
              </button>
            </div>
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-card-foreground mb-2">Work Description:</h4>
              <p className="text-sm text-muted-foreground">{selectedJobOrder.workDescription}</p>
              {selectedJobOrder.remarks && (
                <>
                  <h4 className="font-medium text-card-foreground mb-2 mt-3">Remarks:</h4>
                  <p className="text-sm text-muted-foreground">{selectedJobOrder.remarks}</p>
                </>
              )}
            </div>
            <div className="space-y-3">
              {selectedJobOrder.items.map((item, index) => (
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
              <span className="text-xl font-bold">Total Amount: ₹{selectedJobOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {filteredJobOrders.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No job work orders found matching your search criteria.
        </div>
      )}
    </div>
  )
}

export default JobWorkOrder
