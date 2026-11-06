import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import ConnectionStatus from './components/ConnectionStatus';
import SkipLinks from './components/Accessibility/SkipLinks';
import { handleRouteChange } from './utils/focusManagement';

// Add error boundary for debugging
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('React Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary - Error:', error);
    console.error('Error Boundary - Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-900 flex items-center justify-center text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
            <p className="mb-4">Error: {this.state.error?.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 px-4 py-2 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminAccess from './pages/AdminAccess';
import AdminLogin from './pages/Admin/AdminLogin';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageUsers from './pages/Admin/ManageUsers';
import ManualPayments from './pages/Admin/ManualPayments';
import AllPayments from './pages/Admin/AllPayments';
import DepositLog from './pages/Admin/DepositLog';
import DeactiveUsers from './pages/Admin/DeactiveUsers';
import KycSetting from './pages/Admin/KycSetting';
import RejectedWithdraws from './pages/Admin/RejectedWithdraws';
import AcceptedWithdraws from './pages/Admin/AcceptedWithdraws';
import PendingWithdraws from './pages/Admin/PendingWithdraws';
import WithdrawMethod from './pages/Admin/WithdrawMethod';
import UserInterestLog from './pages/Admin/UserInterestLog';
import Profile from './pages/Profile';
import KycVerification from './pages/KycVerification';
import TransactionLog from './pages/TransactionLog';
import Deposit from './pages/Deposit';
import Withdraw from './pages/Withdraw';
import Notifications from './pages/Notifications';
import Portfolio from './pages/Portfolio';
import InvestmentPlans from './pages/InvestmentPlans';
import ReferralLog from './pages/ReferralLog';
import Sidebar from './components/Layout/Sidebar';
import AdminSidebar from './components/Admin/Layout/AdminSidebar';
import Header from './components/Layout/Header';
import AdminHeader from './components/Admin/Layout/AdminHeader';
import BottomNav from './components/Layout/BottomNav';
import AdminDepositLog from './pages/Admin/DepositLog';
import ManageRole from './pages/Admin/ManageRole';
import CommissionLog from './pages/Admin/CommissionLog';
import Schedule from './pages/Admin/Schedule';
import ManagePlan from './pages/Admin/ManagePlan';
import ManageAdmins from './pages/Admin/ManageAdmins';
import AllTickets from './pages/Admin/AllTickets';
import PendingTickets from './pages/Admin/PendingTickets';
import PaymentGateway from './pages/Admin/PaymentGateway';
import ManageReferral from './pages/Admin/ManageReferral';
import CoinsList from './pages/Admin/CoinsList';
import BankPayment from './pages/Admin/BankPayment';
import Flutterwave from './pages/Admin/Flutterwave';
import Paystack from './pages/Admin/Paystack';
import EmailConfigure from './pages/Admin/EmailConfigure';
import EmailTemplates from './pages/Admin/EmailTemplates';
import GeneralSettings from './pages/Admin/GeneralSettings';
import UserDetail from './pages/Admin/UserDetail';
import PreloaderSetting from './pages/Admin/PreloaderSetting';
import GoogleAnalytics from './pages/Admin/GoogleAnalytics';
import CookieConsent from './pages/Admin/CookieConsent';
import GoogleRecaptcha from './pages/Admin/GoogleRecaptcha';
import LiveChatSetting from './pages/Admin/LiveChatSetting';
import GlobalSeoManager from './pages/Admin/GlobalSeoManager';
import CacheClear from './pages/Admin/CacheClear';
import PrivacyPolicy from './pages/Admin/PrivacyPolicy';
import Frontend from './pages/Admin/Frontend';
import AdminProfile from './pages/Admin/AdminProfile';
import AdminFallback from './pages/Admin/AdminFallback';
import AdminTest from './pages/Admin/AdminTest';
import UserAnalytics from './pages/Admin/UserAnalytics';
import UserSignupAnalytics from './pages/Admin/UserSignupAnalytics';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-900">
      <nav id="navigation" aria-label="Main navigation">
        <Sidebar />
      </nav>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main id="main-content" className="flex-1 overflow-y-auto" role="main" tabIndex={-1}>
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <nav id="navigation" aria-label="Admin navigation">
        <AdminSidebar />
      </nav>
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main id="main-content" className="flex-1 overflow-y-auto" role="main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminRoutes() {
  const { admin, isAdmin, isLoading } = useAdminAuth();

  console.log('AdminRoutes: admin =', admin, 'isAdmin =', isAdmin, 'isLoading =', isLoading);
  console.log('AdminRoutes: Current path =', window.location.pathname);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading DOGE Admin...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated or not an admin
  const shouldShowLogin = !admin || !isAdmin;

  return (
    <Routes>
      <Route path="/login" element={shouldShowLogin ? <AdminLogin /> : <Navigate to="/dashboard" replace />} />
      <Route path="/test" element={<AdminTest />} />
      <Route path="/" element={shouldShowLogin ? <Navigate to="/login" replace /> : <Navigate to="/dashboard" replace />} />

      {admin && isAdmin ? (
        <>
      <Route
        path="/dashboard"
        element={
          <AdminProtectedLayout>
            <AdminDashboard />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/users"
        element={
          <AdminProtectedLayout>
            <ManageUsers />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/users/:userId"
        element={
          <AdminProtectedLayout>
            <UserDetail />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/users/active"
        element={
          <AdminProtectedLayout>
            <ManageUsers />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/users/deactive"
        element={
          <AdminProtectedLayout>
            <DeactiveUsers />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/users/analytics"
        element={
          <AdminProtectedLayout>
            <UserAnalytics />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/users/signups"
        element={
          <AdminProtectedLayout>
            <UserSignupAnalytics />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/manual/payments"
        element={
          <AdminProtectedLayout>
            <ManualPayments />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/payments/all"
        element={
          <AdminProtectedLayout>
            <AllPayments />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/deposit/log"
        element={
          <AdminProtectedLayout>
            <AdminDepositLog />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/kyc/setting"
        element={
          <AdminProtectedLayout>
            <KycSetting />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/withdraw/rejected"
        element={
          <AdminProtectedLayout>
            <RejectedWithdraws />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/withdraw/accepted"
        element={
          <AdminProtectedLayout>
            <AcceptedWithdraws />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/withdraw/pending"
        element={
          <AdminProtectedLayout>
            <PendingWithdraws />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/withdraw/method"
        element={
          <AdminProtectedLayout>
            <WithdrawMethod />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/interest/log"
        element={
          <AdminProtectedLayout>
            <UserInterestLog />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/roles"
        element={
          <AdminProtectedLayout>
            <ManageRole />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/commission/log"
        element={
          <AdminProtectedLayout>
            <CommissionLog />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/schedule"
        element={
          <AdminProtectedLayout>
            <Schedule />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/plans"
        element={
          <AdminProtectedLayout>
            <ManagePlan />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/admins"
        element={
          <AdminProtectedLayout>
            <ManageAdmins />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/tickets/all"
        element={
          <AdminProtectedLayout>
            <AllTickets />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/tickets/pending"
        element={
          <AdminProtectedLayout>
            <PendingTickets />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/gateway"
        element={
          <AdminProtectedLayout>
            <PaymentGateway />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/referral"
        element={
          <AdminProtectedLayout>
            <ManageReferral />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/coins"
        element={
          <AdminProtectedLayout>
            <CoinsList />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/gateway/bank"
        element={
          <AdminProtectedLayout>
            <BankPayment />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/gateway/flutterwave"
        element={
          <AdminProtectedLayout>
            <Flutterwave />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/gateway/paystack"
        element={
          <AdminProtectedLayout>
            <Paystack />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/email/config"
        element={
          <AdminProtectedLayout>
            <EmailConfigure />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/settings/general"
        element={
          <AdminProtectedLayout>
            <GeneralSettings />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/settings/preloader"
        element={
          <AdminProtectedLayout>
            <PreloaderSetting />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/settings/analytics"
        element={
          <AdminProtectedLayout>
            <GoogleAnalytics />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/settings/cookie"
        element={
          <AdminProtectedLayout>
            <CookieConsent />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/settings/recaptcha"
        element={
          <AdminProtectedLayout>
            <GoogleRecaptcha />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/settings/chat"
        element={
          <AdminProtectedLayout>
            <LiveChatSetting />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/settings/seo"
        element={
          <AdminProtectedLayout>
            <GlobalSeoManager />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/privacy-policy"
        element={
          <AdminProtectedLayout>
            <PrivacyPolicy />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/frontend"
        element={
          <AdminProtectedLayout>
            <Frontend />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <AdminProtectedLayout>
            <AdminProfile />
          </AdminProtectedLayout>
        }
      />
      <Route
        path="/admin/cache/clear"
        element={
          <AdminProtectedLayout>
            <CacheClear />
          </AdminProtectedLayout>
        }
      />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

function AppRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-white">Loading DOGE Platform...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminAccess />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedLayout>
            <Profile />
          </ProtectedLayout>
        }
      />
      <Route
        path="/deposit"
        element={
          <ProtectedLayout>
            <Deposit />
          </ProtectedLayout>
        }
      />
      <Route
        path="/withdraw"
        element={
          <ProtectedLayout>
            <Withdraw />
          </ProtectedLayout>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedLayout>
            <Notifications />
          </ProtectedLayout>
        }
      />
      <Route
        path="/portfolio"
        element={
          <ProtectedLayout>
            <Portfolio />
          </ProtectedLayout>
        }
      />
      <Route
        path="/investment-plans"
        element={
          <ProtectedLayout>
            <InvestmentPlans />
          </ProtectedLayout>
        }
      />
      <Route
        path="/referral-log"
        element={
          <ProtectedLayout>
            <ReferralLog />
          </ProtectedLayout>
        }
      />
      <Route
        path="/deposit-log"
        element={
          <ProtectedLayout>
            <DepositLog />
          </ProtectedLayout>
        }
      />
      <Route
        path="/kyc-verification"
        element={
          <ProtectedLayout>
            <KycVerification />
          </ProtectedLayout>
        }
      />
      <Route
        path="/transaction-log"
        element={
          <ProtectedLayout>
            <TransactionLog />
          </ProtectedLayout>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

// Route change announcer component
function RouteAnnouncer() {
  const location = useLocation();

  useEffect(() => {
    handleRouteChange(location.pathname);
  }, [location.pathname]);

  return null;
}

function App() {
  console.log('🚀 App component rendering');

  // Add global error handler for unhandled promise rejections
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Unhandled Promise Rejection:', event.reason);
    };

    const handleError = (event: ErrorEvent) => {
      console.error('🚨 Global Error:', event.error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ErrorBoundary>
      <SkipLinks />
      <ConnectionStatus />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RouteAnnouncer />
        <Routes>
          <Route path="/admin/*" element={
            <AdminAuthProvider>
              <AdminRoutes />
            </AdminAuthProvider>
          } />
          <Route path="/*" element={
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          } />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;