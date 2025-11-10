import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { PollProvider } from '@/contexts/PollContext'
import ProtectedRoute from '@/routes/ProtectedRoute'
import RequireRole from '@/routes/RequireRole'
import PublicLayout from '@/layouts/PublicLayout'
import AppLayout from '@/layouts/AppLayout'
import HomeScreen from '@/screens/HomeScreen'
import PollsScreen from '@/screens/PollsScreen'
import PollDetailScreen from '@/screens/PollDetailScreen'
import VoteFlowScreen from '@/screens/VoteFlowScreen'
import ResultsScreen from '@/screens/ResultsScreen'
import ProfileScreen from '@/screens/ProfileScreen'
import NotificationsScreen from '@/screens/NotificationsScreen'
import AdminDashboardScreen from '@/screens/AdminDashboardScreen'
import AdminCreateBallotScreen from '@/screens/AdminCreateBallotScreen'
import TestUploadScreen from '@/screens/TestUploadScreen'
import LoginScreen from '@/screens/LoginScreen'
import RegisterScreen from '@/screens/RegisterScreen'
import LandingScreen from '@/screens/LandingScreen'
import ForgotPasswordScreen from '@/screens/ForgotPasswordScreen'
import ResetPasswordScreen from '@/screens/ResetPasswordScreen'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <PollProvider>
              <Routes>
              {/* Public routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                <Route path="/reset-password" element={<ResetPasswordScreen />} />
              </Route>

              {/* Protected app routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/home" element={<HomeScreen />} />
                <Route path="/polls" element={<PollsScreen />} />
                <Route path="/polls/:id" element={<PollDetailScreen />} />
                <Route path="/vote/:id" element={<VoteFlowScreen />} />
                <Route path="/results" element={<ResultsScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/notifications" element={<NotificationsScreen />} />
                  <Route element={<RequireRole roles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboardScreen />} />
                    <Route path="/admin/create" element={<AdminCreateBallotScreen />} />
                    <Route path="/admin/test-upload" element={<TestUploadScreen />} />
                  </Route>
                </Route>
              </Route>
              </Routes>
          </PollProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}


