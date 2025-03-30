import React from "react";
import api from "../../services/api";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logoutIcon from "/icons/logout.svg";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (event: React.MouseEvent) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Nenhum token encontrado para logout");
        return;
      }

      const response = await api.delete("/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status !== 200) {
        throw new Error("Erro ao realizar logout");
      }

      logout();
      localStorage.removeItem("token");
      localStorage.removeItem("restauranteId");
      navigate("/login");
      toast.success("Logout realizado com sucesso");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error((error as Error).message || "Erro ao fazer logout");
      logout();
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
        <li>
          <a
            href="#"
            onClick={handleLogout}
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <img
              src={logoutIcon}
              alt="Ícone do pagamento"
              className="h-6 w-auto mr-1 text-4xl" 
            />
            <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
          </a>
        </li>
  );
};

export default LogoutButton;
