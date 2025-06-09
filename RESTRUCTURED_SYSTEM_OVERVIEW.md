# Restructured KEW.PA & KEW.PS Management System

## System Architecture Overview

The system has been completely restructured to provide clear separation between KEW.PA (Asset Management) and KEW.PS (Store Management) frameworks with dedicated dashboards and streamlined navigation.

## Framework Structure

### KEW.PA Framework - Asset Management
**Route**: `/kewpa` (Dashboard) + individual modules

**Purpose**: Fixed asset lifecycle management for government entities
- Asset registration and tagging
- Depreciation tracking
- Maintenance scheduling
- Inspection processes
- Movement documentation
- Disposal procedures

**Available Modules**:
1. **KEW.PA Dashboard** (`/kewpa`) - Comprehensive overview and analytics
2. **Asset Registration** (`/asset-registration-kewpa`) - KEW.PA-1, 2, 3 forms
3. **Asset Inspection** (`/asset-inspection`) - KEW.PA-11, 12, 13 processes
4. **Asset Maintenance** (`/asset-maintenance`) - KEW.PA-14, 15, 16 management
5. **Asset Verification** (`/asset-verification`) - Verification workflows
6. **Asset Movement** (`/asset-movement`) - KEW.PA-9, 17, 18 transfers
7. **Asset Search** (`/asset-search`) - Reports and analytics

### KEW.PS Framework - Store Management
**Route**: `/kewps` (Dashboard) + store operations

**Purpose**: Consumable inventory and store operations management
- Stock receipt and issuance
- Perpetual inventory tracking
- Reorder level management
- Store verification processes
- Transaction documentation

**Available Modules**:
1. **KEW.PS Dashboard** (`/kewps`) - Store performance and analytics
2. **Store Operations** (`/store-management-kewps`) - Complete KEW.PS system
   - Store Receipts (KEW.PS-1, 2)
   - Stock Register (KEW.PS-3, 4, 5)
   - Stock Issuance (KEW.PS-7, 8, 9)
   - Store Verification (KEW.PS-10, 11, 12, 13)

## Navigation Structure

### General System
- Dashboard (Main overview)
- Basic Inventory (Non-framework inventory)
- Basic Assets (Non-framework assets)
- Suppliers (Shared across frameworks)

### KEW.PA Framework Section
- Clearly labeled with blue badges
- Asset-focused terminology
- Individual module access
- Compliance tracking

### KEW.PS Framework Section
- Clearly labeled with green badges
- Store-focused terminology
- Consolidated operations
- Performance metrics

## Key Improvements

### 1. Clear Framework Separation
- Distinct visual identification
- Separate dashboards for each framework
- Framework-specific terminology and processes
- Independent compliance tracking

### 2. Streamlined Navigation
- Hierarchical organization
- Color-coded sections
- Descriptive subtitles for each module
- Framework badges for instant identification

### 3. Dedicated Dashboards
- **KEW.PA Dashboard**: Asset portfolio overview, inspection status, maintenance tracking
- **KEW.PS Dashboard**: Store performance, stock health, transaction monitoring

### 4. Improved User Experience
- Single entry point for each framework
- Contextual navigation based on framework
- Consistent design patterns
- Mobile-responsive interface

## Compliance Features

### KEW.PA Compliance
- Complete asset lifecycle tracking
- Mandatory inspection scheduling
- Maintenance cost management
- Transfer authorization workflows
- Disposal board processes

### KEW.PS Compliance
- Perpetual inventory management
- Transaction documentation
- Annual verification processes
- Stock categorization (ABC analysis)
- Reorder level optimization

## Technical Architecture

### Database Structure
- Separated tables for KEW.PA and KEW.PS processes
- Proper relationships and constraints
- Audit trails for all transactions
- Compliance field validation

### API Organization
- Framework-specific endpoints
- Consistent error handling
- Input validation using Zod schemas
- Proper HTTP status codes

### Frontend Architecture
- Component separation by framework
- Shared UI components
- Consistent styling and theming
- Responsive design patterns

## Deployment Options

### Standalone Package
- Complete self-contained system
- No external dependencies
- Works offline after setup
- Cross-platform compatibility

### Cloud Deployment
- Ready for Replit deployment
- Environment variable configuration
- Scalable architecture
- Real-time collaboration support

## User Roles and Permissions

### KEW.PA Users
- Asset officers
- Inspection personnel
- Maintenance coordinators
- Custodians
- Disposal board members

### KEW.PS Users
- Store officers
- Store keepers
- Requisition processors
- Verification officers
- End users (for requests)

## Future Enhancements

### Integration Capabilities
- Cross-framework reporting
- Shared supplier management
- Unified compliance dashboard
- Inter-system data flow

### Advanced Features
- Automated workflow triggers
- Email notifications
- Mobile applications
- Advanced analytics and BI

This restructured system provides a comprehensive, compliant, and user-friendly solution for Malaysian government asset and store management requirements.