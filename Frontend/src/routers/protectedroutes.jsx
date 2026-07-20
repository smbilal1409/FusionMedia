
import { Navigate } from "react-router-dom";
import { useAuth } from "../Hooks/useauth";

export default function ProtectedRoute({ children }) {
  const { user, loadingUser: loading } = useAuth();

  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#121212]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#ae7aff] border-t-transparent" />
      </div>
    );
  }

  
  if (!user) return <Navigate to="/login" replace />;


  return children;
}
