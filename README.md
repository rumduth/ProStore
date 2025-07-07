# 🛍️ ProStore - Modern E-commerce Platform

A full-featured, modern e-commerce platform built with Next.js 15, featuring a complete shopping experience with admin dashboard, user management, and multiple payment options.

![ProStore Homepage](./project-images/Screenshot%202025-07-07%20at%2012.30.42%20PM.png)

## 🌐 Live Demo

**[Visit ProStore Live](https://pro-store-puce.vercel.app/)**

## ✨ Features

### 🛒 Customer Features

- **Product Browsing**: Browse products with advanced filtering and search
- **Shopping Cart**: Add/remove items with persistent cart across sessions
- **User Authentication**: Secure login/register with NextAuth.js
- **Order Management**: Complete checkout process with order tracking
- **Product Reviews**: Rate and review products with verified purchase badges
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Theme switching with system preference detection

### 💳 Payment Integration

- **Multiple Payment Methods**: PayPal, Stripe, and Cash on Delivery
- **Secure Transactions**: PCI-compliant payment processing
- **Order Confirmation**: Email receipts and order confirmations

### 👨‍💼 Admin Dashboard

- **Product Management**: Create, edit, and manage product inventory
- **Order Management**: View and update order status
- **User Management**: Manage customer accounts and roles
- **Analytics Dashboard**: Sales overview and performance metrics
- **Inventory Tracking**: Real-time stock management

![Admin Dashboard](./project-images/Screenshot%202025-07-07%20at%2012.30.52%20PM.png)

### 🔐 Security & Authentication

- **Role-based Access Control**: Admin and user role management
- **Protected Routes**: Secure checkout and admin areas
- **Session Management**: Persistent login sessions
- **Password Encryption**: Secure password hashing

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Next Themes** - Dark/light mode support

### Backend & Database

- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Robust relational database
- **Neon Database** - Serverless PostgreSQL
- **NextAuth.js** - Authentication solution

### Payments & Services

- **Stripe** - Credit card processing
- **PayPal** - PayPal payments integration
- **UploadThing** - File upload service
- **Resend** - Email delivery service
- **React Email** - Email template system

### Development & Testing

- **Jest** - Testing framework
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Zod** - Schema validation

## 📸 Screenshots

### Product Catalog

![Product Catalog](./project-images/Screenshot%202025-07-07%20at%2012.31.07%20PM.png)

### Shopping Cart & Checkout

![Shopping Cart](./project-images/Screenshot%202025-07-07%20at%2012.31.19%20PM.png)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (or Neon account)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/rumduth/ProStore.git
   cd ProStore
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="your_postgresql_connection_string"

   # NextAuth
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"

   # Payment Providers
   PAYPAL_CLIENT_ID="your_paypal_client_id"
   PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
   STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
   STRIPE_SECRET_KEY="your_stripe_secret_key"
   STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"

   # File Upload
   UPLOADTHING_SECRET="your_uploadthing_secret"
   UPLOADTHING_APP_ID="your_uploadthing_app_id"

   # Email
   RESEND_API_KEY="your_resend_api_key"
   SENDER_EMAIL="your_sender_email"

   # App Configuration
   NEXT_PUBLIC_APP_NAME="ProStore"
   NEXT_PUBLIC_APP_DESCRIPTION="A modern ecommerce store built with NextJs"
   NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

   # Default Test Credentials (Development)
   DEFAULT_TEST_EMAIL="admin@example.com"
   DEFAULT_TEST_PASSWORD="123456"
   DEFAULT_TEST_NAME="Admin User"

   # Payment Methods (comma-separated)
   PAYMENT_METHODS="PayPal, Stripe, CashOnDelivery"
   DEFAULT_PAYMENT_METHOD="PayPal"

   # Pagination
   PAGE_SIZE="10"
   LATEST_PRODUCTS_LIMIT="4"

   # User Roles
   USER_ROLES="admin, user"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Seed the database with sample data
   npm run seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Default Admin Account

- **Email**: duth@gmail.com
- **Password**: 123456

## 📁 Project Structure

```
pro-store/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (root)/            # Public pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   └── user/              # User account pages
├── components/            # Reusable components
│   ├── admin/             # Admin-specific components
│   ├── shared/            # Shared components
│   └── ui/                # UI components (Radix UI)
├── lib/                   # Utility functions
│   ├── actions/           # Server actions
│   └── constants/         # App constants
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── types/                 # TypeScript type definitions
└── tests/                 # Test files
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📧 Email Templates

The project includes responsive email templates for:

- Order confirmations
- Purchase receipts
- Account notifications

Preview emails in development:

```bash
npm run email
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run email` - Preview email templates
- `npx prisma studio` - Open Prisma Studio (database GUI)

## 🌟 Key Features Explained

### Cart Management

- Persistent cart across browser sessions
- Automatic cart merging when users log in
- Real-time price calculations including tax and shipping

### Order Processing

- Multi-step checkout process
- Address validation
- Payment method selection
- Order confirmation emails

### Admin Dashboard

- Real-time sales analytics
- Product inventory management
- Order status updates
- User role management

### Security

- Protected API routes
- Role-based access control
- Secure payment processing
- Input validation with Zod

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://prisma.io/) for the excellent ORM
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://radix-ui.com/) for accessible component primitives
- [Stripe](https://stripe.com/) and [PayPal](https://paypal.com/) for payment processing

## 📞 Support

If you have any questions or need help with setup, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and modern web technologies**
