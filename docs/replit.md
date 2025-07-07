# KEW.PA/KEW.PS Asset & Store Management System

## Overview

This is a comprehensive Malaysian Government Asset and Store Management System that implements both KEW.PA (Asset Management) and KEW.PS (Store Management) frameworks. The system is designed for government organizations to manage fixed assets and consumable inventory in compliance with Malaysian public sector standards.

## System Architecture

### Frontend Architecture
- **Technology Stack**: React 18 with TypeScript
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme system
- **State Management**: React Query for server state, React Context for UI state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **API Design**: RESTful API endpoints
- **Data Validation**: Zod schemas shared between frontend and backend
- **Connection Pool**: Neon Database serverless connection

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Schema**: TypeScript-first schema definitions in `/shared/schema.ts`
- **Migrations**: Automated database migrations with Drizzle Kit
- **Connection**: Serverless PostgreSQL connection with connection pooling

## Key Components

### 1. KEW.PA Framework (Asset Management)
- **Theme**: Blue color scheme for visual identification
- **Purpose**: Fixed asset lifecycle management for government entities
- **Forms Implemented**:
  - KEW.PA-1, 2, 3: Asset registration and reception
  - KEW.PA-9, 17, 18: Asset movement and transfer
  - KEW.PA-11, 12, 13: Asset inspection processes
  - KEW.PA-14, 15, 16: Asset maintenance management
  - KEW.PA-19-23: Asset disposal procedures

### 2. KEW.PS Framework (Store Management)
- **Theme**: Green color scheme for visual identification
- **Purpose**: Consumable inventory and store operations management
- **Forms Implemented**:
  - KEW.PS-1, 2: Store receipts processing
  - KEW.PS-3, 4, 5: Stock register management
  - KEW.PS-7, 8, 9: Stock issuance procedures
  - KEW.PS-10, 11, 12, 13: Store verification processes

### 3. User Management System
- **Role-Based Access Control**: Four user levels (Admin, Manager, Staff, Visitor)
- **Authentication**: User sessions with role-based permissions
- **Access Levels**:
  - Administrator (Red Badge): Full system access
  - Manager (Blue Badge): Department management
  - Staff (Green Badge): Daily operations
  - Visitor (Gray Badge): Read-only access

### 4. Enhanced Search System
- **Global Search**: Ctrl+K/Cmd+K keyboard shortcut access
- **Fuzzy Matching**: Character-based matching with position scoring
- **Multi-Entity Search**: Assets, inventory, suppliers, movements
- **Real-Time Filtering**: 150ms debounced search with instant results

### 5. Integration Portal (Info-T Aset & iStor)
- **Unified Interface**: Combined system dashboard
- **Cross-System Navigation**: Seamless movement between frameworks
- **Real-Time Synchronization**: Live sync status monitoring
- **QR Code Integration**: Asset scanning and identification

### 6. Enhanced Multi-Unit Support
- **Unit Management**: Hierarchical organization structure
- **Location Tracking**: GPS coordinates and map-based asset tracking
- **Inter-Unit Transfers**: Asset and inventory movement between units
- **QR Code Generation**: Automated QR codes for assets, inventory, locations, and units

### 7. Roadmap Compliance Dashboard
- **Progress Tracking**: Visual progress indicators for all roadmap phases
- **Feature Status**: Real-time tracking of implementation status
- **Phase Analytics**: Detailed breakdown by development phases
- **Compliance Reporting**: Comprehensive reports on system completeness

## Data Flow

### Request Flow
1. **Client Request**: React components make API calls via React Query
2. **API Router**: Express.js routes handle incoming requests
3. **Validation**: Zod schemas validate request data
4. **Database**: Drizzle ORM executes SQL queries on PostgreSQL
5. **Response**: JSON data returned to client with proper error handling

### State Management
1. **Server State**: React Query manages API data with caching
2. **UI State**: React Context for modal states and form data
3. **Form State**: React Hook Form for complex form handling
4. **Global State**: URL-based navigation state with wouter

### Search Flow
1. **Input Capture**: Debounced search input (150ms delay)
2. **Fuzzy Matching**: Character-based scoring algorithm
3. **Multi-Entity Query**: Parallel searches across all data types
4. **Result Ranking**: Score-based result ordering
5. **Navigation**: Direct result navigation with highlighting

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: TypeScript ORM for database operations
- **express**: Web server framework
- **react**: Frontend UI library
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing solution

### UI Dependencies
- **@radix-ui/react-\***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **react-hook-form**: Form state management
- **zod**: TypeScript-first schema validation
- **cmdk**: Command palette component

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database migration management
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR
- **Database**: Local PostgreSQL or cloud PostgreSQL
- **Port Configuration**: Frontend on :5173, Backend on :5000

### Production Deployment
- **Build Process**: Vite builds frontend, esbuild bundles server
- **Static Assets**: Frontend built to `/dist/public`
- **Server Bundle**: Backend bundled to `/dist/index.js`
- **Database**: Production PostgreSQL with connection pooling

### Portable Deployment
- **Self-Contained**: Complete system in `/kewpa-asset-management-portable`
- **Startup Scripts**: Windows (start.bat) and Unix (start.sh) scripts
- **Dependencies**: Bundled Node.js modules with npm install
- **Database**: Configurable PostgreSQL connection string

### Replit Deployment
- **Auto-deployment**: Configured for Replit autoscale deployment
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Port Mapping**: Internal 5000 → External 80

## Changelog

- July 7, 2025. Enhanced roadmap compliance features:
  - Added comprehensive QR code generation utility for assets and inventory tracking
  - Enhanced database schema with multi-unit support (units, locations tables)
  - Added QR code and barcode fields to assets and inventory items
  - Created roadmap compliance analysis dashboard with progress tracking
  - Added maintenance and inspection tracking fields to assets schema
  - Enhanced inventory schema with KEW.PS specific fields and stock level management
  - Added roadmap analysis page with detailed progress visualization
- June 16, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.