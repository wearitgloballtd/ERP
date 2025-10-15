# Party Master Form Updates

## Overview
The Party Master form has been completely updated with a comprehensive set of fields, advanced validations, and a modern modal/popup interface for better user experience.

## Key Changes

### 1. **Comprehensive Form Fields**

#### Basic Information
- **Party Code** (required, auto-generated, read-only)
- **Party Name** (required)
- **Category** (required) - Dropdown with options:
  - Manufacturer
  - Traders
  - Job Work
- **Party Type** (optional) - Text input for Supplier/Customer/Both

#### Contact Information
- **Contact Person** (optional)
- **Contact Number** (required) - 10 digits only
- **Email** (optional) - With email validation
- **Website** (optional)

#### Legal & Registration
- **GSTIN** (optional) - 15 characters, with validation
- **PAN Number** (optional) - 10 characters, uppercase
- **CIN Number** (optional) - Company Identification Number
- **MSME ID** (optional) - MSME registration ID

#### Address & Financial
- **Party Address** (optional) - Textarea for complete address
- **Credit Limit** (optional) - Numeric with decimals
- **Credit Period** (optional) - Text input (e.g., "30 days")

#### Administrative
- **Status** (optional) - Active/Inactive
- **Created By** (optional) - Creator name
- **Approved By** (optional) - Approval person name

### 2. **Supplier/Buyer Tabs**
- Toggle between Supplier and Buyer modes
- Visual indicators (gray for Supplier, green for Buyer)
- Active tab state tracked and included in form submission

### 3. **Advanced Validations**

#### Input Validations
- **Email**: Valid email format validation
- **Contact Number**: Must be exactly 10 digits (numeric only)
- **GSTIN**: 15 characters with specific format validation
- **PAN Number**: 10 characters, uppercase, specific format
- **CIN Number**: Specific format validation
- **MSME ID**: Format validation (UDYAM-XX-XX-XXXXXXX)

#### Real-time Validation
- Field-level validation on input change
- Error messages displayed below each field
- Submit button disabled until all required fields are valid
- Visual feedback with red error text

### 4. **Modal/Popup Dialog**

#### Modal Features
- **Full-screen overlay** with semi-transparent black background
- **Backdrop blur effect** for modern look
- **Centered modal** with max-width for optimal viewing
- **Scrollable content** for long forms (max-height: 90vh)
- **Sticky header** with close button
- **Responsive design** that works on all screen sizes

#### Modal Interactions
- **Click outside to close**: Click anywhere outside the modal
- **Escape key**: Press ESC to close
- **Close button (X)**: Top-right corner
- **Cancel button**: At the bottom
- **Body scroll lock**: Background scrolling disabled when modal is open

### 5. **Enhanced UI/UX**

#### Form Layout
- Responsive 2-3 column grid layout
- Clear visual hierarchy with labels and placeholders
- Required field indicators (red asterisk *)
- Consistent spacing and styling

#### User Feedback
- Loading state during submission ("Saving..." text)
- Success message on successful submission
- Error messages for validation failures
- Disabled state for submit button when form is invalid
- Real-time validation feedback

#### Table Display
- Updated to show new fields
- Improved formatting and readability
- Search across multiple fields

### 6. **Search Functionality**
Enhanced search to include:
- Party Name
- Party Code
- Party Type
- Contact Person
- Category
- Contact Number
- Email
- GSTIN

### 7. **State Management**
- Added new state variables:
  - `activeTab` - Tracks Supplier/Buyer selection
  - `isSubmitting` - Loading state during submission
  - `submitError` - Error message display
  - `formErrors` - Individual field error tracking

### 8. **Form Submission**
- Async/await pattern for API calls
- Comprehensive validation before submission
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
    // ... more validations
  }
  return ""
}
```

### Input Sanitization
- Contact Number: `/^\d{10}$/` - Exactly 10 digits
- Email: Email regex validation
- GSTIN: 15 characters with specific format
- PAN: Uppercase, 10 characters
- CIN: Specific format validation
- MSME ID: UDYAM-XX-XX-XXXXXXX format

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

## Usage

### Adding a New Party
1. Click "Add Party" button
2. Modal popup will open with the form
3. Select Supplier or Buyer tab
4. Fill in all required fields (marked with *)
5. Optional fields can be filled as needed
6. Click "Submit" button
7. Success message will appear and modal will close

**Ways to close the modal:**
- Click the X button in the top-right corner
- Click the Cancel button
- Press the Escape key
- Click outside the modal (on the dark overlay)

### Editing a Party
1. Click the Edit icon on any party row
2. Modal popup will open with the form pre-filled
3. Make changes
4. Click "Update Party"
5. Modal will close automatically

### Deleting a Party
1. Click the Delete icon on any party row
2. Confirm deletion in the dialog
3. Party will be removed from the list

## Validation Rules

### Required Fields
- Party Code (auto-generated)
- Party Name
- Category
- Contact Number

### Optional Fields with Validation
- Email (must be valid email format if provided)
- GSTIN (must be 15 characters with valid format if provided)
- PAN Number (must be 10 characters if provided)
- CIN Number (must match format if provided)
- MSME ID (must match format if provided)

## Future Enhancements
- Firebase integration for persistent storage
- API endpoint integration (`/api/party-master`)
- Auto-generation of party codes based on financial year
- Export functionality (CSV/Excel)
- Bulk import feature
- Advanced filtering options
- Pagination for large datasets
- Document upload for legal documents
- Credit limit tracking and alerts

## Notes
- All form fields are properly validated
- The form opens in a modern modal/popup dialog
- Multiple ways to close the modal (X button, Cancel, Escape key, click outside)
- Background scrolling is locked when modal is open
- The form is responsive and works on mobile devices
- Error messages are user-friendly and specific
- The UI follows the existing design system
- No breaking changes to existing functionality
- Modal has smooth animations and modern styling
- All validations are real-time and provide immediate feedback

