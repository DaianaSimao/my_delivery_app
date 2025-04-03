import React from 'react';
import { DadosDiarios } from '../../../types/RelatorioFinanceiro';

interface TabelaDadosDiariosProps {
  dados: DadosDiarios[];
  totais: {
    entradas: number;
    saidas: number;
    saldo: number;
  };
}

export const TabelaDadosDiarios: React.FC<TabelaDadosDiariosProps> = ({ dados, totais }) => {
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white p-4 border-b dark:border-gray-700">
        Dados Diários
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Data</th>
              <th scope="col" className="px-6 py-3">Entradas (R$)</th>
              <th scope="col" className="px-6 py-3">Saídas (R$)</th>
              <th scope="col" className="px-6 py-3">Saldo (R$)</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4">{item.data}</td>
                <td className="px-6 py-4 text-green-600">{Number(item.entradas).toFixed(2)}</td>
                <td className="px-6 py-4 text-red-600">{Number(item.saidas).toFixed(2)}</td>
                <td className={`px-6 py-4 ${Number(item.saldo) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Number(item.saldo).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold text-gray-900 dark:text-white">
              <th scope="row" className="px-6 py-3 text-base">Total</th>
              <td className="px-6 py-3 text-green-600">{Number(totais.entradas).toFixed(2)}</td>
              <td className="px-6 py-3 text-red-600">{Number(totais.saidas).toFixed(2)}</td>
              <td className={`px-6 py-3 ${Number(totais.saldo) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Number(totais.saldo).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
