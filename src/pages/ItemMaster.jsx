"use client"

import { useState, useMemo, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Package, DollarSign } from "lucide-react"
import { ref, push, set, get, remove, onValue } from "firebase/database"
import { database } from "@/lib/firebase"

const ItemMaster = () => {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("sales")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    itemType: "",
    machineName: "",
    itemCode: "",
    tax: "",
    itemGroup: "",
    uom: "",
    hsnCode: "",
    leadTime: "",
    price: "",
    currency: "",
  })

  const categories = ["Raw Material", "Finished Goods", "Semi Finished", "Consumables"]
  const units = ["KG", "LTR", "PCS", "BAG", "MTR", "SQM"]

  // Compute financial year for item code generation
  const computeFinancialYear = () => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()
    const fyStart = month >= 3 ? year : year - 1
    const fyEndShort = ((fyStart + 1) % 100).toString().padStart(2, "0")
    return `${fyStart}-${fyEndShort}`
  }

  const zeroPad = (num, places) => String(num).padStart(places, "0")
  const formatItemCode = (seq) => `PA/IC/${computeFinancialYear()}/${zeroPad(seq, 5)}`

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    return (
      formData.itemName.trim() !== "" &&
      formData.itemType !== "" &&
      formData.machineName !== "" &&
      formData.itemCode.trim() !== "" &&
      formData.tax !== "" &&
      formData.itemGroup !== "" &&
      formData.uom !== "" &&
      formData.hsnCode.trim() !== "" &&
      formData.leadTime.trim() !== "" &&
      formData.price.trim() !== "" &&
      formData.currency !== ""
    )
  }, [formData])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Close modal on Escape key press and prevent body scroll
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showForm) {
        resetForm()
      }
    }
    
    if (showForm) {
      document.body.style.overflow = "hidden"
      document.addEventListener("keydown", handleEscape)
    }
    
    return () => {
      document.body.style.overflow = "unset"
      document.removeEventListener("keydown", handleEscape)
    }
  }, [showForm])

  // Fetch items from Firebase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true)
        const purchaseRef = ref(database, "itemMaster/purchase")
        const salesRef = ref(database, "itemMaster/sales")

        const [purchaseSnapshot, salesSnapshot] = await Promise.all([
          get(purchaseRef),
          get(salesRef)
        ])

        const purchaseItems = []
        const salesItems = []

        if (purchaseSnapshot.exists()) {
          purchaseSnapshot.forEach((child) => {
            purchaseItems.push({
              id: child.key,
              ...child.val(),
              type: "purchase"
            })
          })
        }

        if (salesSnapshot.exists()) {
          salesSnapshot.forEach((child) => {
            salesItems.push({
              id: child.key,
              ...child.val(),
              type: "sales"
            })
          })
        }

        setItems([...purchaseItems, ...salesItems])
      } catch (error) {
        console.error("Error fetching items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    // Validate HSN Code
    if (formData.hsnCode && (formData.hsnCode.length < 4 || formData.hsnCode.length > 8)) {
      setSubmitError("HSN Code must be between 4 and 8 digits")
      setIsSubmitting(false)
      return
    }

    try {
      // Prepare data
      const itemData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        tax: Number.parseFloat(formData.tax),
        leadTime: Number.parseInt(formData.leadTime),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (editingItem) {
        // Update existing item
        const itemRef = ref(database, `itemMaster/${editingItem.type}/${editingItem.id}`)
        await set(itemRef, {
          ...itemData,
          updatedAt: new Date().toISOString(),
        })
        alert("Item updated successfully!")
      } else {
        // Create new item
        const itemRef = ref(database, `itemMaster/${activeTab}`)
        const newItemRef = push(itemRef)
        await set(newItemRef, itemData)
        alert("Item created successfully!")
      }
      
      // Reset form and close dialog
      resetForm()
      
      // Refresh items list
      window.location.reload()
    } catch (error) {
      console.error("Error saving item:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to save item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      itemName: "",
      description: "",
      itemType: "",
      machineName: "",
      itemCode: "",
      tax: "",
      itemGroup: "",
      uom: "",
      hsnCode: "",
      leadTime: "",
      price: "",
      currency: "",
    })
    setShowForm(false)
    setEditingItem(null)
    setSubmitError(null)
  }

  const handleEdit = (item) => {
    setFormData({
      itemName: item.itemName || "",
      description: item.description || "",
      itemType: item.itemType || "",
      machineName: item.machineName || "",
      itemCode: item.itemCode || "",
      tax: item.tax?.toString() || "",
      itemGroup: item.itemGroup || "",
      uom: item.uom || "",
      hsnCode: item.hsnCode || "",
      leadTime: item.leadTime?.toString() || "",
      price: item.price?.toString() || "",
      currency: item.currency || "",
    })
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = async (item) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const itemRef = ref(database, `itemMaster/${item.type}/${item.id}`)
        await remove(itemRef)
        alert("Item deleted successfully!")
        window.location.reload()
      } catch (error) {
        console.error("Error deleting item:", error)
        alert("Failed to delete item. Please try again.")
      }
    }
  }

  const filteredItems = items.filter(
    (item) =>
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.hsnCode?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Item Master</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items by name, code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={resetForm}
        >
          <div 
            className="bg-card rounded-lg border border-border shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-heading font-semibold text-card-foreground">
                {editingItem ? "Edit Item" : "Add New Item"}
              </h3>
              <button
                onClick={resetForm}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
          
          {/* Purchase/Sales Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("purchase")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "purchase"
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Purchase
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sales")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "sales"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Sales
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {submitError}
              </div>
            )}

            {/* Row 1: Item Name & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.itemName}
                  onChange={(e) => handleInputChange("itemName", e.target.value)}
                  placeholder="Example: Ball Bearing 6000 ZZ"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Example: Ball Bearing Single Row"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Row 2: Item Type & Machine Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Item Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.itemType}
                  onChange={(e) => handleInputChange("itemType", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select item type</option>
                  <option value="capital-goods">Capital Goods</option>
                  <option value="consumables">Consumables</option>
                  <option value="general-item">General Item</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Machine Name <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.machineName}
                  onChange={(e) => handleInputChange("machineName", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select machine</option>
                  <option value="flowrap">Flowrap</option>
                  <option value="packing-machine">Packing Machine</option>
                  <option value="others">Others</option>
                </select>
              </div>
            </div>

            {/* Row 3: Item Code & Tax */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Item Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.itemCode}
                  onChange={(e) => handleInputChange("itemCode", e.target.value)}
                  placeholder="Example: PF0001"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Tax (%) <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.tax}
                  onChange={(e) => handleInputChange("tax", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select tax percentage</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>
            </div>

            {/* Row 4: Item Group & UOM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Item Group <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.itemGroup}
                  onChange={(e) => handleInputChange("itemGroup", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select item group</option>
                  <option value="mechanical">Mechanical</option>
                  <option value="electrical">Electrical</option>
                  <option value="automation">Automation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  UOM <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.uom}
                  onChange={(e) => handleInputChange("uom", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select unit of measurement</option>
                  <option value="nos">Nos</option>
                  <option value="kgs">Kgs</option>
                  <option value="square-meter">Square Meter</option>
                  <option value="meter">Meter</option>
                  <option value="feet">Feet</option>
                  <option value="cubic-feet">Cubic Feet</option>
                  <option value="cubic-meter">Cubic Meter</option>
                </select>
              </div>
            </div>

            {/* Row 5: HSN Code & Lead Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  HSN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.hsnCode}
                  onChange={(e) => {
                    const value = e.target.value
                    // Only allow numbers and limit to 8 digits
                    if (/^\d*$/.test(value) && value.length <= 8) {
                      handleInputChange("hsnCode", value)
                    }
                  }}
                  placeholder="4-8 digit HSN code"
                  minLength={4}
                  maxLength={8}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Lead Time (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.leadTime}
                  onChange={(e) => {
                    const value = e.target.value
                    // Only allow numbers
                    if (/^\d*$/.test(value)) {
                      handleInputChange("leadTime", value)
                    }
                  }}
                  placeholder="Procurement time in days"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Row 6: Price & Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => {
                    const value = e.target.value
                    // Allow numbers and decimal point
                    if (/^\d*\.?\d*$/.test(value)) {
                      handleInputChange("price", value)
                    }
                  }}
                  placeholder="Unit Price"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.currency}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select currency</option>
                  <option value="INR">INR</option>
                  <option value="USD">Dollar</option>
                  <option value="EUR">Euro</option>
                  <option value="AED">AED</option>
                </select>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-center gap-2 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : editingItem ? "Update Item" : "Add Item"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
            </div>
          </div>
        </div>
      )}

      {/* Items Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Item Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Type & Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Price & Tax
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  UOM & HSN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Lead Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Package className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <div className="text-sm font-medium text-card-foreground">{item.itemName || item.itemName}</div>
                        <div className="text-sm text-muted-foreground">{item.itemCode}</div>
                        {item.description && (
                          <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-card-foreground">
                      {item.itemType ? item.itemType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.itemGroup ? item.itemGroup.replace(/\b\w/g, l => l.toUpperCase()) : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-card-foreground">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {item.price ? Number(item.price).toFixed(2) : '-'} {item.currency || ''}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tax: {item.tax ? `${item.tax}%` : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-card-foreground">
                      {item.uom ? item.uom.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : '-'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      HSN: {item.hsnCode || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-card-foreground">
                      {item.leadTime ? `${item.leadTime} days` : '-'}
                    </div>
                    {item.machineName && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {item.machineName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
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
        )}
      </div>

      {!isLoading && filteredItems.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No items found matching your search criteria.</div>
      )}
    </div>
  )
}

export default ItemMaster
