# DOGE - Department of Government Efficiency Investment Platform

A professional cryptocurrency investment platform operated by the Department of Government Efficiency (DOGE) with comprehensive user management, analytics, and administrative capabilities.

## 🚀 Features

### User Features
- **User Authentication**: Secure login/registration with Supabase Auth
- **Investment Plans**: Multiple tiers (Starter, Professional, Premium, VIP)
- **Portfolio Management**: Track investments and returns
- **Deposit/Withdrawal**: Cryptocurrency transactions
- **Referral System**: Multi-level referral program
- **KYC Verification**: Document upload and verification
- **Real-time Notifications**: Account updates and alerts

### Admin Features
- **Comprehensive Dashboard**: Overview of platform metrics
- **User Analytics**: Track user signups and growth over time
- **User Management**: View, edit, and manage all users
- **Transaction Management**: Handle deposits, withdrawals, and payments
- **KYC Management**: Review and approve verification documents
- **Settings**: Configure platform settings and features

## 📊 User Signup Analytics

The platform includes comprehensive user signup analytics:

### Database Views
- `daily_signups` - Daily registration counts
- `weekly_signups` - Weekly signup trends
- `monthly_signups` - Monthly user acquisition

### Analytics Dashboard
Access via: **Admin → USER MANAGEMENT → User analytics**

**Key Metrics:**
- Total registered users
- Today's signups
- Weekly growth rate
- Period comparisons (Daily/Weekly/Monthly)
- Cumulative growth tracking

## 🛠️ Setup Instructions

### 1. Database Setup
1. Click the **Supabase button** in project settings (⚙️ icon)
2. This will automatically:
   - Create a Supabase project
   - Run database migrations
   - Set up environment variables

### 2. Database Schema
The database includes these key tables:
- `profiles` - User information and balances
- `investment_plans` - Available investment tiers
- `user_investments` - User investment tracking
- `transactions` - All financial transactions
- `referrals` - Referral tracking
- `notifications` - User notifications
- `kyc_verifications` - Document verification

### 3. Admin Access
- **URL**: `/admin/login`
- **Email**: `admin@doge.com`
- **Password**: `admin123`

### 4. User Access
- **URL**: `/login`
- **Demo Email**: `gareldiavelle@yahoo.com`
- **Demo Password**: `password`

## 🔧 Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Routing**: React Router
- **Icons**: Heroicons + Lucide React
- **Build**: Vite
- **Deployment**: Bolt Hosting

## 📈 Analytics Features

### Real-Time Metrics
- User registration tracking
- Growth rate calculations
- Period-over-period comparisons
- Cumulative user counts

### Database Functions
- `get_signup_stats()` - Returns comprehensive signup statistics
- `get_signups_by_date_range()` - Custom date range queries

### Visualizations
- Signup trend tables
- Growth rate indicators
- User acquisition charts
- Daily/weekly/monthly breakdowns

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- User data isolation
- Admin role-based access control
- Secure authentication with Supabase Auth

## 🚀 Deployment

The platform is deployed at: https://trustwallsafe.me

To redeploy or update:
1. Make changes to the code
2. The site will automatically rebuild and deploy

## 📱 Mobile Responsive

- Fully responsive design
- Mobile-friendly navigation
- Touch-optimized interface
- Bottom navigation for mobile users

## 🎯 Getting Started

1. **Set up database**: Click Supabase button in settings
2. **Access admin panel**: Go to `/admin/login`
3. **View analytics**: Navigate to User analytics page
4. **Start tracking**: User signups will be automatically tracked

The platform is ready to use and will start tracking user signups immediately once the database is connected!