# MERN E-commerce Application

A full-stack e-commerce application built with MongoDB, Express.js, React.js, and Node.js. The project includes a customer-facing frontend, admin dashboard, and backend API with complete e-commerce functionality.

## 🏗️ Project Structure

```
/
├── frontend/     # Customer-facing React application
├── admin/        # Admin dashboard React application  
├── backend/      # Node.js + Express API server
└── package.json  # Root package.json for running all services
```

## ✨ Features

### Backend API
- **Authentication**: JWT-based auth with Gmail OTP verification
- **Products**: Full CRUD operations with categories, search, and filtering
- **Orders**: Order management with status tracking
- **Payments**: Razorpay integration for secure payments
- **Users**: User management with admin controls
- **Offers**: Product-specific discount management

### Frontend (Customer)
- **Product Browsing**: Search, filter, and sort products
- **Shopping Cart**: Add/remove items with quantity management
- **Checkout**: Secure payment processing with Razorpay
- **User Account**: Profile management and order history
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Admin Dashboard
- **Dashboard**: Analytics and overview statistics
- **Product Management**: Add, edit, delete products
- **Order Management**: View and update order status
- **User Management**: View users and manage access
- **Offer Management**: Create and manage product offers

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Gmail account with app password for OTP
- Razorpay account for payments

### Installation

1. **Clone and install dependencies**
```bash
npm run install:all
```

2. **Configure environment variables**

Create `backend/.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

3. **Start all services**
```bash
npm run dev
```

This will start:
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173
- Admin Dashboard: http://localhost:5174

## 📱 Application URLs

- **Customer Frontend**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5174
- **API Documentation**: http://localhost:5000/api

## 🔐 Authentication Setup

### Gmail OTP Configuration
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password: Google Account → Security → App passwords
3. Use the app password in `GMAIL_APP_PASSWORD` environment variable

### Razorpay Setup
1. Create account at https://razorpay.com
2. Get API keys from Dashboard → Settings → API Keys
3. Add keys to environment variables

### Admin Access
Create an admin user by:
1. Register a normal user through the frontend
2. Manually update the user's role to 'admin' in MongoDB
3. Use admin credentials to access the admin dashboard

## 🛠️ Development

### Individual Service Commands
```bash
# Backend only
npm run backend

# Frontend only  
npm run frontend

# Admin only
npm run admin
```

### Build for Production
```bash
npm run build
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and register
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **Secondary**: Green (#22c55e)
- **Accent**: Orange (#f97316)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Inter
- **Weights**: 300, 400, 500, 600, 700
- **Line Heights**: 150% (body), 120% (headings)

### Spacing
- **System**: 8px grid system
- **Breakpoints**: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting (recommended for production)
- Secure payment processing with Razorpay

## 📦 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcryptjs
- **Email**: Nodemailer
- **Payments**: Razorpay
- **Validation**: express-validator

### Frontend & Admin
- **Framework**: React.js
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Charts**: Recharts (Admin)

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use existing MongoDB instance
2. Configure environment variables on hosting platform
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the applications: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or AWS S3
3. Update API URLs in production builds

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Version History

- **v1.0.0**: Initial release with core e-commerce functionality
- Full MERN stack implementation
- Razorpay payment integration
- Gmail OTP authentication
- Admin dashboard with analytics
- Responsive design with Tailwind CSS