import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import restauranteIcon from "/icons/restaurante.svg";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        {
          user: {
            email,
            password,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const token = response.data.status?.data?.token;
      const restauranteId = response.data.status?.data?.active_restaurante.id;

      if (!token) {
        throw new Error("Token não encontrado na resposta do backend");
      }

      toast.success("Login realizado com sucesso!");
      login(token, restauranteId);
      navigate("/bem_vindo");
    }
    
    catch (error: unknown) {
      console.log(error);
      let errorMessage = "Erro ao realizar login. Verifique suas credenciais.";
      if (axios.isAxiosError(error)) {
        console.error('Erro do axios:', error.response);  // Log para depurar o erro
        if (error.response) {
          errorMessage = error.response.data || errorMessage;
        }
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 w-full min-h-screen">
      <div className="flex justify-center h-screen">
        <div
          className="hidden bg-cover lg:block lg:w-2/3"
          style={{
            backgroundImage:
              "url(https://image.freepik.com/foto-gratis/entrega-comida-rapida-pedir-comida-concepto-linea_136595-18630.jpg)",
          }}
        >
          <div scope="row" className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-4xl font-bold text-white flex items-center">
                Delivery Express 
                <img
                  src={restauranteIcon}
                  alt="Ícone do restaurante"
                  className="h-8 w-auto mr-3 text-4xl" 
                />
              </h2>
              <p className="max-w-xl mt-3 text-white">
              Bem-vindo ao Painel de Controle 🍔🍣🍕

                Gerencie seu restaurante e ofereça uma experiência incrível aos seus clientes!
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-700 dark:text-white">Login</h2>
              <p className="mt-3 text-gray-500 dark:text-gray-300">Entre para acessar seu painel de controle.</p>
            </div>

            <div className="mt-8">
              <form onSubmit={handleLogin}>
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email</label>
                  <input
                    type="email"
                    placeholder="example@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-600 dark:text-gray-200">Senha</label>
                    <a href="#" className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline">
                      Esqueceu a senha?
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    Entrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
