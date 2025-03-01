// src/layouts/AuthenticatedLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { SideBar } from "../components/admin/SideBar";

interface AuthenticatedLayoutProps {
  restaurantInfo: {
    name: string;
    openingHours: string;
    minimumOrder: number;
    profileUrl: string;
  };
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  restaurantInfo,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <div className="flex">
      <SideBar
        restaurantInfo={restaurantInfo}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
      />
      <div className="w-full mt-5">
        <Outlet /> {/* Renderiza as rotas filhas aqui */}
      </div>
    </div>
  );
};

export default AuthenticatedLayout;