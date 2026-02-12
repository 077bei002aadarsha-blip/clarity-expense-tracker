'# Clarity - Personal Expense Tracker 💰

A full-stack expense tracking application that helps users manage their finances with real-time insights, advanced filtering, and a modern dark mode interface.

## 🚀 Live Demo

**Frontend:** [https://clarity-expense-tracker-cyan.vercel.app](https://clarity-expense-tracker-cyan.vercel.app)  
**Backend API:** [https://clarity-expense-tracker-production-fe4f.up.railway.app/api](https://clarity-expense-tracker-production-fe4f.up.railway.app/api)  
**Database:** PostgreSQL hosted on Railway

## ✨ Features

### Core Functionality
- ✅ **Complete CRUD Operations** - Add, view, edit, and delete transactions
- ✅ **User Authentication** - Secure JWT-based authentication with bcrypt password hashing
- ✅ **Real-Time Calculations** - Automatic calculation of total income, expenses, and balance
- ✅ **Advanced Filtering** - Filter transactions by type (income/expense), category, and date range
- ✅ **Dashboard Overview** - Visual summary with color-coded financial metrics

### Standout Features
- 🌙 **Dark Mode** - Persistent theme preference with localStorage
- 📱 **Responsive Design** - Optimized for both mobile and desktop
- 🔒 **Secure API** - Protected routes with JWT middleware
- 🎨 **Modern UI** - Clean, professional interface with Material Design principles
- ⚡ **Fast Performance** - Optimized React components with efficient state management

## 🛠️ Tech Stack

### Frontend
- **React 19.2.4** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **React Router v7** - Client-side routing
- **Axios** - HTTP client with interceptors
- **CSS3** - Custom styling with dark mode support

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend and database hosting

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (see `.env.example`):
```env
DATABASE_URL=postgresql://username:password@localhost:5432/clarity_db
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

4. Run database migrations (if applicable) or create tables manually

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (see `.env.example`):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
clarity-expense-tracker/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # Database configuration
│   │   ├── controllers/
│   │   │   ├── authController.ts    # Authentication logic
│   │   │   └── transactionController.ts
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts    # JWT verification
│   │   ├── models/                  # Database models
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── transactionRoutes.ts
│   │   └── server.ts                # Express app entry point
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.tsx   # Route guard component
    │   ├── context/
    │   │   └── AuthContext.tsx      # Global auth state
    │   ├── pages/
    │   │   ├── Login.tsx
    │   │   ├── Signup.tsx
    │   │   └── Dashboard.tsx        # Main application
    │   ├── services/
    │   │   └── api.ts               # API service layer
    │   ├── App.tsx                  # Root component
    │   └── index.tsx
    ├── package.json
    └── tsconfig.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Transactions (Protected)
- `GET /api/transactions` - Get all user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## 🎯 Key Features Implementation

### Authentication Flow
1. User signs up → Password hashed with bcrypt → JWT token generated
2. Token stored in localStorage
3. Axios interceptor adds token to all API requests
4. Protected routes verify token before rendering

### Dark Mode
- State managed with React useState
- Preference persisted in localStorage
- Dynamic color scheme applied across all components
- Smooth transitions between themes

### Transaction Management
- Real-time CRUD operations
- Client-side filtering for instant results
- Optimistic updates for better UX
- Error handling with user-friendly messages

## 🚀 Deployment

### Frontend (Vercel)
1. Connected to GitHub repository: `077bei002aadarsha-blip/clarity-expense-tracker`
2. Root directory: `frontend`
3. Framework preset: Create React App
4. Build command: `npm run build`
5. Output directory: `build`
6. Environment variable: 
   - `REACT_APP_API_URL=https://clarity-expense-tracker-production-fe4f.up.railway.app/api`

**Live URL:** https://clarity-expense-tracker-cyan.vercel.app

### Backend (Railway)
1. Connected to GitHub repository: `077bei002aadarsha-blip/clarity-expense-tracker`
2. Root directory: `backend`
3. PostgreSQL database provisioned and connected automatically
4. Environment variables configured:
   - `DATABASE_URL` (auto-generated by Railway PostgreSQL)
   - `JWT_SECRET` (manually added for security)
   - `PORT` (auto-assigned by Railway)

**API URL:** https://clarity-expense-tracker-production-fe4f.up.railway.app/api

### Database (PostgreSQL on Railway)
- Managed PostgreSQL database hosted on Railway
- Automatic backups and scaling
- Connected to backend service via `DATABASE_URL` environment variable
- Tables created automatically on first backend deployment

## 📝 Development Process

### Day 1: Foundation
- Set up project structure
- Implemented backend API with Express and PostgreSQL
- Created authentication system with JWT
- Built API service layer with axios interceptors

### Day 2: Core Features
- Developed Login and Signup pages
- Created Dashboard with CRUD operations
- Implemented filters and calculations
- Added protected routes with AuthContext

### Day 3: Polish & Deploy
- Fixed API response handling bug
- Implemented dark mode across all pages
- Enhanced UI with professional styling
- Deployed to Vercel and Railway

## 🎨 Design Decisions

- **Color Scheme**: Bright green for income, red for expenses, blue for balance - visible in both light and dark modes
- **Card Layout**: Modern card-based design with shadows for depth
- **Responsive**: Mobile-first approach with grid layouts
- **Performance**: Efficient state management to minimize re-renders

## 🔮 Future Enhancements

If I had more time, I would add:
- 📊 Charts and graphs (Chart.js/Recharts) for visual spending analysis
- 🤖 AI-powered expense categorization with OpenAI API
- 📱 Progressive Web App (PWA) support for offline access
- 💾 Export transactions as CSV/PDF reports
- 🔔 Budget tracking with spending alerts
- 📷 Receipt upload with OCR for automatic entry
- 🌍 Multi-currency support
- 📧 Email notifications for financial summaries

## 👨‍💻 Author

**Aadarsha Thapa Magar**  
- Email: thapamagaraadarsha97@gmail.com
- GitHub: [@077bei002aadarsha-blip](https://github.com/077bei002aadarsha-blip)

## 📄 License

This project was created as part of a Software Engineering Intern assignment for demonstration purposes.

---

**Built with ❤️ using React, TypeScript, Node.js, and PostgreSQL**'
