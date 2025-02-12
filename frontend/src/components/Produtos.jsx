import { useEffect, useState } from "react";
import axios from "axios";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/produtos")
      .then((response) => setProdutos(response.data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Lista de Produtos</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {produtos.map((produto) => (
          <li key={produto.id} className="mt-2 p-2 border-b">
            {produto.nome} - R$ {produto.preco}
          </li>
        ))}
      </ul>
    </div>
  );
}
