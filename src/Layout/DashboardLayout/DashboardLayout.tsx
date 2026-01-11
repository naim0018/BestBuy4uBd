import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumbs from "./Breadcrumbs";
import { adminRoutes } from "@/routes/AdminRoutes";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 print:bg-white">
      {/* 1. Fixed Sidebar */}
      <div className="print:hidden">
        <Sidebar />
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="print:hidden">
            <Header />
        </div>

        <main className="p-6 overflow-y-auto print:p-0 print:overflow-visible">
          {/* Breadcrumbs (Optional) */}
          <div className="print:hidden">
            <div className="flex items-center gap-2 space-y-2">
              <Breadcrumbs config={adminRoutes} basePath="/admin" />
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
