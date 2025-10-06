# Laptop Shop - React Frontend (JavaScript)

## 🚀 Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and dev server
- **Ant Design 5** - UI component library
- **React Router DOM 6** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **JavaScript (ES6+)** - No TypeScript

## 📁 Project Structure

```
src/
├── config/
│   └── api.js                 # Axios configuration
├── components/
│   ├── layout/
│   │   ├── AdminLayout.js     # Admin sidebar layout
│   │   └── Navbar.js          # Main navigation
│   └── ProtectedRoute.js      # Route protection
├── contexts/
│   └── AuthContext.js         # Authentication context
├── pages/
│   ├── admin/                 # Admin pages
│   │   ├── Dashboard.js       # Admin dashboard
│   │   ├── Products.js        # Product management
│   │   └── Users.js           # User management
│   ├── HomePage.js            # Home page
│   ├── LoginPage.js           # Login page
│   ├── RegisterPage.js        # Registration page
│   ├── ProductPage.js         # Product listing
│   ├── ProductDetailPage.js   # Product details
│   ├── CartPage.js            # Shopping cart
│   ├── CheckoutPage.js        # Checkout process
│   ├── OrderPage.js           # Order history
│   └── ProfilePage.js         # User profile
├── App.js                     # Main app component
└── main.jsx                   # Entry point
```

## 🔧 Configuration

### API Configuration
- **Base URL**: `http://localhost:8080/api/v1`
- **Authentication**: JWT Bearer token
- **Auto token refresh**: Handled by axios interceptors

### Routing
- **Public routes**: `/`, `/products`, `/login`, `/register`
- **Protected routes**: `/cart`, `/checkout`, `/orders`, `/profile`
- **Admin routes**: `/admin/*` (requires ADMIN role)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running on port 8080

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🔐 Authentication

### Features
- JWT token-based authentication
- Automatic token refresh
- Role-based access control (USER/ADMIN)
- Protected routes
- Auto-logout on token expiry

### Usage
```javascript
import { useAuth } from './contexts/AuthContext';

const { user, login, logout, isAdmin } = useAuth();
```

## 🎨 Admin Panel

### Available Pages
- **Dashboard** (`/admin/dashboard`) - Statistics and overview
- **Products** (`/admin/products`) - Product management (CRUD)
- **Users** (`/admin/users`) - User management

### Features
- Responsive sidebar navigation
- Data tables with pagination
- Modal forms for CRUD operations
- Role-based permissions

## 📱 Responsive Design

- Mobile-first approach
- Ant Design responsive grid system
- Collapsible admin sidebar
- Touch-friendly interface

## 🔌 API Integration

### Example API calls:
```javascript
import api from './config/api';

// Get products
const products = await api.get('/products');

// Create product (admin only)
const newProduct = await api.post('/products', productData);

// Update user profile
const updatedUser = await api.put('/auth/profile', userData);
```

## 🎯 Key Features

- **Pure JavaScript** - No TypeScript complexity
- **Modern React patterns** (Hooks, Context, Functional components)
- **Optimized performance** with React.memo and useMemo
- **Error boundaries** for graceful error handling
- **Loading states** and user feedback
- **Form validation** with Ant Design
- **Responsive design** for all devices

## 🚀 Deployment

### Build for production:
```bash
npm run build
```

### Deploy to static hosting:
- Copy `dist/` folder to your hosting service
- Configure API base URL for production
- Set up environment variables if needed

## 📝 Environment Variables

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_NAME=Laptop Shop
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.