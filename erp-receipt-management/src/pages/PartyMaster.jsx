"use client"

import { useState, useMemo, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Users, Phone, Mail, MapPin, Building } from "lucide-react"
import { ref, push, set, get, remove } from "firebase/database"
import { database } from "@/lib/firebase"

const PartyMaster = () => {
  const [parties, setParties] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingParty, setEditingParty] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("buyer")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    partyCode: "",
    partyName: "",
    category: "",
    partyType: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    website: "",
    partyAddress: "",
    gstin: "",
    panNo: "",
    cinNo: "",
    msmeId: "",
    creditLimit: "",
    creditPeriod: "",
    createdBy: "",
    approvedBy: "",
    status: "Active",
  })

  const partyTypes = ["Supplier", "Customer", "Both"]
  
  // Regex patterns for validation
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i
  const cinRegex = /^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/i
  const msmeRegex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/i

  const validateField = (field, value) => {
    switch (field) {
      case "category":
        if (!value) return "Category is required."
        break
      case "contactNumber":
        if (!/^\d{10}$/.test(value)) return "Contact number must be 10 digits."
        break
      case "email":
        if (value && !emailRegex.test(value)) return "Invalid email address."
        break
      case "gstin":
        if (value && !gstinRegex.test(value)) return "Invalid GSTIN."
        break
      case "panNo":
        if (value && !panRegex.test(value)) return "Invalid PAN number."
        break
      case "cinNo":
        if (value && !cinRegex.test(value)) return "Invalid CIN number."
        break
      case "msmeId":
        if (value && !msmeRegex.test(value)) return "Invalid MSME ID."
        break
      default:
        return ""
    }
    return ""
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }))
  }

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    return (
      formData.partyCode.trim() !== "" &&
      formData.partyName.trim() !== "" &&
      formData.category.trim() !== "" &&
      formData.contactNumber.trim() !== "" &&
      Object.keys(formErrors).every((key) => !formErrors[key])
    )
  }, [formData.partyCode, formData.partyName, formData.category, formData.contactNumber, formErrors])

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

  // Fetch parties from Firebase
  useEffect(() => {
    const fetchParties = async () => {
      try {
        setIsLoading(true)
        const supplierRef = ref(database, "partyMaster/supplier")
        const buyerRef = ref(database, "partyMaster/buyer")

        const [supplierSnapshot, buyerSnapshot] = await Promise.all([
          get(supplierRef),
          get(buyerRef)
        ])

        const supplierParties = []
        const buyerParties = []

        if (supplierSnapshot.exists()) {
          supplierSnapshot.forEach((child) => {
            supplierParties.push({
              id: child.key,
              ...child.val(),
              type: "supplier"
            })
          })
        }

        if (buyerSnapshot.exists()) {
          buyerSnapshot.forEach((child) => {
            buyerParties.push({
              id: child.key,
              ...child.val(),
              type: "buyer"
            })
          })
        }

        setParties([...supplierParties, ...buyerParties])
      } catch (error) {
        console.error("Error fetching parties:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchParties()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    // Validate all fields before submit
    const newErrors = {}
    const fieldsToValidate = ["category", "contactNumber", "email", "gstin", "panNo", "cinNo", "msmeId"]
    
    fieldsToValidate.forEach((field) => {
      const err = validateField(field, formData[field])
      if (err) newErrors[field] = err
    })
    
    setFormErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      setIsSubmitting(false)
      setSubmitError("Please fix the errors in the form.")
      return
    }

    try {
      // Prepare data
      const partyData = {
        ...formData,
        creditLimit: formData.creditLimit ? Number.parseFloat(formData.creditLimit) : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (editingParty) {
        // Update existing party
        const partyRef = ref(database, `partyMaster/${editingParty.type}/${editingParty.id}`)
        await set(partyRef, {
          ...partyData,
          updatedAt: new Date().toISOString(),
        })
        alert("Party updated successfully!")
      } else {
        // Create new party
        const partyRef = ref(database, `partyMaster/${activeTab}`)
        const newPartyRef = push(partyRef)
        await set(newPartyRef, partyData)
        alert("Party created successfully!")
      }
      
      // Reset form and close dialog
      resetForm()
      
      // Refresh parties list
      window.location.reload()
    } catch (error) {
      console.error("Error saving party:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to save party. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      partyCode: "",
      partyName: "",
      category: "",
      partyType: "",
      contactPerson: "",
      contactNumber: "",
      email: "",
      website: "",
      partyAddress: "",
      gstin: "",
      panNo: "",
      cinNo: "",
      msmeId: "",
      creditLimit: "",
      creditPeriod: "",
      createdBy: "",
      approvedBy: "",
      status: "Active",
    })
    setShowForm(false)
    setEditingParty(null)
    setSubmitError(null)
    setFormErrors({})
  }

  const handleEdit = (party) => {
    setFormData({
      partyCode: party.partyCode || "",
      partyName: party.partyName || "",
      category: party.category || "",
      partyType: party.partyType || "",
      contactPerson: party.contactPerson || "",
      contactNumber: party.contactNumber || party.phone || "",
      email: party.email || "",
      website: party.website || "",
      partyAddress: party.partyAddress || party.address || "",
      gstin: party.gstin || party.gstNumber || "",
      panNo: party.panNo || "",
      cinNo: party.cinNo || "",
      msmeId: party.msmeId || "",
      creditLimit: party.creditLimit?.toString() || "",
      creditPeriod: party.creditPeriod || "",
      createdBy: party.createdBy || "",
      approvedBy: party.approvedBy || "",
      status: party.status || "Active",
    })
    setEditingParty(party)
    setShowForm(true)
  }

  const handleDelete = async (party) => {
    if (window.confirm("Are you sure you want to delete this party?")) {
      try {
        const partyRef = ref(database, `partyMaster/${party.type}/${party.id}`)
        await remove(partyRef)
        alert("Party deleted successfully!")
        window.location.reload()
      } catch (error) {
        console.error("Error deleting party:", error)
        alert("Failed to delete party. Please try again.")
      }
    }
  }

  const filteredParties = parties.filter(
    (party) =>
      party.partyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.partyCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.partyType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.contactNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      party.gstin?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-foreground">Party Master</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Party
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search parties by name, code, type, or contact person..."
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
                {editingParty ? "Edit Party" : "Add New Party"}
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
          
          {/* Supplier/Buyer Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab("supplier")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "supplier"
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Supplier
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("buyer")}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === "buyer"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              Buyer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {submitError}
              </div>
            )}
            {/* Row 1: Party Code & Party Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Party Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.partyCode}
                  onChange={(e) => handleInputChange("partyCode", e.target.value)}
                  placeholder="Example: PC001"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Party Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.partyName}
                  onChange={(e) => handleInputChange("partyName", e.target.value)}
                  placeholder="Example: ABC Corporation"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Row 2: Category & Party Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select Category</option>
                  <option value="Manufacturer">Manufacturer</option>
                  <option value="Traders">Traders</option>
                  <option value="Job Work">Job Work</option>
                </select>
                {formErrors.category && (
                  <div className="text-red-600 text-sm mt-1">{formErrors.category}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Party Type</label>
                <input
                  type="text"
                  value={formData.partyType}
                  onChange={(e) => handleInputChange("partyType", e.target.value)}
                  placeholder="Supplier / Customer / Both"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Row 3: Contact Person & Contact Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Contact Person</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                  placeholder="Contact person name"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/[^\d]/g, "")
                    handleInputChange("contactNumber", onlyNums)
                  }}
                  placeholder="10 digit mobile number"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  maxLength={10}
                />
                {formErrors.contactNumber && (
                  <div className="text-red-600 text-sm mt-1">{formErrors.contactNumber}</div>
                )}
              </div>
            </div>

            {/* Row 4: Email & Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {formErrors.email && (
                  <div className="text-red-600 text-sm mt-1">{formErrors.email}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://www.example.com"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Row 5: GSTIN & PAN Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">GSTIN</label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => handleInputChange("gstin", e.target.value.slice(0, 15))}
                  placeholder="GSTIN"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  maxLength={15}
                />
                {formErrors.gstin && (
                  <div className="text-red-600 text-sm mt-1">{formErrors.gstin}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">PAN Number</label>
                <input
                  type="text"
                  value={formData.panNo}
                  onChange={(e) => handleInputChange("panNo", e.target.value.toUpperCase().slice(0, 10))}
                  placeholder="PAN"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  maxLength={10}
                />
                {formErrors.panNo && (
                  <div className="text-red-600 text-sm mt-1">{formErrors.panNo}</div>
                )}
              </div>
            </div>

            {/* Row 6: Party Address */}
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">Party Address</label>
              <textarea
                value={formData.partyAddress}
                onChange={(e) => handleInputChange("partyAddress", e.target.value)}
                placeholder="Complete address"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
              />
            </div>

            {/* Row 7: CIN Number & MSME ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">CIN Number</label>
                <input
                  type="text"
                  value={formData.cinNo}
                  onChange={(e) => handleInputChange("cinNo", e.target.value)}
                  placeholder="CIN"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {formErrors.cinNo && (
                  <div className="text-red-600 text-sm mt-1">{formErrors.cinNo}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">MSME ID</label>
                <input
                  type="text"
                  value={formData.msmeId}
                  onChange={(e) => handleInputChange("msmeId", e.target.value)}
                  placeholder="MSME ID"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {formErrors.msmeId && (
                  <div className="text-red-600 text-sm mt-1">{formErrors.msmeId}</div>
                )}
              </div>
            </div>

            {/* Row 8: Credit Limit & Credit Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Credit Limit</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.creditLimit}
                  onChange={(e) => handleInputChange("creditLimit", e.target.value)}
                  placeholder="Credit limit amount"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Credit Period</label>
                <input
                  type="text"
                  value={formData.creditPeriod}
                  onChange={(e) => handleInputChange("creditPeriod", e.target.value)}
                  placeholder="Example: 30 days"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Row 9: Status, Created By & Approved By */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Status</label>
                <input
                  type="text"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  placeholder="Active / Inactive"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Created By</label>
                <input
                  type="text"
                  value={formData.createdBy}
                  onChange={(e) => handleInputChange("createdBy", e.target.value)}
                  placeholder="Creator name"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-1">Approved By</label>
                <input
                  type="text"
                  value={formData.approvedBy}
                  onChange={(e) => handleInputChange("approvedBy", e.target.value)}
                  placeholder="Approval Person name"
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-center gap-2 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : editingParty ? "Update Party" : "Add Party"}
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

      {/* Parties Table */}
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
                  Party Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Credit Limit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredParties.map((party) => (
                <tr key={party.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Building className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <div className="text-sm font-medium text-card-foreground">{party.partyName}</div>
                        <div className="text-sm text-muted-foreground">{party.partyCode}</div>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                            party.partyType === "Supplier"
                              ? "bg-accent text-accent-foreground"
                              : party.partyType === "Customer"
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {party.partyType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-card-foreground">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        {party.contactPerson}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 mr-2" />
                        {party.phone}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        {party.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start text-sm text-card-foreground">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                      <div className="max-w-xs">
                        {party.address}
                        {party.gstNumber && (
                          <div className="text-xs text-muted-foreground mt-1">GST: {party.gstNumber}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-card-foreground">
                      ₹{party.creditLimit.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        party.status === "Active"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {party.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(party)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(party)}
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

      {!isLoading && filteredParties.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No parties found matching your search criteria.</div>
      )}
    </div>
  )
}

export default PartyMaster
