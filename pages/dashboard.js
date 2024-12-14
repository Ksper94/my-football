// pages/dashboard.js
import ProtectedRoute from '../components/ProtectedRoute'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
        <h1 className="text-3xl font-bold">Bienvenue sur votre Dashboard</h1>
      </div>
    </ProtectedRoute>
  )
}

