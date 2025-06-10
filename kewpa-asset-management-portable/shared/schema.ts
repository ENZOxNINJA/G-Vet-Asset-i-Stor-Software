import { pgTable, text, serial, decimal, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  fullName: text("full_name"),
  department: text("department"),
  position: text("position"),
  role: text("role").notNull().default("visitor"), // admin, manager, staff, visitor
  permissions: text("permissions").default("read"), // read, write, admin, full
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  department: true,
  position: true,
  role: true,
  permissions: true,
});

// User role definitions
export const userRoles = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  STAFF: 'staff',
  VISITOR: 'visitor'
} as const;

export const userPermissions = {
  READ: 'read',
  WRITE: 'write', 
  ADMIN: 'admin',
  FULL: 'full'
} as const;

export type UserRole = typeof userRoles[keyof typeof userRoles];
export type UserPermission = typeof userPermissions[keyof typeof userPermissions];

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Assets Schema (Based on KEW.PA forms - Malaysian Government Asset Management)
export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  // KEW.PA-3 Registration fields
  registrationNumber: text("registration_number").notNull().unique(), // No. Siri Pendaftaran
  nationalCode: text("national_code").notNull(), // No Kod Nasional
  assetTag: text("asset_tag").notNull().unique(),
  name: text("name").notNull(), // Keterangan Aset
  description: text("description"),
  category: text("category").notNull(), // Kategori
  subCategory: text("sub_category"), // Sub-kategori
  type: text("type").notNull(), // Jenis/Jenama/Model
  brand: text("brand"), // Jenama
  model: text("model"), // Model
  origin: text("origin"), // Buatan (tempatan/luar negara)
  engineType: text("engine_type"), // Jenis Dan No. Enjin
  chassisNumber: text("chassis_number"), // No. Casis/Siri Pembuat
  vehicleRegistration: text("vehicle_registration"), // No Pendaftaran (Bagi Kenderaan)
  warrantyPeriod: text("warranty_period"), // Tempoh Jaminan
  
  // Financial information
  originalPrice: decimal("original_price", { precision: 12, scale: 2 }).notNull(), // Harga Perolehan Asal
  currentValue: decimal("current_value", { precision: 12, scale: 2 }), // Nilai Semasa
  acquisitionMethod: text("acquisition_method").notNull(), // Cara Aset Diperolehi
  
  // Dates
  acquisitionDate: date("acquisition_date").notNull(), // Tarikh Perolehan
  receivedDate: date("received_date").notNull(), // Tarikh Diterima
  
  // Purchase/Contract details
  purchaseOrderNumber: text("purchase_order_number"), // No. Pesanan Rasmi Kerajaan/Kontrak
  deliveryOrderNumber: text("delivery_order_number"), // Nota Hantaran (DO)
  
  // Supplier information
  supplierName: text("supplier_name"), // Nama Pembekal
  supplierAddress: text("supplier_address"), // Alamat Pembekal
  
  // Location and management
  location: text("location"),
  department: text("department"), // Kementerian/Jabatan
  division: text("division"), // Bahagian/Cawangan
  
  // Status and condition
  status: text("status").notNull().default("active"), // active, maintenance, disposed, transferred
  condition: text("condition").default("good"), // good, fair, poor
  assetType: text("asset_type").notNull().default("capital"), // capital (Harta Modal), low-value (Bernilai Rendah)
  
  // Additional specifications
  specifications: text("specifications"), // Spesifikasi
  notes: text("notes"), // Catatan
  
  // System fields
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAssetSchema = createInsertSchema(assets)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const updateAssetSchema = createInsertSchema(assets)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial();

export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type UpdateAsset = z.infer<typeof updateAssetSchema>;
export type Asset = typeof assets.$inferSelect;

// Asset Movement (for tracking loans, transfers, etc.)
export const assetMovements = pgTable("asset_movements", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull(),
  fromLocation: text("from_location").notNull(),
  toLocation: text("to_location").notNull(),
  requestedBy: integer("requested_by").notNull(), // user id
  approvedBy: integer("approved_by"), // user id
  requestDate: timestamp("request_date").defaultNow(),
  approvalDate: timestamp("approval_date"),
  returnDate: timestamp("return_date"), // for loans
  expectedReturnDate: date("expected_return_date"), // for loans
  type: text("type").notNull(), // loan, transfer, maintenance
  status: text("status").notNull().default("pending"), // pending, approved, rejected, returned
  notes: text("notes"),
});

