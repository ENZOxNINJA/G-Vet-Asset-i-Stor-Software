# Admin Control & Visitor Access System
**Complete Role-Based Access Control for KEW.PA/KEW.PS + Info-T Aset & iStor**

## System Overview

The merged platform now includes comprehensive role-based access control with four distinct user levels:

### User Roles & Permissions

#### 1. Administrator (Red Badge)
- **Full System Access**: Complete control over all functions
- **User Management**: Create, modify, and deactivate users
- **System Configuration**: Change security settings and preferences
- **All Framework Access**: KEW.PA, KEW.PS, Info-T Aset, iStor
- **Database Access**: Direct data manipulation and reporting
- **Audit Controls**: View all system logs and activities

#### 2. Manager (Blue Badge)
- **Department Management**: Oversight of departmental assets and inventory
- **Asset Approval**: Approve asset registrations and transfers
- **Team Management**: Manage staff within department
- **Advanced Reporting**: Generate comprehensive compliance reports
- **KEW.PA/KEW.PS Operations**: Full operational access to both frameworks

#### 3. Staff (Green Badge)
- **Daily Operations**: Asset registration and inventory management
- **Form Submission**: Submit KEW.PA and KEW.PS compliance forms
- **Basic Reporting**: Generate standard operational reports
- **Read/Write Access**: Modify data within assigned scope
- **Limited User Functions**: Update own profile only

#### 4. Visitor (Gray Badge)
- **Read-Only Access**: View assets and inventory information
- **Basic Search**: Use global search across all systems
- **Summary Reports**: View high-level statistics and summaries
- **No Modifications**: Cannot create, edit, or delete any data
- **Limited Navigation**: Access to visitor dashboard and basic views

## Access Control Implementation

### Navigation Structure by Role

#### Administrator Access
```
├── Admin Control Panel
│   ├── User Management (Create/Edit/Deactivate)
│   ├── Role Assignment
│   ├── System Configuration
│   └── Analytics Dashboard
├── Full KEW.PA Framework Access
├── Full KEW.PS Framework Access
├── Complete Info-T Integration Portal
└── All Standard Navigation Options
```

#### Manager Access
```
├── Department Dashboard
├── Approval Workflows
├── Team Management
├── Advanced Reporting
├── KEW.PA Framework (Full)
├── KEW.PS Framework (Full)
└── Info-T Integration (Management Level)
```

#### Staff Access
```
├── Standard Dashboard
├── Asset Registration
├── Inventory Management
├── Form Submission
├── KEW.PA Framework (Operational)
├── KEW.PS Framework (Operational)
└── Info-T Integration (Staff Level)
```

#### Visitor Access
```
├── Visitor Dashboard
├── Read-Only Asset View
├── Read-Only Inventory View
├── Basic Search
└── Summary Reports
```

## Admin Control Panel Features

### User Management
- **Create New Users**: Complete user registration with role assignment
- **Edit User Information**: Update profiles, departments, and positions
- **Role Management**: Assign and modify user roles and permissions
- **Status Control**: Activate/deactivate user accounts
- **Permission Levels**: Fine-grained access control

### Security Settings
- **Password Requirements**: Enforce strong password policies
- **Two-Factor Authentication**: Optional 2FA implementation
- **Auto-Logout**: Configurable session timeouts
- **Audit Logging**: Complete activity tracking

### System Configuration
- **Email Notifications**: System-wide notification settings
- **Backup Alerts**: Automated backup monitoring
- **Data Retention**: Configure data archival policies
- **Integration Settings**: Manage cross-system synchronization

## Visitor Dashboard Features

### Read-Only Access
- **Asset Overview**: View all government assets with detailed information
- **Inventory Monitoring**: See store inventory levels and categories
- **Search Capabilities**: Global search across all systems
- **Statistical Reports**: High-level summaries and analytics

### Access Restrictions
- **No Data Modification**: Cannot create, edit, or delete any records
- **Limited Export**: Cannot export detailed reports or data
- **Basic Navigation**: Restricted to visitor-appropriate sections
- **Administrative Barriers**: Clear indicators of access limitations

