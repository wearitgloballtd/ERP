# Firebase Integration Documentation

## Overview
Both ItemMaster and PartyMaster modules have been integrated with Firebase Realtime Database for persistent data storage with proper table separation.

## Firebase Configuration

### Firebase Credentials
```javascript
// Located in: src/lib/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyBBVWIqTVlhuiSNZtEyBkr_IoeXNDpI1GM",
  authDomain: "erp--profile-automation.firebaseapp.com",
  databaseURL: "https://erp--profile-automation-default-rtdb.firebaseio.com",
  projectId: "erp--profile-automation",
  storageBucket: "erp--profile-automation.firebasestorage.app",
  messagingSenderId: "388570213169",
  appId: "1:388570213169:web:8eacbc8ea2acd2df171e10",
  measurementId: "G-E8D7Q4BV95",
};
```

## Database Structure

### ItemMaster Structure
```
itemMaster/
├── purchase/
│   ├── {auto-generated-id-1}/
│   │   ├── itemName: "Ball Bearing"
│   │   ├── itemCode: "PA/IC/2024-25/00001"
│   │   ├── itemType: "capital-goods"
│   │   ├── machineName: "flowrap"
│   │   ├── tax: 18
│   │   ├── itemGroup: "mechanical"
│   │   ├── uom: "nos"
│   │   ├── hsnCode: "84821000"
│   │   ├── leadTime: 30
│   │   ├── price: 125.50
│   │   ├── currency: "INR"
│   │   ├── description: "Ball Bearing Single Row"
│   │   ├── createdAt: "2024-01-15T10:30:00.000Z"
│   │   └── updatedAt: "2024-01-15T10:30:00.000Z"
│   └── {auto-generated-id-2}/
│       └── ...
└── sales/
    ├── {auto-generated-id-1}/
    │   ├── itemName: "Steel Rod"
    │   ├── itemCode: "PA/IC/2024-25/00002"
    │   └── ...
    └── {auto-generated-id-2}/
        └── ...
```

### PartyMaster Structure
```
partyMaster/
├── supplier/
│   ├── {auto-generated-id-1}/
│   │   ├── partyCode: "PC/PA/00001"
│   │   ├── partyName: "ABC Corporation"
│   │   ├── category: "Manufacturer"
│   │   ├── partyType: "Supplier"
│   │   ├── contactPerson: "John Doe"
│   │   ├── contactNumber: "9876543210"
│   │   ├── email: "john@abc.com"
│   │   ├── website: "https://www.abc.com"
│   │   ├── partyAddress: "123 Industrial Area"
│   │   ├── gstin: "27ABCDE1234F1Z5"
│   │   ├── panNo: "ABCDE1234F"
│   │   ├── cinNo: "L12345AB2000ABC123456"
│   │   ├── msmeId: "UDYAM-MH-01-0001234"
│   │   ├── creditLimit: 500000
│   │   ├── creditPeriod: "30 days"
│   │   ├── status: "Active"
│   │   ├── createdBy: "Admin"
│   │   ├── approvedBy: "Manager"
│   │   ├── createdAt: "2024-01-15T10:30:00.000Z"
│   │   └── updatedAt: "2024-01-15T10:30:00.000Z"
│   └── {auto-generated-id-2}/
│       └── ...
└── buyer/
    ├── {auto-generated-id-1}/
    │   ├── partyCode: "PC/PA/00002"
    │   ├── partyName: "XYZ Enterprises"
    │   └── ...
    └── {auto-generated-id-2}/
        └── ...
```

## Features Implemented

### 1. **Data Separation**
- **ItemMaster**: Separate tables for `purchase` and `sales`
- **PartyMaster**: Separate tables for `supplier` and `buyer`
- Each record includes a `type` field to identify its category

### 2. **CRUD Operations**

#### Create (Add New Record)
```javascript
// ItemMaster - Purchase
const itemRef = ref(database, "itemMaster/purchase")
const newItemRef = push(itemRef)
await set(newItemRef, itemData)

// ItemMaster - Sales
const itemRef = ref(database, "itemMaster/sales")
const newItemRef = push(itemRef)
await set(newItemRef, itemData)

// PartyMaster - Supplier
const partyRef = ref(database, "partyMaster/supplier")
const newPartyRef = push(partyRef)
await set(newPartyRef, partyData)

// PartyMaster - Buyer
const partyRef = ref(database, "partyMaster/buyer")
const newPartyRef = push(partyRef)
await set(newPartyRef, partyData)
```

#### Read (Fetch All Records)
```javascript
// Fetch both purchase and sales items
const purchaseRef = ref(database, "itemMaster/purchase")
const salesRef = ref(database, "itemMaster/sales")

const [purchaseSnapshot, salesSnapshot] = await Promise.all([
  get(purchaseRef),
  get(salesRef)
])

// Fetch both supplier and buyer parties
const supplierRef = ref(database, "partyMaster/supplier")
const buyerRef = ref(database, "partyMaster/buyer")

const [supplierSnapshot, buyerSnapshot] = await Promise.all([
  get(supplierRef),
  get(buyerRef)
])
```

#### Update (Edit Existing Record)
```javascript
// Update item in specific category
const itemRef = ref(database, `itemMaster/${item.type}/${item.id}`)
await set(itemRef, updatedData)

// Update party in specific category
const partyRef = ref(database, `partyMaster/${party.type}/${party.id}`)
await set(partyRef, updatedData)
```

