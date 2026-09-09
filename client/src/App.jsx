import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import Login from "./pages/auth/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";

import Leads from "./pages/leads/Leads.jsx";

import ProtectedRoute from "./routes/ProtectedRoutes.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";

import DashboardLayout from "./Layouts/DashBoardLayout.jsx";
import LeadDetails from "./pages/leads/LeadDetails.jsx";
import Projects from "./pages/properties/Properties.jsx";
import ProjectDetails from "./pages/properties/ProjectDetails.jsx";
import Units from "./pages/properties/Units.jsx";

import Bookings from "./pages/bookings/Bookings.jsx";
import BookingDetails from "./pages/bookings/Bookingdetails.jsx";
import Users from "./pages/users/Users.jsx";

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/leads" element={<Leads />} />

                <Route path="/leads/:id" element={<LeadDetails />} />

                <Route path="/properties/projects" element={<Projects />} />

                <Route
                  path="/properties/projects/:id"
                  element={<ProjectDetails />}
                />

                <Route
                  path="/properties/buildings/:buildingId/units"
                  element={<Units />}
                />

                <Route path="/bookings" element={<Bookings />} />

                <Route path="/bookings/:id" element={<BookingDetails />} />

                <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
                  <Route path="/users" element={<Users />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
