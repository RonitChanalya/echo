import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UniversePage from "./pages/UniversePage";
import MemoriesPage from "./pages/MemoriesPage";
import CreateMemoryPage from "./pages/CreateMemoryPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import MemoryDetailPage from "./pages/MemoryDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/app/memories" element={<MemoriesPage />} />
            <Route path="/app/memories/new" element={<CreateMemoryPage />} />
            <Route
              path="/app/memories/:id"
              element={<MemoryDetailPage />}
            />
          </Route>

          <Route
            path="/app/universe"
            element={<UniversePage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;