import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from 'react-router-dom';

interface Entregador {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  veiculo: string;
  placa: string;
  ativo: boolean;
  resturante_id: number;
}

const Entregadores: React.FC = () => {
  const [entregadores, setEntregadores] = useState<Entregador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalEntregadores, setTotalEntregadores] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const handleEntregadoresClick = () => {
    navigate("/entregadores/new");
  };

  const handleEditarClick = (entregadorId: number) => {
    navigate(`/entregadores/${entregadorId}/editar`);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token de autenticação não encontrado.");
        }

        const response = await api.get("/api/v1/entregadores", {
          params: {
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
          }
        });

        setEntregadores(response.data.data);
        setTotalPages(response.data.meta.total_pages);
        setTotalEntregadores(response.data.meta.total_count);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar entregadores. Verifique sua autenticação.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchProdutos();
  }, [currentPage, perPage, searchTerm]);

  if (loading) {
    return <div className="text-center py-8 mt-5">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500 mt-5">{error}</div>;
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased mt-5 w-full">
      <div className="mx-auto max-w-screen-2xl px-4 lg:px-12 mt-7">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="flex-1 flex items-center space-x-2">
              <h5>
                <span className="text-gray-500">Todos os Entregadores: </span>
                <span className="dark:text-white"> {totalEntregadores} </span>
              </h5>
              <button type="button" className="group" data-tooltip-target="results-tooltip">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="sr-only">Mais informações</span>
              </button>
              <div id="results-tooltip" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                Mostrando 1-{entregadores.length} de {entregadores.length} resultados
                <div className="tooltip-arrow" data-popper-arrow=""></div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center md:space-x-3 space-y-3 md:space-y-0 justify-between mx-4 py-4 border-t dark:border-gray-700">
            <div className="w-full md:w-1/2">
              <form
                className="flex items-center"
                onSubmit={(e) => {
                  e.preventDefault(); // Evita o recarregamento da página
                  handlePageChange(1); // Volta para a primeira página ao buscar
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
                    placeholder="Buscar entregador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  />
                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <button
                type="button"
                id="createEntregadorButton"
                data-modal-toggle="createEntregadorModal"
                onClick={handleEntregadoresClick}
                className="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              >
                <svg className="h-3.5 w-3.5 mr-1.5 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Add entregadores
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">Nome</th>
                  <th scope="col" className="p-4">Telefone</th>
                  <th scope="col" className="p-4">Veiculo</th>
                  <th scope="col" className="p-4">Placa</th>
                  <th scope="col" className="p-4">Ativo</th>
                </tr>
              </thead>
              <tbody>
                {entregadores.map((entregador) => {
                  if (!entregador) {
                    console.error("Sem entregador:", entregador);
                    return null; // Ignora entregadores inválidos
                  }

                  return (
                    <tr key={entregador.id} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center">
                        {entregador.nome}
                      </th>
                      <td className="px-4 py-3">
                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                          {entregador.telefone}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {entregador.veiculo}
                      </td>
                      <td className="px-4 py-3">
                        {entregador.placa || "N/A"}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={() => handleEditarClick(entregador.id)}
                            className="py-2 px-3 flex items-center text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2 -ml-0.5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path
                                fillRule="evenodd"
                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={() => navigate(`/entregadores/${entregador.id}`)}
                            className="py-2 px-3 flex items-center text-sm font-medium text-center text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4 mr-2 -ml-0.5"
                            >
                              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z"
                              />
                            </svg>
                            Ver
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Mostrando 
              <span className="font-semibold text-gray-900 dark:text-white"> {((currentPage - 1) * perPage) + 1} - {Math.min(currentPage * perPage, entregadores.length)} </span>
              de  
              <span className="font-semibold text-gray-900 dark:text-white"> {entregadores.length} </span>
            </span>
            <ul className="inline-flex items-stretch -space-x-px">
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                      currentPage === page
                        ? "text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}
                  >
                    {page}
                  </a>
                </li>
              ))}
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

export default Entregadores;
