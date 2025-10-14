"use client"

import React, { useState } from "react"
import { Plus, Search, Edit, Trash2, Receipt, Calendar, Building, Package, Eye, DollarSign } from "lucide-react"

const SalesInvoice = () => {
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      invoiceNo: "SI001",
      invoiceDate: "2024-01-30",
      customer: "XYZ Enterprises",
      customerCode: "PTY002",
      materialReceiptRef: "MR001",
      dueDate: "2024-02-29",
      status: "Paid",
      paymentTerms: "30 Days",
      items: [
        {
          itemCode: "ITM001",
          itemName: "Steel Rod 12mm",
          quantity: 95,
          unit: "KG",
          rate: 55.0,
          amount: 5225,
          taxRate: 18,
          taxAmount: 940.5,
        },
        {
          itemCode: "ITM002",
          itemName: "Cement Portland",
          quantity: 50,
          unit: "BAG",
          rate: 400.0,
          amount: 20000,
          taxRate: 18,
          taxAmount: 3600,
        },
      ],
      subtotal: 25225,
      totalTax: 4540.5,
      totalAmount: 29765.5,
      remarks: "Payment received on time",
      discount: 0,
    },
    {
      id: 2,
      invoiceNo: "SI002",
      invoiceDate: "2024-02-01",
      customer: "ABC Construction Ltd.",
      customerCode: "PTY001",
      materialReceiptRef: "MR002",
      dueDate: "2024-03-02",
      status: "Pending",
      paymentTerms: "30 Days",
      items: [
        {
          itemCode: "ITM003",
          itemName: "Paint White",
          quantity: 25,
          unit: "LTR",
          rate: 150.0,
          amount: 3750,
          taxRate: 18,
          taxAmount: 675,
        },
      ],
      subtotal: 3750,
      totalTax: 675,
      totalAmount: 4425,
      remarks: "Follow up required for payment",
      discount: 0,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [showItemsModal, setShowItemsModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    invoiceNo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    customer: "",
    customerCode: "",
    materialReceiptRef: "",
    dueDate: "",
    status: "Pending",
    paymentTerms: "30 Days",
    discount: 0,
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
    taxRate: 18,
    taxAmount: 0,
  })

  const statuses = ["Pending", "Sent", "Paid", "Overdue", "Cancelled", "Partially Paid"]
  const paymentTermsList = ["15 Days", "30 Days", "45 Days", "60 Days", "Immediate", "COD"]
  const taxRates = [0, 5, 12, 18, 28]

  // Sample data for dropdowns
  const availableCustomers = [
    { code: "PTY001", name: "ABC Construction Ltd." },
    { code: "PTY002", name: "XYZ Enterprises" },
    { code: "PTY006", name: "Modern Builders" },
  ]

  const availableMaterialReceipts = [
    { number: "MR001", date: "2024-01-25" },
    { number: "MR002", date: "2024-01-28" },
    { number: "MR003", date: "2024-01-30" },
  ]

  const availableItems = [
    { code: "ITM001", name: "Steel Rod 12mm", unit: "KG", rate: 55.0 },
    { code: "ITM002", name: "Cement Portland", unit: "BAG", rate: 400.0 },
    { code: "ITM003", name: "Paint White", unit: "LTR", rate: 150.0 },
    { code: "ITM004", name: "Brick Red", unit: "PCS", rate: 10.0 },
    { code: "ITM005", name: "Wire Copper", unit: "MTR", rate: 30.0 },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.items.length === 0) {
      alert("Please add at least one item to the sales invoice")
      return
    }

    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0)
    const totalTax = formData.items.reduce((sum, item) => sum + item.taxAmount, 0)
    const discount = Number.parseFloat(formData.discount) || 0
    const totalAmount = subtotal + totalTax - discount

    if (editingInvoice) {
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === editingInvoice.id
            ? { ...formData, id: editingInvoice.id, subtotal, totalTax, totalAmount, discount }
            : invoice,
        ),
      )
    } else {
      const newInvoice = {
        ...formData,
        id: Date.now(),
        subtotal,
        totalTax,
        totalAmount,
        discount,
      }
      setInvoices([...invoices, newInvoice])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      invoiceNo: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      customer: "",
      customerCode: "",
      materialReceiptRef: "",
      dueDate: "",
      status: "Pending",
      paymentTerms: "30 Days",
      discount: 0,
      remarks: "",
      items: [],
    })
    setShowForm(false)
    setEditingInvoice(null)
  }

  const handleEdit = (invoice) => {
    setFormData({
      invoiceNo: invoice.invoiceNo,
      invoiceDate: invoice.invoiceDate,
      customer: invoice.customer,
      customerCode: invoice.customerCode,
      materialReceiptRef: invoice.materialReceiptRef,
      dueDate: invoice.dueDate,
      status: invoice.status,
      paymentTerms: invoice.paymentTerms,
      discount: invoice.discount,
      remarks: invoice.remarks,
      items: [...invoice.items],
    })
    setEditingInvoice(invoice)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this sales invoice?")) {
      setInvoices(invoices.filter((invoice) => invoice.id !== id))
    }
  }

  const addItemToInvoice = () => {
    if (!itemForm.itemCode || !itemForm.quantity || !itemForm.rate) {
      alert("Please fill all item details")
      return
    }

    const selectedItem = availableItems.find((item) => item.code === itemForm.itemCode)
    const quantity = Number.parseFloat(itemForm.quantity)
    const rate = Number.parseFloat(itemForm.rate)
    const amount = quantity * rate
    const taxRate = Number.parseFloat(itemForm.taxRate)
    const taxAmount = (amount * taxRate) / 100

    const newItem = {
      itemCode: itemForm.itemCode,
      itemName: selectedItem.name,
      quantity,
      unit: selectedItem.unit,
      rate,
      amount,
      taxRate,
      taxAmount,
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
      taxRate: 18,
      taxAmount: 0,
    })
  }

  const removeItemFromInvoice = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const viewItems = (invoice) => {
    setSelectedInvoice(invoice)
    setShowItemsModal(true)
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.materialReceiptRef.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-destructive text-destructive-foreground"
      case "Sent":
        return "bg-primary text-primary-foreground"
      case "Paid":
        return "bg-secondary text-secondary-foreground"
      case "Overdue":
        return "bg-destructive text-destructive-foreground"
      case "Cancelled":
        return "bg-muted text-muted-foreground"
      case "Partially Paid":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // Calculate amounts when quantity, rate, or tax rate changes
  React.useEffect(() => {
    const quantity = Number.parseFloat(itemForm.quantity) || 0
    const rate = Number.parseFloat(itemForm.rate) || 0
    const amount = quantity * rate
    const taxRate = Number.parseFloat(itemForm.taxRate) || 0
    const taxAmount = (amount * taxRate) / 100

    setItemForm((prev) => ({ ...prev, amount, taxAmount }))
  }, [itemForm.quantity, itemForm.rate, itemForm.taxRate])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Sales Invoice</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search invoices by number, customer, status, or material receipt reference..."
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
            {editingInvoice ? "Edit Sales Invoice" : "Create New Sales Invoice"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Invoice No.</label>
                <input
                  type="text"
                  required
                  value={formData.invoiceNo}
                  onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Invoice Date</label>
                <input
                  type="date"
                  required
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Customer</label>
                <select
                  required
                  value={formData.customerCode}
                  onChange={(e) => {
                    const selectedCustomer = availableCustomers.find((c) => c.code === e.target.value)
                    setFormData({
                      ...formData,
                      customerCode: e.target.value,
                      customer: selectedCustomer ? selectedCustomer.name : "",
                    })
                  }}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Customer</option>
                  {availableCustomers.map((customer) => (
                    <option key={customer.code} value={customer.code}>
                      {customer.code} - {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Material Receipt Ref</label>
                <select
                  value={formData.materialReceiptRef}
                  onChange={(e) => setFormData({ ...formData, materialReceiptRef: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Receipt</option>
                  {availableMaterialReceipts.map((receipt) => (
                    <option key={receipt.number} value={receipt.number}>
                      {receipt.number} - {receipt.date}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
                <label className="block text-sm font-medium text-card-foreground mb-1">Discount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
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
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Tax %</label>
                  <select
                    value={itemForm.taxRate}
                    onChange={(e) => setItemForm({ ...itemForm, taxRate: e.target.value })}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {taxRates.map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}%
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-1">Tax Amount</label>
                  <input
                    type="number"
                    value={itemForm.taxAmount.toFixed(2)}
                    readOnly
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={addItemToInvoice}
                    className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="bg-muted p-4 rounded-lg">
                  <h5 className="font-medium text-card-foreground mb-3">Items in Invoice:</h5>
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
                            Qty: {item.quantity} {item.unit} | Rate: ₹{item.rate} | Amount: ₹{item.amount.toFixed(2)} |
                            Tax ({item.taxRate}%): ₹{item.taxAmount.toFixed(2)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItemFromInvoice(index)}
                          className="p-1 text-destructive hover:bg-destructive/10 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2 text-right">
                    <div className="text-sm">
                      Subtotal: ₹{formData.items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                    </div>
                    <div className="text-sm">
                      Total Tax: ₹{formData.items.reduce((sum, item) => sum + item.taxAmount, 0).toFixed(2)}
                    </div>
                    {formData.discount > 0 && (
                      <div className="text-sm">Discount: -₹{Number.parseFloat(formData.discount).toFixed(2)}</div>
                    )}
                    <div className="text-lg font-semibold border-t border-border pt-2">
                      Total Amount: ₹
                      {(
                        formData.items.reduce((sum, item) => sum + item.amount, 0) +
                        formData.items.reduce((sum, item) => sum + item.taxAmount, 0) -
                        (Number.parseFloat(formData.discount) || 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {editingInvoice ? "Update Invoice" : "Create Invoice"}
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

      {/* Invoices Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Invoice Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer & Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Due Date & Status
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
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Receipt className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <div className="text-sm font-medium text-card-foreground">{invoice.invoiceNo}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Terms: {invoice.paymentTerms}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-card-foreground">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{invoice.customer}</div>
                        <div className="text-muted-foreground">{invoice.customerCode}</div>
                        {invoice.materialReceiptRef && (
                          <div className="text-xs text-accent font-medium">Ref: {invoice.materialReceiptRef}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-card-foreground">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                    {invoice.discount > 0 && (
                      <div className="text-xs text-accent mt-1">Discount: ₹{invoice.discount.toFixed(2)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm font-medium text-card-foreground">
                        <DollarSign className="h-4 w-4 mr-1" />₹{invoice.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Subtotal: ₹{invoice.subtotal.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">Tax: ₹{invoice.totalTax.toFixed(2)}</div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Package className="h-4 w-4 mr-1" />
                        {invoice.items.length} items
                        <button
                          onClick={() => viewItems(invoice)}
                          className="ml-2 p-1 text-primary hover:bg-primary/10 rounded"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(invoice)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(invoice.id)}
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
      {showItemsModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg border border-border max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Items in {selectedInvoice.invoiceNo}
              </h3>
              <button onClick={() => setShowItemsModal(false)} className="p-2 hover:bg-muted rounded-lg">
                ×
              </button>
            </div>
            <div className="mb-4 p-4 bg-muted rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Customer:</span>
                  <div className="font-medium">{selectedInvoice.customer}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Due Date:</span>
                  <div className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Payment Terms:</span>
                  <div className="font-medium">{selectedInvoice.paymentTerms}</div>
                </div>
              </div>
              {selectedInvoice.materialReceiptRef && (
                <div className="mt-3">
                  <span className="text-sm text-muted-foreground">Material Receipt Reference:</span>
                  <div className="font-medium">{selectedInvoice.materialReceiptRef}</div>
                </div>
              )}
              {selectedInvoice.remarks && (
                <div className="mt-3">
                  <span className="text-sm text-muted-foreground">Remarks:</span>
                  <p className="text-sm text-card-foreground mt-1">{selectedInvoice.remarks}</p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {selectedInvoice.items.map((item, index) => (
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
                    <div>
                      <span className="text-sm text-muted-foreground">Tax ({item.taxRate}%):</span>
                      <div className="font-medium">₹{item.taxAmount.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total:</span>
                      <div className="font-medium">₹{(item.amount + item.taxAmount).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 text-right border-t border-border pt-4">
              <div className="text-lg">Subtotal: ₹{selectedInvoice.subtotal.toFixed(2)}</div>
              <div className="text-lg">Total Tax: ₹{selectedInvoice.totalTax.toFixed(2)}</div>
              {selectedInvoice.discount > 0 && (
                <div className="text-lg text-accent">Discount: -₹{selectedInvoice.discount.toFixed(2)}</div>
              )}
              <div className="text-2xl font-bold border-t border-border pt-2">
                Total Amount: ₹{selectedInvoice.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredInvoices.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No sales invoices found matching your search criteria.
        </div>
      )}
    </div>
  )
}

export default SalesInvoice