export const insertMovementSchema = createInsertSchema(assetMovements)
  .omit({ id: true, approvalDate: true, returnDate: true });

export const updateMovementSchema = createInsertSchema(assetMovements)
  .omit({ id: true, requestDate: true })
  .partial();

export type InsertMovement = z.infer<typeof insertMovementSchema>;
export type UpdateMovement = z.infer<typeof updateMovementSchema>;
export type AssetMovement = typeof assetMovements.$inferSelect;

// Asset Reception (KEW.PA-1) - Asset Receiving Form
export const assetReceptions = pgTable("asset_receptions", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(), // No. Rujukan
  
  // Supplier/Delivery details
  supplierName: text("supplier_name").notNull(),
  supplierAddress: text("supplier_address"),
  deliveryAgent: text("delivery_agent"),
  
  // Order/Contract information
  orderType: text("order_type").notNull(), // Pesanan Kerajaan/Kontrak/Surat Kelulusan
  orderNumber: text("order_number"),
  orderDate: date("order_date"),
  deliveryOrderNumber: text("delivery_order_number"), // Nota Hantaran (DO)
  deliveryDate: date("delivery_date"),
  
  // Transportation details
  transportCompany: text("transport_company"),
  vehicleNumber: text("vehicle_number"),
  
  // Reception details
  receivedBy: text("received_by").notNull(), // Pegawai Penerima
  receiverPosition: text("receiver_position"),
  receiverDepartment: text("receiver_department"),
  receivedDate: date("received_date").notNull(),
  
  // Technical officer (if required)
  technicalOfficer: text("technical_officer"),
  technicalPosition: text("technical_position"),
  technicalDepartment: text("technical_department"),
  
  status: text("status").notNull().default("pending"), // pending, completed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Asset Reception Items
export const assetReceptionItems = pgTable("asset_reception_items", {
  id: serial("id").primaryKey(),
  receptionId: integer("reception_id").notNull(),
  nationalCode: text("national_code").notNull(),
  description: text("description").notNull(),
  quantityOrdered: integer("quantity_ordered").notNull(),
  quantityDelivered: integer("quantity_delivered").notNull(),
  quantityReceived: integer("quantity_received").notNull(),
  notes: text("notes"),
});

// Asset Rejection (KEW.PA-2) - Asset Rejection Form
export const assetRejections = pgTable("asset_rejections", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  receptionReferenceNumber: text("reception_reference_number"), // Link to original reception
  
  // Supplier details
  supplierName: text("supplier_name").notNull(),
  supplierAddress: text("supplier_address"),
  
  // Order details
  orderNumber: text("order_number"),
  orderDate: date("order_date"),
  deliveryOrderNumber: text("delivery_order_number"),
  deliveryDate: date("delivery_date"),
  
  // Transportation
  transportCompany: text("transport_company"),
  vehicleNumber: text("vehicle_number"),
  
  // Rejection details
  rejectedBy: text("rejected_by").notNull(),
  rejectorPosition: text("rejector_position"),
  rejectionDate: date("rejection_date").notNull(),
  
  // Supplier acknowledgment
  supplierAcknowledgment: boolean("supplier_acknowledgment").default(false),
  supplierRepresentative: text("supplier_representative"),
  supplierSignDate: date("supplier_sign_date"),
  
  status: text("status").notNull().default("pending"), // pending, acknowledged
  createdAt: timestamp("created_at").defaultNow(),
});

// Asset Rejection Items
export const assetRejectionItems = pgTable("asset_rejection_items", {
  id: serial("id").primaryKey(),
  rejectionId: integer("rejection_id").notNull(),
  nationalCode: text("national_code").notNull(),
  description: text("description").notNull(),
  quantityOrdered: integer("quantity_ordered").notNull(),
  quantityDelivered: integer("quantity_delivered").notNull(),
  quantityReceived: integer("quantity_received").notNull(),
  quantityRejected: integer("quantity_rejected").notNull(),
  quantityVariance: integer("quantity_variance"), // +/- difference
  rejectionReason: text("rejection_reason").notNull(),
  notes: text("notes"),
});

