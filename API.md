# Complete REST API Reference

All API requests and responses use JSON format. Monetary values are integers denominated in **paisa** (`100 paisa = ₹1.00`).

Base URL: `/api`

---

## 1. Storefront Public & Customer APIs

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new customer account (`name`, `email`, `password`, `phone`) | No |
| `POST` | `/api/auth/login` | Log in customer (`email`, `password`) | No |
| `POST` | `/api/auth/refresh` | Exchange refresh token cookie for new access token | Cookie |
| `POST` | `/api/auth/logout` | Log out customer and invalidate refresh token | Bearer Token |
| `GET` | `/api/auth/me` | Fetch logged-in customer profile | Bearer Token |
| `PUT` | `/api/auth/me` | Update customer profile (`name`, `phone`) | Bearer Token |
| `GET` | `/api/auth/addresses` | Fetch saved shipping addresses | Bearer Token |
| `POST` | `/api/auth/addresses` | Add new shipping address | Bearer Token |
| `DELETE` | `/api/auth/addresses/:id` | Delete saved shipping address | Bearer Token |

### Products & Catalog (`/api/products`, `/api/categories`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/products` | Browse products with filters (`categoryId`, `search`, `minPrice`, `maxPrice`, `page`, `pageSize`, `sort`) | No |
| `GET` | `/api/products/:slug` | Get full product details by slug with variants, images, and reviews | No |
| `GET` | `/api/categories` | List active store categories | No |
| `GET` | `/api/categories/:slug` | Get category details by slug | No |

### Cart & Checkout (`/api/cart`, `/api/checkout`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/cart/calculate` | Calculate cart pricing, subtotal, shipping fee, COD charge, and coupon discount | Optional |
| `POST` | `/api/checkout` | Place order (COD or initialize Razorpay online order) | Optional |

### Orders & Tracking (`/api/orders`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/orders` | List logged-in customer's order history | Bearer Token |
| `GET` | `/api/orders/:id` | Get customer order details | Bearer Token |
| `GET` | `/api/orders/track` | Public order tracking lookup (`orderNumber`, `contact` phone/email) | No |

### Payments & Webhooks (`/api/payments`, `/api/webhooks`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/payments/verify` | Verify Razorpay payment signature after customer pays | Optional |
| `POST` | `/api/webhooks/razorpay` | Razorpay server-to-server webhook endpoint (HMAC verified) | Webhook Secret |

### Store Settings & Content (`/api/settings`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/settings/public` | Public store configuration (branding, colors, contact info, payment methods) | No |
| `GET` | `/api/settings/pages/:slug` | Fetch editable content policy page (`privacy-policy`, `terms`, `about`, `faq`) | No |

---

## 2. Admin Operations APIs (`/api/admin`)

*All `/api/admin/*` endpoints require `Authorization: Bearer <admin_token>` and administrative permissions.*

### Authentication & Dashboard
| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| `POST` | `/api/admin/auth/login` | Admin login | None |
| `POST` | `/api/admin/auth/refresh` | Admin token refresh | Cookie |
| `POST` | `/api/admin/auth/logout` | Admin logout | Bearer Token |
| `GET` | `/api/admin/dashboard` | Dashboard metrics (today's revenue, pending orders, low stock) | Admin |

### Order Management & Manual Fulfillment (`/api/admin/orders`)
| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| `GET` | `/api/admin/orders` | Filterable orders table (`fulfillmentStatus`, `paymentStatus`, `search`) | `manage_orders` |
| `GET` | `/api/admin/orders/:id` | Order details with customer shipping address and supplier links | `manage_orders` |
| `PATCH` | `/api/admin/orders/:id/status` | Update `order_status`, `payment_status`, or `fulfillment_status` | `manage_orders` |
| `POST` | `/api/admin/orders/:id/supplier-order` | Record supplier order placement (Meesho / supplier reference) | `manage_orders` |
| `PATCH` | `/api/admin/orders/:id/tracking` | Save courier name and AWB tracking number, mark shipped | `manage_orders` |
| `PATCH` | `/api/admin/orders/:id/note` | Save internal private admin note | `manage_orders` |

### Products & Catalog (`/api/admin/products`, `/api/admin/categories`)
| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| `GET` | `/api/admin/products` | Manage products list | `manage_products` |
| `POST` | `/api/admin/products` | Create product with supplier mappings | `manage_products` |
| `GET` | `/api/admin/products/:id` | Get product details for editing | `manage_products` |
| `PATCH` | `/api/admin/products/:id` | Update product fields and supplier links | `manage_products` |
| `DELETE` | `/api/admin/products/:id` | Archive / soft-delete product | `manage_products` |
| `POST` | `/api/admin/products/:id/images` | Upload and attach product image | `manage_products` |
| `DELETE` | `/api/admin/products/:id/images/:imageId` | Remove product image | `manage_products` |
| `GET` | `/api/admin/categories` | Manage categories | `manage_categories` |
| `POST` | `/api/admin/categories` | Create new category | `manage_categories` |
| `PATCH` | `/api/admin/categories/:id` | Update category details | `manage_categories` |
| `DELETE` | `/api/admin/categories/:id` | Delete category | `manage_categories` |

### Suppliers, Coupons, Customers & Reviews
| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| `GET` | `/api/admin/suppliers` | List suppliers (Meesho, IndiaMART, vendors) | `manage_suppliers` |
| `POST` | `/api/admin/suppliers` | Create supplier profile | `manage_suppliers` |
| `PATCH` | `/api/admin/suppliers/:id` | Update supplier details | `manage_suppliers` |
| `GET` | `/api/admin/customers` | Customer directory and order totals | `manage_customers` |
| `GET` | `/api/admin/customers/:id` | View customer profile and saved addresses | `manage_customers` |
| `GET` | `/api/admin/coupons` | List promo discount vouchers | `manage_coupons` |
| `POST` | `/api/admin/coupons` | Create coupon rule | `manage_coupons` |
| `PATCH` | `/api/admin/coupons/:id` | Update coupon rule | `manage_coupons` |
| `DELETE` | `/api/admin/coupons/:id` | Delete coupon | `manage_coupons` |
| `GET` | `/api/admin/reviews` | Review moderation queue | `manage_reviews` |
| `PATCH` | `/api/admin/reviews/:id/status` | Approve or reject review | `manage_reviews` |

### Settings & Audit Trail
| Method | Endpoint | Description | Required Permission |
|---|---|---|---|
| `GET` | `/api/admin/settings` | Get all store settings grouped by category | `manage_settings` |
| `PATCH` | `/api/admin/settings/:category` | Bulk update settings in a category | `manage_settings` |
| `GET` | `/api/admin/settings/pages/all` | List all editable policy pages | `manage_content` |
| `PUT` | `/api/admin/settings/pages/:slug` | Upsert policy page HTML/markdown | `manage_content` |
| `GET` | `/api/admin/audit` | View immutable system audit log entries | Super Admin |
