// src/layouts/AuthenticatedLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "../components/admin/SideBar";

interface AuthenticatedLayoutProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <div className="flex">
      <SideBar
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
      <div className="w-full mt-5">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;