// Asset Damage Reports (KEW.PA-10) - Asset Damage Complaint Form
export const assetDamageReports = pgTable("asset_damage_reports", {
  id: serial("id").primaryKey(),
  
  // Section I - Complainant details
  assetType: text("asset_type").notNull(),
  assetRegistrationNumber: text("asset_registration_number"),
  componentNumber: text("component_number"),
  lastUser: text("last_user"),
  damageDate: date("damage_date"),
  damageDescription: text("damage_description").notNull(),
  complainantName: text("complainant_name").notNull(),
  complainantPosition: text("complainant_position").notNull(),
  complaintDate: date("complaint_date").notNull(),
  
  // Section II - Asset Officer/Technical Officer assessment
  previousMaintenanceCost: decimal("previous_maintenance_cost", { precision: 10, scale: 2 }),
  estimatedRepairCost: decimal("estimated_repair_cost", { precision: 10, scale: 2 }),
  recommendations: text("recommendations"),
  assessorName: text("assessor_name"),
  assessorPosition: text("assessor_position"),
  assessmentDate: date("assessment_date"),
  
  // Section III - Department Head decision
  decision: text("decision"), // approved, rejected
  decisionComments: text("decision_comments"),
  approverName: text("approver_name"),
  approverPosition: text("approver_position"),
  approvalDate: date("approval_date"),
  
  status: text("status").notNull().default("reported"), // reported, assessed, decided
  createdAt: timestamp("created_at").defaultNow(),
});

