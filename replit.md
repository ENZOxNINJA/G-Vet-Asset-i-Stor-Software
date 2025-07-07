# KEW.PA/KEW.PS Asset & Store Management System

## Overview

This is a comprehensive Malaysian Government Asset and Store Management System that implements both KEW.PA (Asset Management) and KEW.PS (Store Management) frameworks. The system is designed for government organizations to ensure compliance with Malaysian public sector financial regulations while providing modern web-based management capabilities.

## System Architecture

### Frontend Architecture
- **Technology Stack**: React 18 with TypeScript for type safety
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme system supporting dual-color schemes (Blue for KEW.PA, Green for KEW.PS)
- **State Management**: React Query for server state management, React Context for UI state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful API endpoints with consistent error handling
- **Data Validation**: Zod schemas shared between frontend and backend
- **Connection Management**: Neon Database serverless connection with pooling
- **Authentication**: Role-based access control with four user levels (Admin, Manager, Staff, Visitor)

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL adapter for type-safe queries
- **Schema**: TypeScript-first schema definitions in `/shared/schema.ts`
- **Migrations**: Automated database migrations with Drizzle Kit
- **Multi-tenancy**: Support for multiple units and locations
- **Compliance**: Schema designed to meet KEW.PA and KEW.PS requirements

## Key Components

### 1. KEW.PA Framework (Asset Management)
- **Theme**: Blue color scheme for visual identification
- **Purpose**: Fixed asset lifecycle management for government entities
- **Asset Classification**: Supports both Capital Assets (≥RM2,000) and Low-Value Assets (<RM2,000)
- **Forms Implemented**:
  - KEW.PA-1, 2, 3: Asset registration and reception
  - KEW.PA-9, 17, 18: Asset movement and transfer
  - KEW.PA-11, 12, 13: Asset inspection processes
  - KEW.PA-14, 15, 16: Asset maintenance management
  - KEW.PA-19-23: Asset disposal procedures

### 2. KEW.PS Framework (Store Management)
- **Theme**: Green color scheme for visual identification
- **Purpose**: Consumable inventory and store operations management
- **Stock Management**: Perpetual inventory tracking with reorder levels
- **Forms Implemented**:
  - KEW.PS-1, 2: Store receipts processing
  - KEW.PS-3, 4, 5: Stock register management
  - KEW.PS-7, 8, 9: Stock issuance procedures
  - KEW.PS-10, 11, 12, 13: Store verification processes

### 3. Info-T Aset & iStor Integration
- **Integration Portal**: Unified interface combining all four systems
- **QR Code Support**: Asset tracking with QR code generation and scanning
- **Real-time Sync**: Cross-system data synchronization monitoring
- **Compliance Bridge**: Automatic form generation between systems

### 4. Enhanced Search System
- **Global Search**: Keyboard shortcut access (Ctrl+K/Cmd+K)
- **Fuzzy Matching**: Intelligent search with partial term matching
- **Multi-Entity Search**: Covers assets, inventory, suppliers, movements
- **Real-time Filtering**: 150ms debounced search for optimal performance

## Data Flow

### Asset Management Flow (KEW.PA)
1. **Asset Reception**: KEW.PA-1 form processing with supplier verification
2. **Asset Registration**: KEW.PA-3 form with unique asset tagging
3. **Asset Inspection**: KEW.PA-11-13 inspection workflow
4. **Asset Maintenance**: KEW.PA-14-16 maintenance scheduling and tracking
5. **Asset Movement**: KEW.PA-9, 17-18 transfer and movement documentation
6. **Asset Disposal**: KEW.PA-19-23 disposal workflow with board approval

### Store Management Flow (KEW.PS)
1. **Store Receipt**: KEW.PS-1-2 receiving process
2. **Stock Registration**: KEW.PS-3-5 inventory recording
3. **Stock Issuance**: KEW.PS-7-9 distribution management
4. **Store Verification**: KEW.PS-10-13 audit and verification

### User Authentication Flow
1. **Login**: Username/password authentication
2. **Role Assignment**: Admin, Manager, Staff, or Visitor privileges
3. **Permission Validation**: Route and action-based access control
4. **Session Management**: Secure session handling with timeout

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **@radix-ui/react-***: Accessible UI component primitives
- **@tanstack/react-query**: Server state management
- **drizzle-orm**: Type-safe database operations
- **react-hook-form**: Form handling with validation
- **zod**: Schema validation
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing

### Development Dependencies
- **@types/node**: Node.js type definitions
- **typescript**: Type checking
- **vite**: Build tool and development server
- **@vercel/ncc**: Code compilation for executables
- **pkg**: Executable generation

### Malaysian Government Compliance
- **KEW.PA Standards**: Asset management compliance
- **KEW.PS Standards**: Store management compliance
- **Perbendaharaan Malaysia**: Treasury guidelines adherence

## Deployment Strategy

### Development Deployment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: PostgreSQL with Drizzle migrations
- **Environment**: NODE_ENV=development with debug logging

### Production Deployment
- **Build Process**: Vite build + esbuild server bundling
- **Executable Generation**: Cross-platform executables using pkg
- **Portable Version**: Self-contained deployment package
- **Database**: PostgreSQL with connection pooling

### Portable Deployment
- **Standalone Package**: Complete system in portable directory
- **Cross-platform**: Windows, macOS, and Linux support
- **No Dependencies**: Bundled with all required modules
- **Quick Setup**: Automated startup scripts

## Changelog
- July 07, 2025. Initial setup
- July 07, 2025. Major restructuring and design refinement:
  - Created organized folder structure (docs/, archives/, component subdirectories)
  - Implemented modern design system with enhanced CSS framework
  - Created new modern components: ModernLayout, ModernCard, ModernButton, ModernTable, ModernHeader, ModernBadge
  - Restructured client/src with organized folders: layout/, shared/, tables/, forms/, kewpa/, kewps/
  - Enhanced visual design with gradient effects, glass morphism, and modern UI patterns
  - Implemented comprehensive color palette and spacing system
  - Added responsive utilities and animations
  - Updated routing to use ModernDashboard as default
  - Reorganized imports and file structure for better maintainability

## User Preferences

Preferred communication style: Simple, everyday language.