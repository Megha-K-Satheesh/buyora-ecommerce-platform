


import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const UserRoute = ({ children }) => {
  const {  isAuthenticated, loading } = useSelector(
    (state) => state.auth
  );
  const {user} = useSelector((state)=>state.user)

  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but NOT normal user
  if (user?.role !== "user") {
    return <Navigate to="/" replace />;
  }

  return children;
};


//later need getadminprofile
export const AdminRoute = ({ children,role="admin" }) => {
  const { admin, isAuthenticated } = useSelector((state) => state.adminAuth);
    console.log(admin,isAuthenticated)

    const token = localStorage.getItem('adminAuthToken')

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};


export const PublicRoute = ({ children }) => {
  const userToken = localStorage.getItem("authToken");
  const adminToken = localStorage.getItem("adminAuthToken");

  if (userToken) {
    return <Navigate to="/account" replace />;
  }

  if (adminToken) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};


