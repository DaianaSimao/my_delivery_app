import React from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (event: React.MouseEvent) => {
    event.preventDefault();
  
    try {
      const token = localStorage.getItem("token");
      console.log("Token antes do logout:", token); // Debug
  
      if (!token) {
        console.error("Nenhum token encontrado para logout");
        return;
      }
  
      const response = await axios.delete("http://localhost:3000/logout", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Se a resposta não foi bem-sucedida, lança um erro
      if (response.status !== 200) {
        throw new Error("Erro ao realizar logout");
      }

      logout(); 
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error: unknown) {
      console.error("Erro ao fazer logout:", error);
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
            <svg
              className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 10a1 1 0 0 1 1-1h8.586l-3.293-3.293a1 1 0 1 1 1.414-1.414l5 5a1 1 0 0 1 0 1.414l-5 5a1 1 0 1 1-1.414-1.414L12.586 11H4a1 1 0 0 1-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
          </a>
        </li>
  );
};

export default LogoutButton;