#### Delete (Remove Record)
```javascript
// Delete item from specific category
const itemRef = ref(database, `itemMaster/${item.type}/${item.id}`)
await remove(itemRef)

// Delete party from specific category
const partyRef = ref(database, `partyMaster/${party.type}/${party.id}`)
await remove(partyRef)
```

### 3. **Real-time Features**
- ✅ Automatic data fetching on component mount
- ✅ Loading states during data operations
- ✅ Error handling with user feedback
- ✅ Success/error alerts
- ✅ Auto-refresh after operations

### 4. **Data Validation**
- ✅ Form validation before submission
- ✅ Field-level validation
- ✅ Error messages display
- ✅ Submit button disabled until valid

## Usage Examples

### Adding a New Item (Purchase)
1. Click "Add Item" button
2. Select "Purchase" tab
3. Fill in all required fields
4. Click "Submit"
5. Data is saved to `itemMaster/purchase/{auto-id}`

### Adding a New Item (Sales)
1. Click "Add Item" button
2. Select "Sales" tab
3. Fill in all required fields
4. Click "Submit"
5. Data is saved to `itemMaster/sales/{auto-id}`

### Adding a New Party (Supplier)
1. Click "Add Party" button
2. Select "Supplier" tab
3. Fill in all required fields
4. Click "Submit"
5. Data is saved to `partyMaster/supplier/{auto-id}`

### Adding a New Party (Buyer)
1. Click "Add Party" button
2. Select "Buyer" tab
3. Fill in all required fields
4. Click "Submit"
5. Data is saved to `partyMaster/buyer/{auto-id}`

## Firebase Security Rules

### Recommended Rules
```json
{
  "rules": {
    "itemMaster": {
      ".read": true,
      ".write": true,
      "purchase": {
        ".indexOn": ["itemCode", "itemName"]
      },
      "sales": {
        ".indexOn": ["itemCode", "itemName"]
      }
    },
    "partyMaster": {
      ".read": true,
      ".write": true,
      "supplier": {
        ".indexOn": ["partyCode", "partyName"]
      },
      "buyer": {
        ".indexOn": ["partyCode", "partyName"]
      }
    }
  }
}
```

## Data Flow

### ItemMaster Flow
```
User Action → Form Validation → Firebase Save → Success Alert → Refresh Data
     ↓              ↓                ↓              ↓               ↓
  Add/Edit    Validate Fields   Save to DB    Show Message   Reload List
```

### PartyMaster Flow
```
User Action → Form Validation → Firebase Save → Success Alert → Refresh Data
     ↓              ↓                ↓              ↓               ↓
  Add/Edit    Validate Fields   Save to DB    Show Message   Reload List
```

## Error Handling

### Common Errors and Solutions

1. **Permission Denied**
   - Check Firebase security rules
   - Ensure proper authentication

2. **Network Error**
   - Check internet connection
   - Verify Firebase configuration

3. **Validation Error**
   - Check form validation rules
   - Ensure all required fields are filled

4. **Data Format Error**
   - Verify data types match expected format
   - Check for special characters

## Performance Optimization

### Implemented Optimizations
- ✅ Parallel data fetching for multiple tables
- ✅ Loading states to prevent multiple submissions
- ✅ Efficient data filtering on client side
- ✅ Minimal re-renders with proper state management

### Future Optimizations
- [ ] Implement pagination for large datasets
- [ ] Add caching mechanism
- [ ] Implement offline support
- [ ] Add data compression

## Monitoring and Analytics

### Firebase Analytics
- Track user interactions
- Monitor form submissions
- Track error rates
- Analyze user behavior

### Firebase Performance
- Monitor app performance
- Track slow operations
- Identify bottlenecks

## Backup and Recovery

### Data Backup
- Firebase automatically backs up data
- Manual exports available through Firebase Console
- Regular backups recommended

### Data Recovery
- Restore from Firebase Console
- Import from JSON exports
- Rollback to previous versions

## Testing

### Test Cases
1. ✅ Create new item (Purchase)
2. ✅ Create new item (Sales)
3. ✅ Create new party (Supplier)
4. ✅ Create new party (Buyer)
5. ✅ Edit existing record
6. ✅ Delete record
7. ✅ Search functionality
8. ✅ Form validation
9. ✅ Error handling
10. ✅ Loading states

## Troubleshooting

### Issue: Data not saving
**Solution**: Check Firebase console for errors, verify security rules

### Issue: Data not loading
**Solution**: Check network connection, verify Firebase configuration

### Issue: Form validation failing
**Solution**: Check validation rules, ensure all required fields are filled

### Issue: Delete not working
**Solution**: Verify record exists, check Firebase permissions

## Support and Maintenance

### Regular Maintenance
- Monitor Firebase usage
- Review security rules
- Update validation rules as needed
- Clean up old data

### Support
- Check Firebase Console for errors
- Review application logs
- Test with sample data
- Contact Firebase support if needed

## Future Enhancements
- [ ] Implement real-time sync (listen to changes)
- [ ] Add data export functionality
- [ ] Implement data import from CSV/Excel
- [ ] Add audit trail for data changes
- [ ] Implement soft delete (archive instead of delete)
- [ ] Add data versioning
- [ ] Implement bulk operations
- [ ] Add advanced filtering and sorting

