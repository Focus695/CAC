# Admin Backend System Implementation Plan

## Overview

This plan outlines the implementation of an admin backend system for the existing e-commerce project. The system will include user management, product management, and order management with the specified features and design principles.

**Implementation Status: All features completed successfully!**

## Phase 1: Backend Modifications

### 1.1 Database Schema Updates

#### Product Model

* **Multilingual Support** : Add Chinese and English fields for all text information
* name_zh: String (Chinese product name)
* name_en: String (English product name) -雅物描述 (Elegant Description): elegantDesc_zh, elegantDesc_en -养生功效 (Health Benefits): healthBenefits_zh, healthBenefits_en -匠心工艺 (Artisanal Craftsmanship): craftsmanship_zh, craftsmanship_en
* category remains as before
* **Pricing & Inventory** : currentPrice (Decimal), originalPrice (Decimal), stock (Int) – already exists but needs to be properly used
* **Image Management** : Separate into main image and detail images with sorting capability
* mainImage: String (single main image for list display)
* detailImages: String[] (up to 10 detail images, order preserved)
* **Status** : isActive (Boolean) – already exists, used for quick product activation/deactivation

#### Order Model

* Add `trackingNumber` field: String (for shipping tracking number)
* **Status Workflow** : Use existing OrderStatus enum but map to user requirements
* User pays → status = CONFIRMED (未发货)
* Admin ships → status = SHIPPED (已发货), requires tracking number
* Admin marks delivered → status = DELIVERED (已收货)

### 1.2 Service Layer Updates

#### Products Service

* **CRUD Operations** : Complete with full multilingual support for all fields
* **Status Management** : Implement `toggleProductStatus(id)` method for quick activation/deactivation
* **Image Handling** : Implement image upload functionality with validation (file type, size)
* Main image: single file upload (max 5MB)
* Detail images: up to 10 files (max 2MB each), preserve upload order or allow manual sorting
* **Search** : Add name-based search (supports both Chinese and English)
* **Category Filtering** : Allow filtering products by category

#### Orders Service

* **Order Workflow** : Implement `shipOrder(orderId, trackingNumber)` to set tracking number and status = SHIPPED
* **Status Management** : Implement `markOrderDelivered(orderId)` to set status = DELIVERED
* **Search & Filter** : Add search by userId or email
* **Order Querying** : Allow filtering orders by status (未发货, 已发货, 已收货)

#### Users Service

* **User Management** : Extend with admin-only methods to list, update, and delete users
* **Role Management** : Allow updating user roles (admin, customer)
* **Status Management** : Implement user status (active/inactive) toggle

### 1.3 API Routes

* **Base URL** : /api/admin
* **Authentication** : Use JWT with admin role check
* **Endpoints** :
* **User Management** :
  * GET /users: List all users with search/filter
  * PUT /users/🆔 Update user (role, status)
  * DELETE /users/🆔 Delete user
* **Product Management** :
  * GET /products: List all products with category filter, name search, and status filter
  * POST /products: Create new product with multilingual data and images
  * PUT /products/🆔 Update product
  * DELETE /products/🆔 Delete product
  * PATCH /products/:id/status: Toggle product status
* **Order Management** :
  * GET /orders: List all orders with status filter and search
  * GET /orders/🆔 Get order details
  * PUT /orders/:id/ship: Mark order as shipped with tracking number
  * PUT /orders/:id/deliver: Mark order as delivered

## Phase 2: Frontend Implementation

### 2.1 Admin Interface Layout

* **Left Navigation** : Collapsible menu with icons and text for:
* Dashboard (quick stats overview)
* User Management
* Product Management
* Order Management
* **Top Bar** : Breadcrumb navigation showing current page path and user profile dropdown
* **Main Workspace** : Card-based layout with white background, subtle shadows, and proper spacing
* **Design Principles** :
* Keep UI clean with minimal visual elements
* Use consistent spacing and typography
* Implement clear status indicators (color-coded: green for active, gray for inactive)
* Provide immediate feedback for actions (toasts/notifications)
* Responsive Design:
  * Desktop: Full layout with left nav expanded
  * Tablet: Left nav collapsible, card layout adapts
  * Mobile: Left nav slides in/out, single column card layout

### 2.2 User Management Page

