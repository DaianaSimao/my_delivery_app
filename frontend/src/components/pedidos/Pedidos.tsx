import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Pedido } from "../../types/Pedido";

const Pedidos: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [searchPedidoId, setSearchPedidoId] = useState("");
  const [statusSelecionados, setStatusSelecionados] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (status: string) => {
    setStatusSelecionados((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token de autenticação não encontrado.");
        }

        const response = await api.get("/api/v1/pedidos/listar_pedidos", {
          params: {
            page: currentPage,
            per_page: perPage,
            cliente_nome: searchTerm,
            data_inicio: dataInicio,
            data_fim: dataFim,
            status: statusSelecionados,
            pedido_id: searchPedidoId
          }
        });

        setPedidos(response.data.data);
        setTotalPages(response.data.meta.total_pages);
        setTotalPedidos(response.data.meta.total_count);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar pedidos internos. Verifique sua autenticação.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchPedidos();
  }, [currentPage, perPage, searchTerm, searchPedidoId, dataInicio, dataFim, statusSelecionados]);

  if (loading) {
    return <div className="text-center py-8 mt-5">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500 mt-5">{error}</div>;
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased mt-5 w-full">
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-12 mt-7">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-visible">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="flex-1 flex items-center space-x-2">
              <h5>
                <span className="text-gray-500">Todos os pedidos internos: </span>
                <span className="dark:text-white"> {totalPedidos} </span>
              </h5>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
            <div className="w-full md:w-1/2">
              <form
                className="flex items-center"
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePageChange(1);
                }}
              >
                <label htmlFor="simple-search" className="sr-only">Buscar</label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    placeholder="Buscar por nome do cliente"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                </div>
                <div className="w-full md:w-1/2 ml-2">
                  <input
                    type="text"
                    placeholder="ID do Pedido"
                    value={searchPedidoId}
                    onChange={(e) => setSearchPedidoId(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                </div>
              </form>
            </div>
            <div className="flex space-x-2">
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              />
            </div>
            <div className="relative overflow-visible"> {/* Contêiner externo */}
              <div className="flex space-x-2">
                <div className="relative">
                  <details className="group">
                    <summary className="flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer dark:bg-gray-700 dark:border-gray-600">
                      <span className="text-sm text-gray-900 dark:text-white">Filtrar por Status</span>
                      <svg
                        className="w-4 h-4 ml-2 transition-transform transform group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </summary>
                    <div className="absolute z-50 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600">
                      <div className="max-h-48 overflow-y-auto p-2 space-y-2"> {/* Scroll interno */}
                        {["Expedido", "Em Análise", "Recebido", "Finalizado", "Cancelado", "Em Preparação"].map((status) => (
                          <div key={status} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`status-${status}`}
                              value={status}
                              checked={statusSelecionados.includes(status)}
                              onChange={() => handleStatusChange(status)}
                              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor={`status-${status}`}
                              className="ml-2 text-sm text-gray-900 dark:text-gray-300"
                            >
                              {status}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">ID</th>
                  <th scope="col" className="p-4">Cliente</th>
                  <th scope="col" className="p-4">Valor Total</th>
                  <th scope="col" className="p-4">Status</th>
                  <th scope="col" className="p-4">Itens</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      #{pedido.id}
                    </td>
                    <td className="px-4 py-3">
                      {pedido.cliente?.nome}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      R${Number(pedido.valor_total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                        {pedido.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ul>
                        {pedido.itens_pedidos.map((item, index) => (
                          <li key={index}>
                            {item.produto.nome} (x{item.quantidade})
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 overflow-x-auto" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Mostrando 
              <span className="font-semibold text-gray-900 dark:text-white"> {((currentPage - 1) * perPage) + 1} - {Math.min(currentPage * perPage, pedidos.length)} </span>
              de  
              <span className="font-semibold text-gray-900 dark:text-white"> {pedidos.length} </span>
            </span>
            <ul className="inline-flex items-stretch -space-x-px flex-wrap">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={`flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </li>
              {(() => {
                const maxVisibleButtons = 4;
                let startPage = 1;
                let endPage = totalPages;
                
                if (totalPages > maxVisibleButtons) {
                  const halfButtons = Math.floor(maxVisibleButtons / 2);
                  
                  if (currentPage <= halfButtons + 1) {
                    endPage = maxVisibleButtons;
                  } else if (currentPage >= totalPages - halfButtons) {
                    startPage = totalPages - maxVisibleButtons + 1;
                  } else {
                    startPage = currentPage - halfButtons;
                    endPage = currentPage + halfButtons;
                  }
                }
                
                const pageButtons = [];
                
                if (startPage > 1) {
                  pageButtons.push(
                    <li key={1}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(1);
                        }}
                        className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                          currentPage === 1
                            ? "text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        }`}
                      >
                        1
                      </a>
                    </li>
                  );
                  
                  if (startPage > 2) {
                    pageButtons.push(
                      <li key="ellipsis1" className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                        ...
                      </li>
                    );
                  }
                }
                
                for (let i = startPage; i <= endPage; i++) {
                  pageButtons.push(
                    <li key={i}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(i);
                        }}
                        className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                          currentPage === i
                            ? "text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        }`}
                      >
                        {i}
                      </a>
                    </li>
                  );
                }
                
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pageButtons.push(
                      <li key="ellipsis2" className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
                        ...
                      </li>
                    );
                  }
                  
                  pageButtons.push(
                    <li key={totalPages}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(totalPages);
                        }}
                        className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                          currentPage === totalPages
                            ? "text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                            : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        }`}
                      >
                        {totalPages}
                      </a>
                    </li>
                  );
                }
                
                return pageButtons;
              })()}
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={`flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default Pedidos;