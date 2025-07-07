# KEW.PA vs KEW.PS Framework Separation

## Overview
The Malaysian government financial management system uses two distinct frameworks for different types of property management:

## KEW.PA (Kewangan Pendaftaran Aset)
**Asset Management Framework**

### Purpose
- Management of fixed assets (capital expenditure items)
- Assets typically valued at RM2,000 and above
- Long-term property that depreciates over time
- Includes buildings, vehicles, equipment, furniture

### Key Forms
- **KEW.PA-1**: Asset Reception from Suppliers
- **KEW.PA-2**: Asset Rejection Documentation
- **KEW.PA-3**: Asset Registration and Tagging
- **KEW.PA-9**: Asset Movement and Transfer
- **KEW.PA-10**: Asset Damage Reports
- **KEW.PA-11**: Asset Inspection Assignment
- **KEW.PA-12**: Asset Inspection Reports
- **KEW.PA-13**: Asset Inspection Certificates
- **KEW.PA-14**: Capital Asset Maintenance (≥RM2,000)
- **KEW.PA-15**: Low-Value Asset Maintenance (<RM2,000)
- **KEW.PA-16**: Annual Maintenance Summary
- **KEW.PA-17**: Asset Transfer Requests
- **KEW.PA-18**: Asset Transfer Records
- **KEW.PA-19**: Technical Assessment for Disposal
- **KEW.PA-20**: Disposal Board Formation
- **KEW.PA-21**: Disposal Recommendations
- **KEW.PA-22**: Disposal Execution
- **KEW.PA-23**: Disposal Verification

### Characteristics
- Asset registration with unique tags
- Depreciation tracking
- Location and custodian management
- Lifecycle tracking (acquisition to disposal)
- Annual inspections and verifications
- Maintenance scheduling and cost tracking

---

## KEW.PS (Kewangan Pengurusan Stor)
**Store Management Framework**

### Purpose
- Management of consumable items and stock
- Items for daily operations and consumption
- Inventory that is issued and depleted
- Includes stationery, fuel, spare parts, medical supplies

### Key Forms
- **KEW.PS-1**: Store Receipt from Suppliers
- **KEW.PS-2**: Stock Rejection to Suppliers
- **KEW.PS-3**: Stock Register/Card (perpetual inventory)
- **KEW.PS-4**: List of Stock Registers
- **KEW.PS-5**: Stock Group Determination (ABC Analysis)
- **KEW.PS-6**: Expired Stock Listing
- **KEW.PS-7**: Inter-Store Stock Requisition
- **KEW.PS-8**: Individual Stock Requisition
- **KEW.PS-9**: Stock Packaging Form
- **KEW.PS-10**: Annual Store Verification
- **KEW.PS-11**: Store Performance Evaluation
- **KEW.PS-12**: Store Verification Certificate
- **KEW.PS-13**: Store Verification Report
- **KEW.PS-15**: Stock Adjustment Form
- **KEW.PS-19**: Disposal Board Appointment
- **KEW.PS-20**: Stock Disposal Execution

### Characteristics
- Quantity-based tracking
- Issue and receipt transactions
- Reorder level management
- Stock categorization (Group A/B)
- Expiry date monitoring
- Perpetual inventory system

---

## Key Differences

| Aspect | KEW.PA (Assets) | KEW.PS (Stores) |
|--------|----------------|-----------------|
| **Purpose** | Fixed asset management | Consumable inventory management |
| **Value** | Typically ≥RM2,000 | Variable, often < RM2,000 |
| **Lifecycle** | Multi-year depreciation | Consumed and replenished |
| **Tracking** | Individual item tagging | Quantity-based batches |
| **Movement** | Transfer between locations | Issue to end users |
| **Verification** | Annual inspections | Annual stock counts |
| **Disposal** | Formal disposal process | Stock write-offs |
| **Documentation** | Asset cards and registers | Stock cards and registers |

---

## System Implementation

### KEW.PA Module Features
- Individual asset registration and tagging
- Custodian assignment and tracking
- Location management
- Maintenance scheduling and cost tracking
- Inspection and verification processes
- Transfer and movement documentation
- Disposal workflow management

### KEW.PS Module Features
- Stock receipt and issuance
- Perpetual inventory tracking
- Reorder level management
- ABC analysis and categorization
- Expiry date monitoring
- Inter-store transfers
- Annual verification and performance evaluation

---

## Compliance Requirements

### KEW.PA Compliance
- All assets must be registered and tagged
- Annual physical inspections required
- Proper authorization for transfers
- Maintenance records must be maintained
- Disposal requires board approval

### KEW.PS Compliance
- All stock movements must be documented
- Perpetual inventory records required
- Regular stock verification
- Proper authorization for issuance
- ABC analysis for stock categorization

---

## User Access and Workflow

### KEW.PA Users
- Asset officers
- Custodians
- Inspection officers
- Maintenance personnel
- Disposal board members

### KEW.PS Users
- Store officers
- Store keepers
- Requisition officers
- Verification officers
- End users (for requisitions)

This separation ensures proper compliance with Malaysian government financial regulations while maintaining clear operational boundaries between asset and store management functions.