// src/App.tsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/autenticacao/Login";
import { Header } from "./components/autenticacao/Header";
import Produtos from "./components/produtos/Produtos";
import ProdutosForm from "./components/produtos/ProdutosForm";
import ProdutoDetail from './components/produtos/ProdutoDetail';
import ProdutosEditForm from "./components/produtos/ProdutoEditForm";
import { Toaster } from "react-hot-toast";
import Acompanhamentos from './components/acompanhamentos/Acompanhamentos';
import AcompanhamentosForm from './components/acompanhamentos/AcompanhamentosForm';
import AcompanhamentosEditForm from "./components/acompanhamentos/AcompanhamentosEditForm";
import PedidosList from "./components/pedidos/PedidosList";
import EntregasList from "./components/entregas/EntregasList";
import OrderNotifications from './components/pedidos/PedidoNotificacao';
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import BemVindo from "./components/admin/BemVindo";
import Dashboard from "./components/admin/Dashboard";
import Restaurantes from "./components/restaurantes/Restaurantes";
import RestauranteForm from "./components/restaurantes/RestauranteForm";
import RestauranteEditForm from "./components/restaurantes/RestauranteEditForm";
import RestauranteDetails from "./components/restaurantes/RestauranteDetail";
import EntregadoresList from "./components/entregadores/EntregadoresList";
import EntregadorDetails from "./components/entregadores/EntregadorDetails";
import EntregadoresForm from "./components/entregadores/EntregadoresForm";
import EntregadoresEditForm from "./components/entregadores/EntregadoresEditForm";
import Pedidos from "./components/pedidos/Pedidos";
import ClienteForm from "./components/pedidos/ClienteForm";
import ItensForm from "./components/pedidos/ItensForm";
import PagamentoForm from "./components/pedidos/PagamentoForm";
import Entregas from "./components/entregas/Entregas";

const AppContent: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDarkMode);
      document.documentElement.classList.toggle('dark', prefersDarkMode);
      localStorage.setItem('theme', prefersDarkMode ? 'dark' : 'light');
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      <Toaster />
      <OrderNotifications />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route 
          path="/login" 
          element={
            <>
              <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
              <Login />
            </>
          } 
        />
        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <AuthenticatedLayout
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
              />
            }
          >
            <Route path="/bem_vindo" element={<BemVindo />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produtos/new" element={<ProdutosForm />} />
            <Route path="/produtos/:id" element={<ProdutoDetail />} />
            <Route path="/produtos/:id/editar" element={<ProdutosEditForm />} />
            <Route path="/acompanhamentos" element={<Acompanhamentos />} />
            <Route path="/acompanhamentos/new" element={<AcompanhamentosForm />} />
            <Route path="/acompanhamentos/:id/editar" element={<AcompanhamentosEditForm />} />
            <Route path="/pedidos" element={<PedidosList />} />
            <Route path="/pedidos/listar_pedidos" element={<Pedidos />} />
            <Route path="/entregas" element={<EntregasList />} />
            <Route path="/listar_entregas" element={<Entregas />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/restaurantes" element={<Restaurantes />} />
            <Route path="/restaurantes/new" element={<RestauranteForm />} />
            <Route path="/restaurantes/:id/editar" element={<RestauranteEditForm />} />
            <Route path="/restaurantes/:id" element={<RestauranteDetails />} />
            <Route path="/entregadores" element={<EntregadoresList />} />
            <Route path="/entregadores/new" element={<EntregadoresForm />} />
            <Route path="/entregadores/:id" element={<EntregadorDetails />} />
            <Route path="/entregadores/:id/editar" element={<EntregadoresEditForm />} />
            <Route path="/clientes/:id/editar" element={<ClienteForm />} />
            <Route path="/pedidos/:id/editar-itens" element={<ItensForm />} />
            <Route path="/pedidos/:id/editar-pagamento" element={<PagamentoForm />} />
            <Route path="/*" element={<Navigate to="/bem_vindo" />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;