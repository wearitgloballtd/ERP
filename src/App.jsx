"use client"

import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import ItemMaster from "./pages/ItemMaster"
import PartyMaster from "./pages/PartyMaster"
import PurchaseIndent from "./pages/PurchaseIndent"
import PurchaseOrder from "./pages/PurchaseOrder"
import JobWorkOrder from "./pages/JobWorkOrder"
import MaterialReceipt from "./pages/MaterialReceipt"
import SalesInvoice from "./pages/SalesInvoice"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="overflow-x-hidden overflow-y-auto bg-background p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/item-master" element={<ItemMaster />} />
          <Route path="/party-master" element={<PartyMaster />} />
          <Route path="/purchase-indent" element={<PurchaseIndent />} />
          <Route path="/purchase-order" element={<PurchaseOrder />} />
          <Route path="/job-work-order" element={<JobWorkOrder />} />
          <Route path="/material-receipt" element={<MaterialReceipt />} />
          <Route path="/sales-invoice" element={<SalesInvoice />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
