# Architecture Documentation

## Overview

This repository contains an Inventory Management System built as a full-stack web application. The system allows users to manage inventory items with features including item creation, editing, deletion, filtering, and searching. The application follows a modern client-server architecture with a clear separation between frontend and backend components.

## System Architecture

The application follows a 3-tier architecture:

1. **Frontend**: React-based single-page application (SPA) with UI components built using shadcn/ui and styled with Tailwind CSS
2. **Backend**: Express.js server providing RESTful API endpoints
3. **Database**: PostgreSQL database accessed through Drizzle ORM

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│   Frontend  │────▶│   Backend   │────▶│  Database   │
│  (React SPA)│     │ (Express.js)│     │ (PostgreSQL)│
│             │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Key Architectural Decisions

1. **Monorepo Structure**: The project uses a monorepo approach, containing both frontend and backend code in a single repository, which simplifies development, testing, and deployment.

2. **TypeScript**: Used throughout the application for type safety and improved developer experience.

3. **Shared Types**: Database schema definitions are shared between frontend and backend (`shared/schema.ts`), ensuring type consistency across the stack.

4. **Modern UI Framework**: Uses React with shadcn/ui components built on Radix UI primitives for accessible, customizable UI elements.

5. **API-First Development**: Clean separation between client and server with a well-defined REST API.

6. **Data Validation**: Zod is used for validation at both frontend and backend layers.

## Key Components

### Frontend

- **Technology Stack**: React, TypeScript, Tailwind CSS
- **State Management**: React Query for server state, React Context for UI state
- **Routing**: Uses wouter for lightweight client-side routing
- **UI Framework**: shadcn/ui (based on Radix UI) for accessible, themeable components

The frontend is organized into:

- **Components**: Reusable UI components (both custom and from shadcn/ui)
- **Pages**: Page-level components corresponding to different routes
- **Contexts**: React Context for state management (e.g., InventoryContext)
- **Hooks**: Custom React hooks for shared logic
- **Lib**: Utility functions and shared code

### Backend

- **Technology Stack**: Express.js, TypeScript
- **API Layer**: RESTful API endpoints for CRUD operations
- **Data Access Layer**: Storage abstraction (currently implemented with in-memory storage)
- **Validation**: Request validation using Zod schemas

The backend is organized into:

- **Routes**: API endpoint definitions
- **Storage**: Data access layer with pluggable implementations
- **Vite Integration**: Setup for serving the frontend application

### Database Schema

The application uses Drizzle ORM with PostgreSQL. The database schema includes:

1. **Users Table**:
   - `id`: Serial primary key
   - `username`: Unique text field
   - `password`: Text field for storing passwords

2. **Inventory Items Table**:
   - `id`: Serial primary key
   - `name`: Item name
   - `sku`: Unique stock keeping unit
   - `description`: Optional item description
   - `category`: Category classification
   - `price`: Decimal price
   - `quantity`: Current stock level
   - `reorderLevel`: Threshold for reordering
   - `status`: Item status (active, etc.)
   - `createdAt`, `updatedAt`: Timestamps

## Data Flow

### Inventory Management Flow

1. **Item Listing**:
   - Frontend makes a GET request to `/api/inventory`
   - Backend retrieves items from storage
   - Frontend displays items in the InventoryTable component
   - User can search, filter, and paginate through items

2. **Item Creation/Update**:
   - User fills out the ItemFormModal component
   - Form validation occurs using Zod schemas
   - POST/PUT request is sent to `/api/inventory` or `/api/inventory/:id`
   - Backend validates the request and updates storage
   - UI is updated via React Query cache invalidation

3. **Item Deletion**:
   - User initiates deletion via DeleteConfirmationModal
   - DELETE request is sent to `/api/inventory/:id`
   - Backend removes the item from storage
   - UI is updated via React Query cache invalidation

## External Dependencies

### Frontend Dependencies

- **@tanstack/react-query**: For data fetching, caching, and state management
- **@radix-ui/***: UI primitive components
- **wouter**: Lightweight routing library
- **zod**: Schema validation
- **clsx/tailwind-merge**: Utility-first CSS tools
- **react-hook-form**: Form handling

### Backend Dependencies

- **express**: Web server framework
- **drizzle-orm**: ORM for database interactions
- **zod**: Schema validation for API requests
- **@neondatabase/serverless**: Connection to Neon PostgreSQL

## Deployment Strategy

The application is configured for deployment on Replit with automatic scaling:

1. **Build Process**:
   - Frontend: Vite builds the React application
   - Backend: esbuild compiles TypeScript server code
   - Combined artifacts are placed in the `dist` directory

2. **Development Environment**:
   - `npm run dev` starts a development server with hot reloading

3. **Production Deployment**:
   - `npm run build` creates production bundles
   - `npm run start` serves the application with Node.js in production mode

4. **Database Migrations**:
   - Managed via Drizzle Kit with `npm run db:push`

5. **Environment Configuration**:
   - `DATABASE_URL` must be provided for database connection

The `.replit` configuration specifies deployment settings for the Replit platform, including port forwarding and autoscaling.

## Security Considerations

1. **Data Validation**: Input validation using Zod schemas at both frontend and backend
2. **Error Handling**: Structured error responses and client-side error handling
3. **Future Enhancements**: Authentication system is partially implemented but needs completion

## Future Architecture Considerations

1. **Authentication Implementation**: Complete the user authentication system
2. **Database Migration**: Move from in-memory storage to persistent PostgreSQL
3. **Test Coverage**: Add comprehensive testing
4. **Performance Optimization**: Implement caching strategies for inventory data