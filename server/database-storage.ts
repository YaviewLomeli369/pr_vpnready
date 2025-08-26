import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc, asc, and, or, like, count, sum, sql } from "drizzle-orm";
import * as schema from "@shared/schema";
import type { 
  User, InsertUser, 
  SiteConfig, InsertSiteConfig,
  Testimonial, InsertTestimonial,
  FaqCategory, InsertFaqCategory,
  Faq, InsertFaq,
  ContactMessage, InsertContactMessage,
  ContactInfo, InsertContactInfo,
  ProductCategory, InsertProductCategory,
  Product, InsertProduct,
  ProductVariant, InsertProductVariant,
  InventoryMovement, InsertInventoryMovement,
  CartItem, InsertCartItem,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  Customer, InsertCustomer,
  CustomerAddress, InsertCustomerAddress,
  Payment, InsertPayment,
  Shipment, InsertShipment,
  Reservation, InsertReservation,
  ReservationSettings, InsertReservationSettings,
  Section, InsertSection,
  BlogPost, InsertBlogPost,
  PageCustomization, InsertPageCustomization,
  VisualCustomization, InsertVisualCustomization,
  PaymentConfig, InsertPaymentConfig,
  EmailConfig, InsertEmailConfig
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Site Config
  getSiteConfig(): Promise<SiteConfig | undefined>;
  createSiteConfig(config: InsertSiteConfig): Promise<SiteConfig>;
  updateSiteConfig(id: string, config: Partial<SiteConfig>): Promise<SiteConfig | undefined>;
  
  // Testimonials
  getAllTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: string): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;
  
  // FAQ Categories
  getAllFaqCategories(): Promise<FaqCategory[]>;
  getFaqCategory(id: string): Promise<FaqCategory | undefined>;
  createFaqCategory(category: InsertFaqCategory): Promise<FaqCategory>;
  updateFaqCategory(id: string, updates: Partial<FaqCategory>): Promise<FaqCategory | undefined>;
  deleteFaqCategory(id: string): Promise<boolean>;
  
  // FAQs
  getAllFaqs(): Promise<Faq[]>;
  getFaq(id: string): Promise<Faq | undefined>;
  getFaqsByCategory(categoryId: string): Promise<Faq[]>;
  createFaq(faq: InsertFaq): Promise<Faq>;
  updateFaq(id: string, updates: Partial<Faq>): Promise<Faq | undefined>;
  deleteFaq(id: string): Promise<boolean>;
  
  // Contact Messages
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: string): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage | undefined>;
  deleteContactMessage(id: string): Promise<boolean>;
  
  // Contact Info
  getContactInfo(): Promise<ContactInfo | undefined>;
  createContactInfo(info: InsertContactInfo): Promise<ContactInfo>;
  updateContactInfo(id: string, updates: Partial<ContactInfo>): Promise<ContactInfo | undefined>;
  
  // Product Categories
  getAllProductCategories(): Promise<ProductCategory[]>;
  getProductCategory(id: string): Promise<ProductCategory | undefined>;
  createProductCategory(category: InsertProductCategory): Promise<ProductCategory>;
  updateProductCategory(id: string, updates: Partial<ProductCategory>): Promise<ProductCategory | undefined>;
  deleteProductCategory(id: string): Promise<boolean>;
  
  // Products
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getActiveProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  updateProductStock(productId: string, quantity: number): Promise<boolean>;
  
  // Product Variants
  getProductVariants(productId: string): Promise<ProductVariant[]>;
  getProductVariant(id: string): Promise<ProductVariant | undefined>;
  createProductVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  updateProductVariant(id: string, updates: Partial<ProductVariant>): Promise<ProductVariant | undefined>;
  deleteProductVariant(id: string): Promise<boolean>;
  
  // Inventory
  getInventoryMovements(productId?: string): Promise<InventoryMovement[]>;
  createInventoryMovement(movement: InsertInventoryMovement): Promise<InventoryMovement>;
  getLowStockProducts(): Promise<Product[]>;
  
  // Cart
  getCartItems(userId?: string, sessionId?: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId?: string, sessionId?: string): Promise<boolean>;
  
  // Orders
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;
  
  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Customers
  getAllCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByUserId(userId: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | undefined>;
  
  // Customer Addresses
  getCustomerAddresses(customerId: string): Promise<CustomerAddress[]>;
  createCustomerAddress(address: InsertCustomerAddress): Promise<CustomerAddress>;
  updateCustomerAddress(id: string, updates: Partial<CustomerAddress>): Promise<CustomerAddress | undefined>;
  deleteCustomerAddress(id: string): Promise<boolean>;
  
  // Payments
  getOrderPayments(orderId: string): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined>;
  
  // Shipments
  getOrderShipments(orderId: string): Promise<Shipment[]>;
  getShipment(id: string): Promise<Shipment | undefined>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment | undefined>;
  
  // Reservations
  getAllReservations(): Promise<Reservation[]>;
  getReservation(id: string): Promise<Reservation | undefined>;
  getUserReservations(userId: string): Promise<Reservation[]>;
  createReservation(reservation: InsertReservation): Promise<Reservation>;
  updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | undefined>;
  deleteReservation(id: string): Promise<boolean>;
  getReservationsForDate(date: string): Promise<Reservation[]>;
  
  // Reservation Settings
  getReservationSettings(): Promise<ReservationSettings | undefined>;
  createReservationSettings(settings: InsertReservationSettings): Promise<ReservationSettings>;
  updateReservationSettings(settings: Partial<ReservationSettings>): Promise<ReservationSettings | undefined>;

  // Payment Configuration
  getPaymentConfig(): Promise<PaymentConfig | undefined>;
  updatePaymentConfig(config: InsertPaymentConfig): Promise<PaymentConfig>;
  
  // Email Configuration
  getEmailConfig(): Promise<EmailConfig | undefined>;
  updateEmailConfig(config: InsertEmailConfig): Promise<EmailConfig>;
  updateEmailTestStatus(status: 'success' | 'failed' | 'pending'): Promise<void>;
  
  // Sections
  getAllSections(): Promise<Section[]>;
  getSection(id: string): Promise<Section | undefined>;
  createSection(section: InsertSection): Promise<Section>;
  updateSection(id: string, updates: Partial<Section>): Promise<Section | undefined>;
  deleteSection(id: string): Promise<boolean>;
  
  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  incrementBlogPostViews(id: string): Promise<boolean>;
  
  // Page Customizations
  getPageCustomization(pageId: string, userId: string): Promise<PageCustomization | undefined>;
  getPageCustomizations(userId: string): Promise<PageCustomization[]>;
  createPageCustomization(customization: InsertPageCustomization): Promise<PageCustomization>;
  updatePageCustomization(pageId: string, userId: string, updates: Partial<PageCustomization>): Promise<PageCustomization | undefined>;
  deletePageCustomization(pageId: string, userId: string): Promise<boolean>;

  // Visual Customizations for inline editor
  getVisualCustomizations(pageId: string): Promise<VisualCustomization[]>;
  getVisualCustomization(elementSelector: string, pageId: string): Promise<VisualCustomization | undefined>;
  saveVisualCustomization(customization: InsertVisualCustomization): Promise<VisualCustomization>;
  updateVisualCustomization(id: string, updates: Partial<VisualCustomization>): Promise<VisualCustomization | undefined>;
  deleteVisualCustomization(id: string): Promise<boolean>;
  deleteAllVisualCustomizations(pageId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const [newUser] = await db.insert(schema.users).values({ id, ...user }).returning();
    return newUser;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db.update(schema.users).set(updates).where(eq(schema.users.id, id)).returning();
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(schema.users).orderBy(desc(schema.users.username));
  }

  // Site Config
  async getSiteConfig(): Promise<SiteConfig | undefined> {
    const [config] = await db.select().from(schema.siteConfig).orderBy(desc(schema.siteConfig.lastUpdated)).limit(1);
    return config;
  }

  async createSiteConfig(config: InsertSiteConfig): Promise<SiteConfig> {
    const id = randomUUID();
    const [newConfig] = await db.insert(schema.siteConfig).values({ 
      id, 
      ...config, 
      lastUpdated: new Date() 
    }).returning();
    return newConfig;
  }

  async updateSiteConfig(id: string, updates: Partial<SiteConfig>): Promise<SiteConfig | undefined> {
    const [updatedConfig] = await db.update(schema.siteConfig)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(schema.siteConfig.id, id))
      .returning();
    return updatedConfig;
  }

  // Testimonials
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(schema.testimonials).orderBy(desc(schema.testimonials.createdAt));
  }

  async getTestimonial(id: string): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, id));
    return testimonial;
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = randomUUID();
    const [newTestimonial] = await db.insert(schema.testimonials).values({ 
      id, 
      ...testimonial, 
      createdAt: new Date() 
    }).returning();
    return newTestimonial;
  }

  async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | undefined> {
    const [updatedTestimonial] = await db.update(schema.testimonials)
      .set(updates)
      .where(eq(schema.testimonials.id, id))
      .returning();
    return updatedTestimonial;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const result = await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // FAQ Categories
  async getAllFaqCategories(): Promise<FaqCategory[]> {
    return await db.select().from(schema.faqCategories).orderBy(asc(schema.faqCategories.order));
  }

  async getFaqCategory(id: string): Promise<FaqCategory | undefined> {
    const [category] = await db.select().from(schema.faqCategories).where(eq(schema.faqCategories.id, id));
    return category;
  }

  async createFaqCategory(category: InsertFaqCategory): Promise<FaqCategory> {
    const id = randomUUID();
    const [newCategory] = await db.insert(schema.faqCategories).values({ id, ...category }).returning();
    return newCategory;
  }

  async updateFaqCategory(id: string, updates: Partial<FaqCategory>): Promise<FaqCategory | undefined> {
    const [updatedCategory] = await db.update(schema.faqCategories)
      .set(updates)
      .where(eq(schema.faqCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteFaqCategory(id: string): Promise<boolean> {
    const result = await db.delete(schema.faqCategories).where(eq(schema.faqCategories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // FAQs
  async getAllFaqs(): Promise<Faq[]> {
    return await db.select().from(schema.faqs).orderBy(asc(schema.faqs.order));
  }

  async getFaq(id: string): Promise<Faq | undefined> {
    const [faq] = await db.select().from(schema.faqs).where(eq(schema.faqs.id, id));
    return faq;
  }

  async getFaqsByCategory(categoryId: string): Promise<Faq[]> {
    return await db.select().from(schema.faqs)
      .where(eq(schema.faqs.categoryId, categoryId))
      .orderBy(asc(schema.faqs.order));
  }

  async createFaq(faq: InsertFaq): Promise<Faq> {
    const id = randomUUID();
    const [newFaq] = await db.insert(schema.faqs).values({ id, ...faq }).returning();
    return newFaq;
  }

  async updateFaq(id: string, updates: Partial<Faq>): Promise<Faq | undefined> {
    const [updatedFaq] = await db.update(schema.faqs)
      .set(updates)
      .where(eq(schema.faqs.id, id))
      .returning();
    return updatedFaq;
  }

  async deleteFaq(id: string): Promise<boolean> {
    const result = await db.delete(schema.faqs).where(eq(schema.faqs.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Contact Messages
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(schema.contactMessages).orderBy(desc(schema.contactMessages.createdAt));
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(schema.contactMessages).where(eq(schema.contactMessages.id, id));
    return message;
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const [newMessage] = await db.insert(schema.contactMessages).values({ 
      id, 
      ...message, 
      createdAt: new Date() 
    }).returning();
    return newMessage;
  }

  async updateContactMessage(id: string, updates: Partial<ContactMessage>): Promise<ContactMessage | undefined> {
    const [updatedMessage] = await db.update(schema.contactMessages)
      .set(updates)
      .where(eq(schema.contactMessages.id, id))
      .returning();
    return updatedMessage;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const result = await db.delete(schema.contactMessages).where(eq(schema.contactMessages.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Contact Info
  async getContactInfo(): Promise<ContactInfo | undefined> {
    const [info] = await db.select().from(schema.contactInfo).limit(1);
    return info;
  }

  async createContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    const id = randomUUID();
    const [newInfo] = await db.insert(schema.contactInfo).values({ id, ...info }).returning();
    return newInfo;
  }

  async updateContactInfo(id: string, updates: Partial<ContactInfo>): Promise<ContactInfo | undefined> {
    const [updatedInfo] = await db.update(schema.contactInfo)
      .set(updates)
      .where(eq(schema.contactInfo.id, id))
      .returning();
    return updatedInfo;
  }

  // Product Categories
  async getAllProductCategories(): Promise<ProductCategory[]> {
    return await db.select().from(schema.productCategories).where(eq(schema.productCategories.isActive, true));
  }

  async getProductCategory(id: string): Promise<ProductCategory | undefined> {
    const [category] = await db.select().from(schema.productCategories).where(eq(schema.productCategories.id, id));
    return category;
  }

  async createProductCategory(category: InsertProductCategory): Promise<ProductCategory> {
    const id = randomUUID();
    const [newCategory] = await db.insert(schema.productCategories).values({ id, ...category }).returning();
    return newCategory;
  }

  async updateProductCategory(id: string, updates: Partial<ProductCategory>): Promise<ProductCategory | undefined> {
    const [updatedCategory] = await db.update(schema.productCategories)
      .set(updates)
      .where(eq(schema.productCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteProductCategory(id: string): Promise<boolean> {
    const result = await db.delete(schema.productCategories).where(eq(schema.productCategories.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Products
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(schema.products).orderBy(desc(schema.products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(schema.products).where(eq(schema.products.id, id));
    return product;
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const [product] = await db.select().from(schema.products).where(eq(schema.products.sku, sku));
    return product;
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db.select().from(schema.products)
      .where(and(eq(schema.products.categoryId, categoryId), eq(schema.products.isActive, true)))
      .orderBy(desc(schema.products.createdAt));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(schema.products)
      .where(and(eq(schema.products.isFeatured, true), eq(schema.products.isActive, true)))
      .orderBy(desc(schema.products.createdAt));
  }

  async getActiveProducts(): Promise<Product[]> {
    return await db.select().from(schema.products)
      .where(eq(schema.products.isActive, true))
      .orderBy(desc(schema.products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const now = new Date();
    const [newProduct] = await db.insert(schema.products).values({ 
      id, 
      ...product, 
      createdAt: now,
      updatedAt: now
    }).returning();
    return newProduct;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const [updatedProduct] = await db.update(schema.products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(schema.products).where(eq(schema.products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async updateProductStock(productId: string, quantity: number): Promise<boolean> {
    const result = await db.update(schema.products)
      .set({ 
        stock: quantity,
        updatedAt: new Date()
      })
      .where(eq(schema.products.id, productId));
    return (result.rowCount ?? 0) > 0;
  }

  async getLowStockProducts(): Promise<Product[]> {
    return await db.select().from(schema.products)
      .where(and(
        eq(schema.products.isActive, true),
        sql`${schema.products.stock} <= ${schema.products.lowStockThreshold}`
      ))
      .orderBy(asc(schema.products.stock));
  }

  // Product Variants
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    return await db.select().from(schema.productVariants)
      .where(eq(schema.productVariants.productId, productId));
  }

  async getProductVariant(id: string): Promise<ProductVariant | undefined> {
    const [variant] = await db.select().from(schema.productVariants).where(eq(schema.productVariants.id, id));
    return variant;
  }

  async createProductVariant(variant: InsertProductVariant): Promise<ProductVariant> {
    const id = randomUUID();
    const [newVariant] = await db.insert(schema.productVariants).values({ id, ...variant }).returning();
    return newVariant;
  }

  async updateProductVariant(id: string, updates: Partial<ProductVariant>): Promise<ProductVariant | undefined> {
    const [updatedVariant] = await db.update(schema.productVariants)
      .set(updates)
      .where(eq(schema.productVariants.id, id))
      .returning();
    return updatedVariant;
  }

  async deleteProductVariant(id: string): Promise<boolean> {
    const result = await db.delete(schema.productVariants).where(eq(schema.productVariants.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Inventory
  async getInventoryMovements(productId?: string): Promise<InventoryMovement[]> {
    const query = db.select().from(schema.inventoryMovements);
    if (productId) {
      return await query.where(eq(schema.inventoryMovements.productId, productId))
        .orderBy(desc(schema.inventoryMovements.createdAt));
    }
    return await query.orderBy(desc(schema.inventoryMovements.createdAt));
  }

  async createInventoryMovement(movement: InsertInventoryMovement): Promise<InventoryMovement> {
    const id = randomUUID();
    const [newMovement] = await db.insert(schema.inventoryMovements).values({ 
      id, 
      ...movement,
      createdAt: new Date()
    }).returning();
    return newMovement;
  }

  // Cart
  async getCartItems(userId?: string, sessionId?: string): Promise<CartItem[]> {
    const conditions = [];
    if (userId) conditions.push(eq(schema.cartItems.userId, userId));
    if (sessionId) conditions.push(eq(schema.cartItems.sessionId, sessionId));
    
    if (conditions.length === 0) return [];
    
    return await db.select().from(schema.cartItems)
      .where(or(...conditions))
      .orderBy(desc(schema.cartItems.createdAt));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const now = new Date();
    const [newItem] = await db.insert(schema.cartItems).values({ 
      id, 
      ...item,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newItem;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const [updatedItem] = await db.update(schema.cartItems)
      .set({ 
        quantity,
        updatedAt: new Date()
      })
      .where(eq(schema.cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    const result = await db.delete(schema.cartItems).where(eq(schema.cartItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async clearCart(userId?: string, sessionId?: string): Promise<boolean> {
    const conditions = [];
    if (userId) conditions.push(eq(schema.cartItems.userId, userId));
    if (sessionId) conditions.push(eq(schema.cartItems.sessionId, sessionId));
    
    if (conditions.length === 0) return false;
    
    const result = await db.delete(schema.cartItems).where(or(...conditions));
    return (result.rowCount ?? 0) > 0;
  }

  // Orders
  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
    return order;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select().from(schema.orders).where(eq(schema.orders.orderNumber, orderNumber));
    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return await db.select().from(schema.orders)
      .where(eq(schema.orders.userId, userId))
      .orderBy(desc(schema.orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const now = new Date();
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    
    const [newOrder] = await db.insert(schema.orders).values({ 
      id,
      orderNumber,
      ...order,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newOrder;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const [updatedOrder] = await db.update(schema.orders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.orders.id, id))
      .returning();
    return updatedOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    return await this.updateOrder(id, { status });
  }

  async deleteOrder(id: string): Promise<boolean> {
    const result = await db.delete(schema.orders).where(eq(schema.orders.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const [newItem] = await db.insert(schema.orderItems).values({ id, ...item }).returning();
    return newItem;
  }

  // Customers
  async getAllCustomers(): Promise<Customer[]> {
    return await db.select().from(schema.customers).orderBy(desc(schema.customers.createdAt));
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(schema.customers).where(eq(schema.customers.id, id));
    return customer;
  }

  async getCustomerByUserId(userId: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(schema.customers).where(eq(schema.customers.userId, userId));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const now = new Date();
    const [newCustomer] = await db.insert(schema.customers).values({ 
      id, 
      ...customer,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newCustomer;
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | undefined> {
    const [updatedCustomer] = await db.update(schema.customers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.customers.id, id))
      .returning();
    return updatedCustomer;
  }

  // Customer Addresses
  async getCustomerAddresses(customerId: string): Promise<CustomerAddress[]> {
    return await db.select().from(schema.customerAddresses)
      .where(eq(schema.customerAddresses.customerId, customerId));
  }

  async createCustomerAddress(address: InsertCustomerAddress): Promise<CustomerAddress> {
    const id = randomUUID();
    const [newAddress] = await db.insert(schema.customerAddresses).values({ id, ...address }).returning();
    return newAddress;
  }

  async updateCustomerAddress(id: string, updates: Partial<CustomerAddress>): Promise<CustomerAddress | undefined> {
    const [updatedAddress] = await db.update(schema.customerAddresses)
      .set(updates)
      .where(eq(schema.customerAddresses.id, id))
      .returning();
    return updatedAddress;
  }

  async deleteCustomerAddress(id: string): Promise<boolean> {
    const result = await db.delete(schema.customerAddresses).where(eq(schema.customerAddresses.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Payments
  async getOrderPayments(orderId: string): Promise<Payment[]> {
    return await db.select().from(schema.payments)
      .where(eq(schema.payments.orderId, orderId))
      .orderBy(desc(schema.payments.createdAt));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(schema.payments).where(eq(schema.payments.id, id));
    return payment;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const [newPayment] = await db.insert(schema.payments).values({ 
      id, 
      ...payment,
      createdAt: new Date()
    }).returning();
    return newPayment;
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment | undefined> {
    const [updatedPayment] = await db.update(schema.payments)
      .set(updates)
      .where(eq(schema.payments.id, id))
      .returning();
    return updatedPayment;
  }

  // Shipments
  async getOrderShipments(orderId: string): Promise<Shipment[]> {
    return await db.select().from(schema.shipments)
      .where(eq(schema.shipments.orderId, orderId))
      .orderBy(desc(schema.shipments.createdAt));
  }

  async getShipment(id: string): Promise<Shipment | undefined> {
    const [shipment] = await db.select().from(schema.shipments).where(eq(schema.shipments.id, id));
    return shipment;
  }

  async createShipment(shipment: InsertShipment): Promise<Shipment> {
    const id = randomUUID();
    const now = new Date();
    const [newShipment] = await db.insert(schema.shipments).values({ 
      id, 
      ...shipment,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newShipment;
  }

  async updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment | undefined> {
    const [updatedShipment] = await db.update(schema.shipments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.shipments.id, id))
      .returning();
    return updatedShipment;
  }

  // Reservations
  async getAllReservations(): Promise<Reservation[]> {
    return await db.select().from(schema.reservations).orderBy(desc(schema.reservations.createdAt));
  }

  async getReservation(id: string): Promise<Reservation | undefined> {
    const [reservation] = await db.select().from(schema.reservations).where(eq(schema.reservations.id, id));
    return reservation;
  }

  async getUserReservations(userId: string): Promise<Reservation[]> {
    return await db.select().from(schema.reservations)
      .where(eq(schema.reservations.userId, userId))
      .orderBy(desc(schema.reservations.createdAt));
  }

  async createReservation(reservation: InsertReservation): Promise<Reservation> {
    const id = randomUUID();
    const [newReservation] = await db.insert(schema.reservations).values({ 
      id, 
      ...reservation, 
      createdAt: new Date() 
    }).returning();
    return newReservation;
  }

  async updateReservation(id: string, updates: Partial<Reservation>): Promise<Reservation | undefined> {
    try {
      console.log('Database updateReservation:', id, updates);
      
      // Ensure we're only updating allowed fields
      const allowedFields = ['name', 'email', 'phone', 'service', 'date', 'timeSlot', 'status', 'notes'];
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([key]) => allowedFields.includes(key))
      );
      
      console.log('Clean updates for DB:', cleanUpdates);
      
      const [updatedReservation] = await db.update(schema.reservations)
        .set({
          ...cleanUpdates,
          updatedAt: new Date()
        })
        .where(eq(schema.reservations.id, id))
        .returning();
      return updatedReservation;
    } catch (error) {
      console.error('Database error updating reservation:', error);
      throw error;
    }
  }

  async deleteReservation(id: string): Promise<boolean> {
    const result = await db.delete(schema.reservations).where(eq(schema.reservations.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getReservationsForDate(date: string): Promise<Reservation[]> {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    
    return await db.select()
      .from(schema.reservations)
      .where(and(
        sql`date(${schema.reservations.date}) = ${date}`,
        eq(schema.reservations.status, 'confirmed')
      ))
      .orderBy(asc(schema.reservations.date));
  }

  // Email Configuration
  async getEmailConfig(): Promise<EmailConfig | undefined> {
    const [config] = await db.select().from(schema.emailConfig)
      .orderBy(desc(schema.emailConfig.updatedAt))
      .limit(1);
    return config;
  }

  async updateEmailConfig(configData: InsertEmailConfig): Promise<EmailConfig> {
    const existingConfig = await this.getEmailConfig();
    
    if (existingConfig) {
      const [updatedConfig] = await db.update(schema.emailConfig)
        .set({
          ...configData,
          updatedAt: new Date()
        })
        .where(eq(schema.emailConfig.id, existingConfig.id))
        .returning();
      return updatedConfig;
    } else {
      const id = randomUUID();
      const [newConfig] = await db.insert(schema.emailConfig)
        .values({
          id,
          ...configData,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      return newConfig;
    }
  }

  async updateEmailTestStatus(status: 'success' | 'failed' | 'pending'): Promise<void> {
    const existingConfig = await this.getEmailConfig();
    if (existingConfig) {
      await db.update(schema.emailConfig)
        .set({
          testStatus: status,
          lastTested: new Date(),
          updatedAt: new Date()
        })
        .where(eq(schema.emailConfig.id, existingConfig.id));
    }
  }

  // Reservation Settings
  async getReservationSettings(): Promise<ReservationSettings | undefined> {
    try {
      const [settings] = await db.select()
        .from(schema.reservationSettings)
        .orderBy(desc(schema.reservationSettings.updatedAt))
        .limit(1);
      
      // Create default settings if none exist
      if (!settings) {
        const defaultBusinessHours = {
          monday: { enabled: true, open: "09:00", close: "17:00" },
          tuesday: { enabled: true, open: "09:00", close: "17:00" },
          wednesday: { enabled: true, open: "09:00", close: "17:00" },
          thursday: { enabled: true, open: "09:00", close: "17:00" },
          friday: { enabled: true, open: "09:00", close: "17:00" },
          saturday: { enabled: false, open: "09:00", close: "17:00" },
          sunday: { enabled: false, open: "09:00", close: "17:00" }
        };
        
        const id = randomUUID();
        const [defaultSettings] = await db.insert(schema.reservationSettings)
          .values({
            id,
            businessHours: defaultBusinessHours,
            defaultDuration: 60,
            bufferTime: 15,
            maxAdvanceDays: 30,
            allowedServices: ["Consulta general", "Cita especializada", "Reunión"],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .returning();
        return defaultSettings;
      }
      
      return settings;
    } catch (error) {
      console.error("Error fetching reservation settings:", error);
      return undefined;
    }
  }

  async createReservationSettings(settings: InsertReservationSettings): Promise<ReservationSettings> {
    const id = randomUUID();
    const [newSettings] = await db.insert(schema.reservationSettings).values({
      id,
      ...settings,
      updatedAt: new Date()
    }).returning();
    return newSettings;
  }

  async updateReservationSettings(updates: Partial<ReservationSettings>): Promise<ReservationSettings | undefined> {
    try {
      const currentSettings = await this.getReservationSettings();
      
      let newSettings: ReservationSettings;
      if (currentSettings) {
        const [updatedSettings] = await db.update(schema.reservationSettings)
          .set({ ...updates, updatedAt: new Date() })
          .where(eq(schema.reservationSettings.id, currentSettings.id))
          .returning();
        newSettings = updatedSettings;
      } else {
        const defaultBusinessHours = {
          monday: { enabled: true, open: "09:00", close: "17:00" },
          tuesday: { enabled: true, open: "09:00", close: "17:00" },
          wednesday: { enabled: true, open: "09:00", close: "17:00" },
          thursday: { enabled: true, open: "09:00", close: "17:00" },
          friday: { enabled: true, open: "09:00", close: "17:00" },
          saturday: { enabled: false, open: "09:00", close: "17:00" },
          sunday: { enabled: false, open: "09:00", close: "17:00" }
        };
        
        const id = randomUUID();
        const [createdSettings] = await db.insert(schema.reservationSettings)
          .values({ 
            id, 
            businessHours: updates.businessHours || defaultBusinessHours,
            defaultDuration: updates.defaultDuration || 60,
            bufferTime: updates.bufferTime || 15,
            maxAdvanceDays: updates.maxAdvanceDays || 30,
            allowedServices: updates.allowedServices || ["Consulta general", "Cita especializada"],
            isActive: updates.isActive !== undefined ? updates.isActive : true,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .returning();
        newSettings = createdSettings;
      }
      
      return newSettings;
    } catch (error) {
      console.error("Error updating reservation settings:", error);
      return undefined;
    }
  }

  // Sections
  async getAllSections(): Promise<Section[]> {
    return await db.select().from(schema.sections).orderBy(asc(schema.sections.order));
  }

  async getSection(id: string): Promise<Section | undefined> {
    const [section] = await db.select().from(schema.sections).where(eq(schema.sections.id, id));
    return section;
  }

  async createSection(section: InsertSection): Promise<Section> {
    const id = randomUUID();
    const [newSection] = await db.insert(schema.sections).values({ id, ...section }).returning();
    return newSection;
  }

  async updateSection(id: string, updates: Partial<Section>): Promise<Section | undefined> {
    const [updatedSection] = await db.update(schema.sections)
      .set(updates)
      .where(eq(schema.sections.id, id))
      .returning();
    return updatedSection;
  }

  async deleteSection(id: string): Promise<boolean> {
    const result = await db.delete(schema.sections).where(eq(schema.sections.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Blog Posts implementation
  async getAllBlogPosts(): Promise<BlogPost[]> {
    const posts = await db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt));
    return posts.map(post => ({
      ...post,
      authorName: 'Admin' // Add default author name
    }));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.id, id));
    return post ? { ...post, authorName: 'Admin' } : undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, slug));
    return post ? { ...post, authorName: 'Admin' } : undefined;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const now = new Date();
    const [newPost] = await db.insert(schema.blogPosts).values({ 
      id, 
      ...post, 
      createdAt: now,
      updatedAt: now
    }).returning();
    return { ...newPost, authorName: 'Admin' };
  }

  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | undefined> {
    // Clean the updates to remove timestamp fields that should be auto-managed
    const { createdAt, updatedAt, ...cleanUpdates } = updates as any;
    
    const [updatedPost] = await db.update(schema.blogPosts)
      .set({ 
        ...cleanUpdates, 
        updatedAt: new Date() 
      })
      .where(eq(schema.blogPosts.id, id))
      .returning();
    return updatedPost ? { ...updatedPost, authorName: 'Admin' } : undefined;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async incrementBlogPostViews(id: string): Promise<boolean> {
    try {
      await db.update(schema.blogPosts)
        .set({ 
          views: sql`COALESCE(${schema.blogPosts.views}, 0) + 1`,
          updatedAt: new Date()
        })
        .where(eq(schema.blogPosts.id, id));
      return true;
    } catch (error) {
      console.error('Error incrementing blog post views:', error);
      return false;
    }
  }

  // Page Customizations
  async getPageCustomization(pageId: string, userId: string): Promise<PageCustomization | undefined> {
    const [customization] = await db.select()
      .from(schema.pageCustomizations)
      .where(and(
        eq(schema.pageCustomizations.pageId, pageId),
        eq(schema.pageCustomizations.userId, userId),
        eq(schema.pageCustomizations.isActive, true)
      ));
    return customization;
  }

  async getPageCustomizations(userId: string): Promise<PageCustomization[]> {
    return await db.select()
      .from(schema.pageCustomizations)
      .where(and(
        eq(schema.pageCustomizations.userId, userId),
        eq(schema.pageCustomizations.isActive, true)
      ))
      .orderBy(desc(schema.pageCustomizations.updatedAt));
  }

  async createPageCustomization(customization: InsertPageCustomization): Promise<PageCustomization> {
    const id = randomUUID();
    const now = new Date();
    const [newCustomization] = await db.insert(schema.pageCustomizations).values({
      id,
      ...customization,
      createdAt: now,
      updatedAt: now
    }).returning();
    return newCustomization;
  }

  async updatePageCustomization(pageId: string, userId: string, updates: Partial<PageCustomization>): Promise<PageCustomization | undefined> {
    const [updatedCustomization] = await db.update(schema.pageCustomizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(
        eq(schema.pageCustomizations.pageId, pageId),
        eq(schema.pageCustomizations.userId, userId)
      ))
      .returning();
    return updatedCustomization;
  }

  async deletePageCustomization(pageId: string, userId: string): Promise<boolean> {
    try {
      await db.update(schema.pageCustomizations)
        .set({ isActive: false })
        .where(and(
          eq(schema.pageCustomizations.pageId, pageId),
          eq(schema.pageCustomizations.userId, userId)
        ));
      return true;
    } catch (error) {
      console.error('Error deleting page customization:', error);
      return false;
    }
  }

  // Visual Customizations for inline editor
  async getVisualCustomizations(pageId: string): Promise<VisualCustomization[]> {
    return await db.select()
      .from(schema.visualCustomizations)
      .where(eq(schema.visualCustomizations.pageId, pageId))
      .orderBy(desc(schema.visualCustomizations.updatedAt));
  }

  async getVisualCustomization(elementSelector: string, pageId: string): Promise<VisualCustomization | undefined> {
    const [customization] = await db.select()
      .from(schema.visualCustomizations)
      .where(and(
        eq(schema.visualCustomizations.elementSelector, elementSelector),
        eq(schema.visualCustomizations.pageId, pageId)
      ));
    return customization;
  }

  async createVisualCustomization(customization: InsertVisualCustomization): Promise<VisualCustomization> {
    const id = randomUUID();
    const now = new Date();
    
    // First check if customization exists
    const existing = await this.getVisualCustomization(customization.elementSelector, customization.pageId);
    
    if (existing) {
      // Update existing
      const [updated] = await db.update(schema.visualCustomizations)
        .set({ 
          value: customization.value,
          property: customization.property,
          userId: customization.userId,
          updatedAt: now 
        })
        .where(eq(schema.visualCustomizations.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new
      const [newCustomization] = await db.insert(schema.visualCustomizations).values({
        id,
        ...customization,
        createdAt: now,
        updatedAt: now
      }).returning();
      return newCustomization;
    }
  }

  async saveVisualCustomization(customization: InsertVisualCustomization): Promise<VisualCustomization> {
    const id = randomUUID();
    const now = new Date();
    
    // First check if customization exists
    const existing = await this.getVisualCustomization(customization.elementSelector, customization.pageId);
    
    if (existing) {
      // Update existing
      const [updated] = await db.update(schema.visualCustomizations)
        .set({ 
          value: customization.value,
          property: customization.property,
          updatedBy: customization.updatedBy,
          updatedAt: now 
        })
        .where(eq(schema.visualCustomizations.id, existing.id))
        .returning();
      return updated;
    } else {
      // Create new
      const [newCustomization] = await db.insert(schema.visualCustomizations).values({
        id,
        ...customization,
        createdAt: now,
        updatedAt: now
      }).returning();
      return newCustomization;
    }
  }

  async updateVisualCustomization(id: string, updates: Partial<VisualCustomization>): Promise<VisualCustomization | undefined> {
    const [updatedCustomization] = await db.update(schema.visualCustomizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(schema.visualCustomizations.id, id))
      .returning();
    return updatedCustomization;
  }

  async deleteVisualCustomization(id: string): Promise<boolean> {
    const result = await db.delete(schema.visualCustomizations)
      .where(eq(schema.visualCustomizations.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async deleteAllVisualCustomizations(pageId: string): Promise<boolean> {
    try {
      await db.delete(schema.visualCustomizations)
        .where(eq(schema.visualCustomizations.pageId, pageId));
      return true;
    } catch (error) {
      console.error('Error deleting visual customizations:', error);
      return false;
    }
  }

  // Payment Configuration
  async getPaymentConfig(): Promise<PaymentConfig | undefined> {
    try {
      const [config] = await db.select().from(schema.paymentConfig).limit(1);
      return config;
    } catch (error) {
      console.error('Error getting payment config:', error);
      return undefined;
    }
  }

  async updatePaymentConfig(configData: InsertPaymentConfig): Promise<PaymentConfig> {
    try {
      // Check if config exists
      const existing = await this.getPaymentConfig();
      
      if (existing) {
        // Update existing config
        const [updated] = await db.update(schema.paymentConfig)
          .set({ ...configData, updatedAt: new Date() })
          .where(eq(schema.paymentConfig.id, existing.id))
          .returning();
        return updated;
      } else {
        // Create new config
        const [created] = await db.insert(schema.paymentConfig)
          .values(configData)
          .returning();
        return created;
      }
    } catch (error) {
      console.error('Error updating payment config:', error);
      throw error;
    }
  }
}

export const storage = new DatabaseStorage();