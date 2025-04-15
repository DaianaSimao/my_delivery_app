import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Acompanhamento } from "../../types/Acompanhamento";

const Acompanhamentos: React.FC = () => {
  const [acompanhamentos, setAcompanhamentos] = useState<Acompanhamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalAcompanhamentos, setTotalAcompanhamentos] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAcompanhamento, setSelectedAcompanhamento] = useState<Acompanhamento | null>(null);
  const navigate = useNavigate();

  const handleAcompanhamentosClick = () => {
    navigate("/acompanhamentos/new");
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditarClick = (acompanhamentoId: number) => {
    navigate(`/acompanhamentos/${acompanhamentoId}/editar`);
  };

  useEffect(() => {
    const fetchAcompanhamentos = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token de autenticação não encontrado.");
        }

        const response = await api.get("/api/v1/acompanhamentos", {
          params: {
            page: currentPage,
            per_page: perPage,
            search: searchTerm,
          },
        });

        setAcompanhamentos(response.data.data);
        setTotalPages(response.data.meta.total_pages);
        setTotalAcompanhamentos(response.data.meta.total_count);
        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar acompanhamentos. Verifique sua autenticação.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchAcompanhamentos();
  }, [currentPage, perPage, searchTerm]);

  const openModal = (acompanhamento: Acompanhamento) => {
    setSelectedAcompanhamento(acompanhamento);
  };

  const closeModal = () => {
    setSelectedAcompanhamento(null);
  };

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
                <span className="text-gray-500">Todos os acompanhamentos: </span>
                <span className="dark:text-white"> {totalAcompanhamentos} </span>
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
                <label htmlFor="simple-search" className="sr-only">
                  Buscar
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    placeholder="Buscar acompanhamentos"
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
                onClick={handleAcompanhamentosClick}
                className="flex items-center justify-center text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none dark:focus:ring-green-800"
              >
                <svg
                  className="h-3.5 w-3.5 mr-1.5 -ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                Adicionar Acompanhamento
              </button>
              <button
                type="button"
                onClick={() => navigate("/produtos")}
                className="flex items-center justify-center text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-green-800"
              >
                Produtos
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    Nome
                  </th>
                  <th scope="col" className="p-4">
                    Quantidade Máxima
                  </th>
                  <th scope="col" className="p-4">
                    Itens
                  </th>
                  <th scope="col" className="p-4">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {acompanhamentos.map((acompanhamento) => (
                  <tr
                    key={acompanhamento.id}
                    className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {acompanhamento.nome}
                    </td>
                    <td className="px-4 py-3">{acompanhamento.quantidade_maxima}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openModal(acompanhamento)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Ver Itens
                      </button>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      <div className="flex items-center space-x-4">
                      <button
                            type="button"
                            onClick={() => acompanhamento.id && handleEditarClick(acompanhamento.id)}
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Paginação */}
          <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 overflow-x-auto" aria-label="Table navigation">
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Mostrando 
              <span className="font-semibold text-gray-900 dark:text-white"> {((currentPage - 1) * perPage) + 1} - {Math.min(currentPage * perPage, totalAcompanhamentos)} </span>
              de  
              <span className="font-semibold text-gray-900 dark:text-white"> {totalAcompanhamentos} </span>
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
                const maxVisibleButtons = 5;
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
      {selectedAcompanhamento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Itens de {selectedAcompanhamento.nome}</h2>
            <ul>
              {selectedAcompanhamento.item_acompanhamentos && selectedAcompanhamento.item_acompanhamentos.length > 0 ? (
                selectedAcompanhamento.item_acompanhamentos.map((item) => (
                  <li key={item.id} className="mb-2 dark:text-white">
                    {item.nome} - {item.preco  ? `R$ ${item.preco}` : "Sem preço"}
                  </li>
                ))
              ) : (
                <li>Nenhum item encontrado.</li>
              )}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Acompanhamentos;