* **User List** : Table with columns: ID, Email, Username, Role, Status, Created At
* Color-coded status: Green (Active), Red (Inactive)
* **Search & Filter** : Real-time search by email/username, filter by role (Admin/Customer)
* **Operations** :
* Edit button: Update user role and status
* Delete button: Remove user (with confirmation modal)
* Quick status toggle (icon): Activate/deactivate user without full edit form

### 2.3 Product Management Page

* **Product Grid/List** : Two views available, showing product images, names, status, and price
* **Filters & Search** : Category filter (dropdown), name search (Chinese/English), status filter (Active/Inactive)
* **Product Status** : Color-coded indicators with quick toggle button
* **Product Form (Create/Edit)** :
* **Basic Info** : Multilingual product names (Chinese/English)
* **Pricing** : Current price, original price
* **Inventory** : Stock quantity
* **Description Sections** : 3 structured sections, each with Chinese and English title/body:
  1. 雅物描述 (Elegant Description)
  1. 养生功效 (Health Benefits)
  1. 匠心工艺 (Artisanal Craftsmanship)
* **Image Uploads** :
  * Main Image: Single file upload with preview
  * Detail Images: Multiple upload (max 10), drag-and-drop sorting, preview thumbnails
* **Save/Submit Button** : Prominent button with loading state

### 2.4 Order Management Page

* **Order List** : Table with columns: Order Number, User Email, Total Amount, Status, Created At
* Color-coded status: Blue (未发货 - Confirmed), Orange (已发货 - Shipped), Green (已收货 - Delivered)
* **Search & Filter** : Search by userId/email/order number, filter by order status
* **Order Details** : Click to view complete order information including items, shipping address, and payment method
* **Status Operations** :
* Ship button: Opens modal to input tracking number, marks order as shipped
* Deliver button: Direct button to mark order as delivered (with confirmation)

## Phase 3: Testing and Validation

### 3.1 Functionality Testing

* **Role-Based Access Control** : Ensure only admin users can access the admin interface
* **User Management** : Test user list display, search/filter, role update, status toggle, and deletion
* **Product Management** :
* Test product creation with all multilingual fields and images
* Validate product status toggle functionality
* Test image upload, drag sorting, and preview
* Verify category filtering and name search
* **Order Management** :
* Test order status transitions (未发货 → 已发货 → 已收货)
* Validate tracking number input and display
* Test order search by userId/email

### 3.2 UI/UX Testing

* **Design Principles** : Ensure the interface follows the specified design guidelines (clean, simple, status indicators)
* **Responsive Design** : Test on desktop, tablet, and mobile devices
* **Feedback Mechanisms** : Verify that actions provide timely and clear feedback (toasts, loading states)
* **User Flow** : Ensure intuitive navigation and operation

### 3.3 Integration Testing

* Test API endpoints with the frontend
* Verify database updates reflect correctly in the UI
* Test edge cases (max image uploads, invalid input, etc.)

## Phase 4: Deployment

* **Documentation** : Update project documentation to include admin system features and usage
* **Final Checks** :
* Ensure all features meet the design principles
* Verify responsive design works across all devices
* Test all workflows one more time
* **Environment Setup** :
* Configure production database
* Set up authentication secrets
* Ensure proper CORS configuration

## Critical Files to Modify

### Backend

1. **Database** :

* backend/prisma/schema.prisma (Product and Order model updates)

1. **Services** :

* backend/src/modules/products/products.service.ts (Complete CRUD, image handling, multilingual support)
* backend/src/modules/orders/orders.service.ts (Order workflow, tracking number)
* backend/src/modules/users/users.service.ts (Admin user management)

1. **Authentication** :

* backend/src/modules/auth/guards/admin-auth.guard.ts (Admin role protection)

1. **API** :

* backend/src/modules/admin/admin.module.ts (Admin module)
* backend/src/modules/admin/admin.controller.ts (Admin API endpoints)

### Frontend

1. **Layout** :

* frontend/src/app/admin/layout.tsx (Admin layout component)

1. **Pages** :

* frontend/src/app/admin/dashboard/page.tsx (Admin dashboard)
* frontend/src/app/admin/users/page.tsx (User management)
* frontend/src/app/admin/products/page.tsx (Product management)
* frontend/src/app/admin/orders/page.tsx (Order management)

1. **Components** :

* frontend/src/components/admin/ (All admin UI components)
* frontend/src/components/ImageUploader.tsx (Image upload with drag sorting)
* frontend/src/components/MultilingualInput.tsx (Multilingual field support)
