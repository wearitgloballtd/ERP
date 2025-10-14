# Item Master Form Updates

## Overview
The Item Master form has been completely updated with a comprehensive set of fields, validations, and improved UI/UX. The form now opens in a **modal/popup dialog** for a better user experience.

## Key Changes

### 1. **New Form Fields**
The form now includes the following fields (all with proper validation):

#### Basic Information
- **Item Name** (required) - Text input with placeholder
- **Description** (optional) - Text input for additional details
- **Item Code** (required) - Auto-generated or manual entry
- **Item Type** (required) - Dropdown with options:
  - Capital Goods
  - Consumables
  - General Item

#### Machine & Classification
- **Machine Name** (required) - Dropdown with options:
  - Flowrap
  - Packing Machine
  - Others

- **Item Group** (required) - Dropdown with options:
  - Mechanical
  - Electrical
  - Automation

#### Financial Information
- **Tax (%)** (required) - Dropdown with options: 5%, 12%, 18%, 28%
- **Price** (required) - Numeric input with decimal support
- **Currency** (required) - Dropdown with options:
  - INR
  - USD (Dollar)
  - EUR (Euro)
  - AED

#### Inventory Details
- **UOM (Unit of Measurement)** (required) - Dropdown with options:
  - Nos
  - Kgs
  - Square Meter
  - Meter
  - Feet
  - Cubic Feet
  - Cubic Meter

- **HSN Code** (required) - Numeric input (4-8 digits)
- **Lead Time (Days)** (required) - Numeric input for procurement time

### 2. **Purchase/Sales Tabs**
- Added toggle buttons to switch between Purchase and Sales modes
- Visual indicators with different colors (gray for Purchase, green for Sales)
- Active tab state is tracked and included in form submission

### 3. **Validations**

#### Input Validations
- **HSN Code**: Must be between 4-8 digits (numeric only)
- **Lead Time**: Numeric only
- **Price**: Numeric with decimal point support
- **All Required Fields**: Validated before form submission

#### Form Validation
- Real-time validation using `useMemo` hook
- Submit button is disabled until all required fields are filled
- Error messages displayed prominently in red alert box

### 4. **Modal/Popup Dialog**

#### Modal Features
- **Full-screen overlay** with semi-transparent black background
- **Backdrop blur effect** for modern look
- **Centered modal** with max-width for optimal viewing
- **Scrollable content** for long forms (max-height: 90vh)
- **Sticky header** with close button
- **Responsive design** that works on all screen sizes

#### Modal Interactions
- **Click outside to close**: Click anywhere outside the modal to close it
- **Escape key**: Press ESC to close the modal
- **Close button (X)**: Click the X button in the top-right corner
- **Cancel button**: Click the Cancel button at the bottom
- **Body scroll lock**: Background scrolling is disabled when modal is open

#### Modal Styling
- Large shadow for depth (shadow-2xl)
- Rounded corners for modern look
- Border for definition
- Smooth animations and transitions

### 5. **Enhanced UI/UX**

#### Form Layout
- Responsive 2-column grid layout
- Clear visual hierarchy with labels and placeholders
- Required field indicators (red asterisk *)
- Consistent spacing and styling

#### User Feedback
- Loading state during submission ("Saving..." text)
- Success message on successful submission
- Error messages for validation failures
- Disabled state for submit button when form is invalid

#### Table Display
- Updated table columns to show new fields:
  - Item Details (with description)
  - Type & Group
  - Price & Tax (with currency)
  - UOM & HSN Code
  - Lead Time (with machine name)
- Improved formatting and readability

### 6. **Search Functionality**
Enhanced search to include:
- Item Name
- Item Code
- Item Type
- Item Group
- Description
- HSN Code

### 7. **State Management**
- Added new state variables:
  - `activeTab` - Tracks Purchase/Sales selection
  - `isSubmitting` - Loading state during submission
  - `submitError` - Error message display

### 8. **Form Submission**
- Async/await pattern for API calls
- Proper error handling with try-catch
- Success/error feedback to users
- Form reset after successful submission
- API integration ready (commented out for local testing)

## Technical Implementation

### Hooks Used
- `useState` - For managing form data and UI state
- `useMemo` - For optimized form validation
- `useEffect` - For handling Escape key and body scroll lock

### Validation Logic
```javascript
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
  );
}, [formData]);
```

### Input Sanitization
- HSN Code: `/^\d*$/` - Numbers only, max 8 digits
- Lead Time: `/^\d*$/` - Numbers only
- Price: `/^\d*\.?\d*$/` - Numbers with optional decimal

### Modal Implementation
```javascript
// Escape key handler and body scroll lock
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
```

**Modal Structure:**
- Fixed overlay with backdrop blur
- Centered modal with max-width
- Click outside to close (stopPropagation on modal content)
- Sticky header with close button
- Scrollable content area

## Usage

### Adding a New Item
1. Click "Add Item" button
2. Modal popup will open with the form
3. Select Purchase or Sales tab
4. Fill in all required fields (marked with *)
5. Click "Submit" button
6. Success message will appear and modal will close

**Ways to close the modal:**
- Click the X button in the top-right corner
- Click the Cancel button
- Press the Escape key
- Click outside the modal (on the dark overlay)

### Editing an Item
1. Click the Edit icon on any item row
2. Modal popup will open with the form pre-filled
3. Make changes
4. Click "Update Item"
5. Modal will close automatically

### Deleting an Item
1. Click the Delete icon on any item row
2. Confirm deletion in the dialog
3. Item will be removed from the list

## Future Enhancements
- Firebase integration for persistent storage
- API endpoint integration (`/api/item-master`)
- Auto-generation of item codes based on financial year
- Export functionality (CSV/Excel)
- Bulk import feature
- Advanced filtering options
- Pagination for large datasets

## Notes
- All form fields are properly validated
- The form opens in a modern modal/popup dialog
- Multiple ways to close the modal (X button, Cancel, Escape key, click outside)
- Background scrolling is locked when modal is open
- The form is responsive and works on mobile devices
- Error messages are user-friendly
- The UI follows the existing design system
- No breaking changes to existing functionality
- Modal has smooth animations and modern styling

