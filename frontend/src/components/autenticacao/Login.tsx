import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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

      console.log("Resposta do backend:", response.data);

      const token = response.data.status?.data?.token;
      if (!token) {
        throw new Error("Token não encontrado na resposta do backend");
      }

      toast.success("Login realizado com sucesso!");
      login(token);
      navigate("/dashboard");
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
              "url(https://images.unsplash.com/photo-1616763355603-9755a640a287?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80)",
          }}
        >
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-4xl font-bold text-white">Brand</h2>
              <p className="max-w-xl mt-3 text-gray-300">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. In autem ipsa, nulla
                laboriosam dolores, repellendus perferendis libero suscipit nam temporibus molestiae.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-700 dark:text-white">Brand</h2>
              <p className="mt-3 text-gray-500 dark:text-gray-300">Sign in to access your account</p>
            </div>

            <div className="mt-8">
              <form onSubmit={handleLogin}>
                <div>
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email Address</label>
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
                    <label className="text-sm text-gray-600 dark:text-gray-200">Password</label>
                    <a href="#" className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline">
                      Forgot password?
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
                    Sign in
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-center text-gray-400">
                Don't have an account yet?{" "}
                <a href="#" className="text-blue-500 focus:outline-none focus:underline hover:underline">
                  Sign up
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
