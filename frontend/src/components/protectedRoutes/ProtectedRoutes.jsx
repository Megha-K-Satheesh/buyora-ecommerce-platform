


import { Navigate } from "react-router-dom";

// export const UserRoute = ({ children }) => {
//   const {  isAuthenticated, loading } = useSelector(
//     (state) => state.auth
//   );
//   const {user} = useSelector((state)=>state.user)

//   const location = useLocation();

//   if (loading) {
//     return <div>Loading...</div>;
//   }
//   console.log(isAuthenticated)
//   // Not logged in
//   if (!isAuthenticated) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }
//  if (!user) {
//     return <div>Loading...</div>;
//   }
//   // Logged in but NOT normal user
//   if (user?.role !== "user") {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };


export const UserRoute = ({ children }) => {
  // const location = useLocation();

  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login"  replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("adminAuthToken");

  if (!token) {
    return <Navigate to="/admin-login" replace />;
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