## Sample User Accounts

The system includes four demonstration accounts:

### Administrator Account
- **Username**: admin
- **Password**: admin123
- **Role**: System Administrator
- **Access**: Full system control

### Manager Account
- **Username**: manager
- **Password**: manager123
- **Role**: Department Manager
- **Access**: Departmental management

### Staff Account
- **Username**: staff
- **Password**: staff123
- **Role**: Asset Staff
- **Access**: Operational functions

### Visitor Account
- **Username**: visitor
- **Password**: visitor123
- **Role**: Guest User
- **Access**: Read-only viewing

## Role-Based Interface Adaptations

### Visual Indicators
- **Color-Coded Badges**: Immediate role identification
- **Access Notices**: Clear indication of permission levels
- **Disabled Functions**: Grayed-out buttons for restricted features
- **Navigation Filtering**: Role-appropriate menu options

### Functional Restrictions
- **API Endpoint Protection**: Server-side permission validation
- **Database Query Filtering**: Role-based data access
- **Form Submission Controls**: Permission-validated actions
- **Export Limitations**: Role-appropriate data export

## Security Implementation

### Authentication
- **Username/Password**: Standard login credentials
- **Session Management**: Secure session handling
- **Role Verification**: Continuous permission checking
- **Activity Logging**: Complete audit trails

### Authorization
- **Endpoint Protection**: API-level access control
- **Database Security**: Row-level security implementation
- **File Access Control**: Resource-based permissions
- **Cross-System Validation**: Unified permission checking

## Integration with Existing Systems

### KEW.PA Framework Integration
- **Role-Based Form Access**: Permission-controlled form submission
- **Approval Workflows**: Manager-level asset approvals
- **Compliance Monitoring**: Role-appropriate compliance access
- **Audit Trail Integration**: User activity in compliance logs

### KEW.PS Framework Integration
- **Store Management Permissions**: Role-based inventory control
- **Transaction Approval**: Manager oversight of store operations
- **Stock Level Monitoring**: Permission-based alert access
- **Compliance Reporting**: Role-appropriate report generation

### Info-T Aset & iStor Integration
- **Asset Information Access**: Role-filtered asset data
- **QR Code Functionality**: Permission-based scanning access
- **Inventory Monitoring**: Role-appropriate stock oversight
- **Cross-System Synchronization**: Permission-validated data sync

## Deployment and Configuration

### Installation
The admin control and visitor access system is included in the complete package:
```bash
tar -xzf KEW-Complete-Admin-Visitor-System-Final.tar.gz
cd kewpa-asset-management-portable/
./start.sh  # Linux/macOS
start.bat   # Windows
```

### Initial Setup
1. **Administrator Login**: Use admin/admin123 for initial setup
2. **User Creation**: Create additional users through Admin Control Panel
3. **Role Assignment**: Assign appropriate roles to users
4. **Security Configuration**: Configure password policies and settings
5. **Department Setup**: Assign users to appropriate departments

### Navigation Access
- **Admin Control**: `/admin-control` (Administrator access only)
- **Visitor Dashboard**: `/visitor-dashboard` (All roles can access)
- **Role Detection**: System automatically adapts interface based on user role
- **Access Validation**: Continuous permission checking throughout session

## Compliance and Audit

### Government Standards
- **KEW.PA Compliance**: Role-based access to asset management forms
- **KEW.PS Compliance**: Permission-controlled store management
- **Audit Requirements**: Complete user activity logging
- **Data Security**: Role-based data protection

### Reporting
- **User Activity Reports**: Track all user actions
- **Permission Audit**: Monitor role assignments and changes
- **Access Logs**: Complete login and activity logging
- **Compliance Reports**: Government-required audit documentation

This role-based access control system ensures that the merged KEW.PA/KEW.PS + Info-T Aset & iStor platform maintains appropriate security while providing flexible access levels for different user types within Malaysian government organizations.