// Asset Loan/Movement Requests (KEW.PA-9) - Asset Movement/Loan Application Form
export const assetLoanRequests = pgTable("asset_loan_requests", {
  id: serial("id").primaryKey(),
  applicationNumber: text("application_number").notNull().unique(),
  
  // Applicant details
  applicantName: text("applicant_name").notNull(),
  applicantPosition: text("applicant_position").notNull(),
  department: text("department").notNull(),
  
  // Loan details
  purpose: text("purpose").notNull(),
  usageLocation: text("usage_location").notNull(),
  loanDate: date("loan_date"),
  expectedReturnDate: date("expected_return_date"),
  actualReturnDate: date("actual_return_date"),
  
  // Approval workflow
  approverName: text("approver_name"),
  approverPosition: text("approver_position"),
  approvalDate: date("approval_date"),
  approvalStatus: text("approval_status").default("pending"), // pending, approved, rejected
  
  // Return process
  returnerName: text("returner_name"),
  returnerPosition: text("returner_position"),
  returnDate: date("return_date"),
  receiverName: text("receiver_name"),
  receiverPosition: text("receiver_position"),
  receiveDate: date("receive_date"),
  
  status: text("status").notNull().default("requested"), // requested, approved, in-use, returned
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Asset Loan Request Items
export const assetLoanRequestItems = pgTable("asset_loan_request_items", {
  id: serial("id").primaryKey(),
  loanRequestId: integer("loan_request_id").notNull(),
  assetId: integer("asset_id").notNull(),
  registrationNumber: text("registration_number").notNull(),
  description: text("description").notNull(),
  approvalStatus: text("approval_status").default("pending"), // pending, approved, rejected
  notes: text("notes"),
});

// Asset Inspection Forms (KEW.PA-11, KEW.PA-12, KEW.PA-13)
export const assetInspections = pgTable("asset_inspections", {
  id: serial("id").primaryKey(),
  inspectionYear: text("inspection_year").notNull(),
  inspectionType: text("inspection_type").notNull(), // annual, quarterly, spot
  department: text("department").notNull(),
  division: text("division"),
  
  // Inspection assignment
  inspectorName: text("inspector_name").notNull(),
  inspectorPosition: text("inspector_position").notNull(),
  assignedDate: date("assigned_date").notNull(),
  
  // Inspection results
  totalAssetsRegistered: integer("total_assets_registered").default(0),
  totalAssetsInspected: integer("total_assets_inspected").default(0),
  assetsFoundGood: integer("assets_found_good").default(0),
  assetsFoundDamaged: integer("assets_found_damaged").default(0),
  assetsNotFound: integer("assets_not_found").default(0),
  assetsFoundUnregistered: integer("assets_found_unregistered").default(0),
  
  // Completion and certification
  inspectionStartDate: date("inspection_start_date"),
  inspectionEndDate: date("inspection_end_date"),
  status: text("status").notNull().default("assigned"), // assigned, in-progress, completed, certified
  performanceScore: decimal("performance_score", { precision: 5, scale: 2 }),
  remarks: text("remarks"),
  
  // Certification details
  certifiedBy: text("certified_by"),
  certifiedDate: date("certified_date"),
  certificateNumber: text("certificate_number"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Asset Inspection Items (detailed findings per asset)
export const assetInspectionItems = pgTable("asset_inspection_items", {
  id: serial("id").primaryKey(),
  inspectionId: integer("inspection_id").notNull(),
  assetId: integer("asset_id"),
  registrationNumber: text("registration_number"),
  
  // Expected details (from records)
  expectedLocation: text("expected_location"),
  expectedCondition: text("expected_condition"),
  expectedCustodian: text("expected_custodian"),
  
  // Actual findings
  actualLocation: text("actual_location"),
  actualCondition: text("actual_condition"),
  actualCustodian: text("actual_custodian"),
  assetFound: boolean("asset_found").default(true),
  
  // Discrepancies and actions
  discrepancies: text("discrepancies"),
  recommendedAction: text("recommended_action"),
  inspectorRemarks: text("inspector_remarks"),
  
  inspectedDate: date("inspected_date"),
  inspectedBy: text("inspected_by"),
});

// Asset Maintenance Forms (KEW.PA-14, KEW.PA-15, KEW.PA-16)
export const assetMaintenanceRecords = pgTable("asset_maintenance_records", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull(),
  maintenanceType: text("maintenance_type").notNull(), // preventive, corrective, emergency
  
  // Request details
  requestedBy: text("requested_by").notNull(),
  requestedDate: date("requested_date").notNull(),
  problemDescription: text("problem_description"),
  urgencyLevel: text("urgency_level").default("normal"), // urgent, normal, low
  
  // Approval and assignment
  approvedBy: text("approved_by"),
  approvedDate: date("approved_date"),
  assignedTo: text("assigned_to"), // internal staff or external contractor
  assignedDate: date("assigned_date"),
  
  // Work details
  workStartDate: date("work_start_date"),
  workEndDate: date("work_end_date"),
  workDescription: text("work_description"),
  partsUsed: text("parts_used"),
  
  // Cost information
  laborCost: decimal("labor_cost", { precision: 10, scale: 2 }).default("0"),
  partsCost: decimal("parts_cost", { precision: 10, scale: 2 }).default("0"),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).default("0"),
  
  // Service provider details (if external)
  serviceProvider: text("service_provider"),
  serviceProviderContact: text("service_provider_contact"),
  invoiceNumber: text("invoice_number"),
  
  // Completion and verification
  workCompleted: boolean("work_completed").default(false),
  verifiedBy: text("verified_by"),
  verifiedDate: date("verified_date"),
  userSatisfaction: text("user_satisfaction"), // excellent, good, satisfactory, poor
  
  // Follow-up
  warrantyPeriod: text("warranty_period"),
  nextMaintenanceDue: date("next_maintenance_due"),
  
  status: text("status").notNull().default("requested"), // requested, approved, assigned, in-progress, completed, verified
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Asset Transfer Forms (KEW.PA-17, KEW.PA-18)
export const assetTransfers = pgTable("asset_transfers", {
  id: serial("id").primaryKey(),
  transferType: text("transfer_type").notNull(), // permanent, temporary, loan
  
  // Asset details
  assetId: integer("asset_id").notNull(),
  registrationNumber: text("registration_number").notNull(),
  
  // Source information
  fromDepartment: text("from_department").notNull(),
  fromDivision: text("from_division"),
  fromLocation: text("from_location").notNull(),
  fromCustodian: text("from_custodian").notNull(),
  fromCustodianPosition: text("from_custodian_position"),
  
  // Destination information
  toDepartment: text("to_department").notNull(),
  toDivision: text("to_division"),
  toLocation: text("to_location").notNull(),
  toCustodian: text("to_custodian").notNull(),
  toCustodianPosition: text("to_custodian_position"),
  
  // Transfer details
  transferReason: text("transfer_reason").notNull(),
  transferDate: date("transfer_date").notNull(),
  expectedReturnDate: date("expected_return_date"), // for temporary transfers
  actualReturnDate: date("actual_return_date"),
  
  // Authorization
  authorizedBy: text("authorized_by").notNull(),
  authorizationDate: date("authorization_date").notNull(),
  authorizationReference: text("authorization_reference"),
  
  // Handover process
  handedOverBy: text("handed_over_by"),
  handoverDate: date("handover_date"),
  receivedBy: text("received_by"),
  receiveDate: date("receive_date"),
  
  // Condition verification
  conditionAtTransfer: text("condition_at_transfer"),
  conditionAtReturn: text("condition_at_return"), // for temporary transfers
  
  status: text("status").notNull().default("requested"), // requested, approved, in-transit, completed, returned
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Asset Disposal Forms (KEW.PA-19 to KEW.PA-23)
export const assetDisposals = pgTable("asset_disposals", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull(),
  registrationNumber: text("registration_number").notNull(),
  
  // Disposal justification
  disposalReason: text("disposal_reason").notNull(), // obsolete, damaged, uneconomical, surplus
  disposalJustification: text("disposal_justification").notNull(),
  
  // Technical assessment (KEW.PA-19 - PEP)
  requiresTechnicalAssessment: boolean("requires_technical_assessment").default(false),
  technicalAssessmentBy: text("technical_assessment_by"),
  technicalAssessmentDate: date("technical_assessment_date"),
  technicalRecommendation: text("technical_recommendation"),
  pepCertificateNumber: text("pep_certificate_number"),
  
  // Disposal board (KEW.PA-20, KEW.PA-21)
  disposalBoardAppointed: boolean("disposal_board_appointed").default(false),
  disposalBoardMembers: text("disposal_board_members"), // JSON array of member details
  boardInspectionDate: date("board_inspection_date"),
  boardRecommendation: text("board_recommendation"),
  recommendedDisposalMethod: text("recommended_disposal_method"), // sale, scrap, destruction, donation
  estimatedValue: decimal("estimated_value", { precision: 10, scale: 2 }),
  
  // Approval process
  approvedBy: text("approved_by"),
  approvalDate: date("approval_date"),
  approvalReference: text("approval_reference"),
  
  // Disposal execution
  disposalMethod: text("disposal_method"),
  disposalDate: date("disposal_date"),
  disposalLocation: text("disposal_location"),
  purchaserName: text("purchaser_name"), // if sold
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }), // if sold
  
  // Verification (KEW.PA-22, KEW.PA-23)
  witnessedBy: text("witnessed_by"), // JSON array of witnesses
  disposalCertificateNumber: text("disposal_certificate_number"),
  verifiedBy: text("verified_by"),
  verificationDate: date("verification_date"),
  
  status: text("status").notNull().default("proposed"), // proposed, assessed, approved, executed, completed
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema exports for new KEW.PA forms
export const insertAssetReceptionSchema = createInsertSchema(assetReceptions)
  .omit({ id: true, createdAt: true });

export const insertAssetReceptionItemSchema = createInsertSchema(assetReceptionItems)
  .omit({ id: true });

export const insertAssetRejectionSchema = createInsertSchema(assetRejections)
  .omit({ id: true, createdAt: true });

export const insertAssetRejectionItemSchema = createInsertSchema(assetRejectionItems)
  .omit({ id: true });

export const insertAssetDamageReportSchema = createInsertSchema(assetDamageReports)
  .omit({ id: true, createdAt: true });

export const insertAssetLoanRequestSchema = createInsertSchema(assetLoanRequests)
  .omit({ id: true, createdAt: true });

export const insertAssetLoanRequestItemSchema = createInsertSchema(assetLoanRequestItems)
  .omit({ id: true });

// Type exports
export type InsertAssetReception = z.infer<typeof insertAssetReceptionSchema>;
export type AssetReception = typeof assetReceptions.$inferSelect;
export type InsertAssetReceptionItem = z.infer<typeof insertAssetReceptionItemSchema>;
export type AssetReceptionItem = typeof assetReceptionItems.$inferSelect;

export type InsertAssetRejection = z.infer<typeof insertAssetRejectionSchema>;
export type AssetRejection = typeof assetRejections.$inferSelect;
export type InsertAssetRejectionItem = z.infer<typeof insertAssetRejectionItemSchema>;
export type AssetRejectionItem = typeof assetRejectionItems.$inferSelect;

export type InsertAssetDamageReport = z.infer<typeof insertAssetDamageReportSchema>;
export type AssetDamageReport = typeof assetDamageReports.$inferSelect;

export type InsertAssetLoanRequest = z.infer<typeof insertAssetLoanRequestSchema>;
export type AssetLoanRequest = typeof assetLoanRequests.$inferSelect;
export type InsertAssetLoanRequestItem = z.infer<typeof insertAssetLoanRequestItemSchema>;
export type AssetLoanRequestItem = typeof assetLoanRequestItems.$inferSelect;

// Schema exports for enhanced KEW.PA compliance forms
export const insertAssetInspectionSchema = createInsertSchema(assetInspections)
  .omit({ id: true, createdAt: true });

export const insertAssetInspectionItemSchema = createInsertSchema(assetInspectionItems)
  .omit({ id: true });

export const insertAssetMaintenanceRecordSchema = createInsertSchema(assetMaintenanceRecords)
  .omit({ id: true, createdAt: true });

export const insertAssetTransferSchema = createInsertSchema(assetTransfers)
  .omit({ id: true, createdAt: true });

export const insertAssetDisposalSchema = createInsertSchema(assetDisposals)
  .omit({ id: true, createdAt: true });

// Type exports for enhanced compliance
export type InsertAssetInspection = z.infer<typeof insertAssetInspectionSchema>;
export type AssetInspection = typeof assetInspections.$inferSelect;
export type InsertAssetInspectionItem = z.infer<typeof insertAssetInspectionItemSchema>;
export type AssetInspectionItem = typeof assetInspectionItems.$inferSelect;

export type InsertAssetMaintenanceRecord = z.infer<typeof insertAssetMaintenanceRecordSchema>;
export type AssetMaintenanceRecord = typeof assetMaintenanceRecords.$inferSelect;

export type InsertAssetTransfer = z.infer<typeof insertAssetTransferSchema>;
export type AssetTransfer = typeof assetTransfers.$inferSelect;

export type InsertAssetDisposal = z.infer<typeof insertAssetDisposalSchema>;
export type AssetDisposal = typeof assetDisposals.$inferSelect;

// Suppliers
export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSupplierSchema = createInsertSchema(suppliers)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const updateSupplierSchema = createInsertSchema(suppliers)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial();

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type UpdateSupplier = z.infer<typeof updateSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

// Legacy Inventory Items Schema - keeping for backward compatibility
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  description: text("description"),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  reorderLevel: integer("reorder_level").default(10),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const updateInventoryItemSchema = createInsertSchema(inventoryItems)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .partial();

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type UpdateInventoryItem = z.infer<typeof updateInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

// Validation schema for frontend form with additional validation rules
export const inventoryItemFormSchema = insertInventoryItemSchema.extend({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Price must be a valid number",
  }),
  quantity: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Quantity must be a valid number",
  }),
  reorderLevel: z.string().refine((val) => val === "" || (!isNaN(parseInt(val)) && parseInt(val) >= 0), {
    message: "Reorder level must be a valid number",
  }).optional(),
});

// Asset validation schema for frontend form - Enhanced for KEW.PA compliance
export const assetFormSchema = insertAssetSchema.extend({
  registrationNumber: z.string().min(1, "Registration number is required"),
  nationalCode: z.string().min(1, "National code is required"),
  name: z.string().min(1, "Asset name is required"),
  assetTag: z.string().min(1, "Asset tag is required"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Asset type is required"),
  originalPrice: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Original price must be a valid number",
  }),
  acquisitionMethod: z.string().min(1, "Acquisition method is required"),
  acquisitionDate: z.string().min(1, "Acquisition date is required"),
  receivedDate: z.string().min(1, "Received date is required"),
  assetType: z.enum(["capital", "low-value"], {
    required_error: "Asset type is required",
  }),
});

// The inventory filter type for search and filtering
export type InventoryFilter = {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  stockStatus?: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
  dateAdded?: string;
};

// The asset filter type for search and filtering
export type AssetFilter = {
  search?: string;
  category?: string;
  type?: string;
  department?: string;
  location?: string;
  status?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  purchaseDateFrom?: string;
  purchaseDateTo?: string;
};
