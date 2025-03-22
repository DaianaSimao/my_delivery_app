// utils/comandaGenerator.ts
import { jsPDF } from 'jspdf';

interface Pedido {
  id: number;
  created_at: string;
  itens_pedidos: Array<{
    produto: {
      id: number;
      nome: string;
      preco: number;
    };
    acompanhamentos_pedidos?: Array<{
      id: number;
      item_acompanhamento: {
        id: number;
        nome: string;
        preco: number;
        acompanhamento: {
          id: number;
          nome: string;
        };
      };
      quantidade: number;
    }>;
    quantidade: number;
  }>;
  observacoes?: string;
}

export const gerarComandaPDF = (pedido: Pedido) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: [130, 270], // Tamanho personalizado para a comanda (130mm x 270mm)
  });

  // Adiciona uma borda preta ao redor da comanda
  doc.setDrawColor(0); // Preto
  doc.rect(3, 3, 124, 260); // Borda preta (3mm de margem)

  // Configurações do PDF
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`COMANDA DO PEDIDO #${pedido.id}`, 10, 15);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  // Formata a data e hora do pedido
  const dataHoraPedido = new Date(pedido.created_at).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  doc.text(`Data e Hora: ${dataHoraPedido}`, 10, 25);

  // Itens do Pedido
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('ITENS DO PEDIDO', 10, 35);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');

  let yOffset = 45;
  let itemCount = 1; // Contador de itens

  pedido.itens_pedidos.forEach((item) => {
    // Adiciona o número do item antes do nome do produto
    doc.text(
      `ITEM ${itemCount}: ${item.quantidade}x ${item.produto.nome.toUpperCase()} - R$ ${(item.quantidade * item.produto.preco).toFixed(2)}`,
      10,
      yOffset
    );
    yOffset += 10;
    itemCount++; // Incrementa o contador de itens

    // Acompanhamentos do item
    if (item.acompanhamentos_pedidos && item.acompanhamentos_pedidos.length > 0) {
      // Agrupa os acompanhamentos pelo tipo
      const acompanhamentosAgrupados = item.acompanhamentos_pedidos.reduce((acc, acompanhamento) => {
        const tipoAcompanhamento = acompanhamento.item_acompanhamento.acompanhamento.nome.toUpperCase();
        if (!acc[tipoAcompanhamento]) {
          acc[tipoAcompanhamento] = [];
        }
        acc[tipoAcompanhamento].push(acompanhamento);
        return acc;
      }, {} as Record<string, typeof item.acompanhamentos_pedidos>);

      // Exibe os acompanhamentos agrupados
      Object.entries(acompanhamentosAgrupados).forEach(([tipo, acompanhamentos]) => {
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.text(`ACOMPANHAMENTO: ${tipo}`, 10, yOffset);
        yOffset += 10;

        doc.setFontSize(13);
        doc.setFont('helvetica', 'normal');
        acompanhamentos.forEach((acompanhamento) => {
          doc.text(
            `${acompanhamento.quantidade}x ${acompanhamento.item_acompanhamento.nome.toUpperCase()}`,
            15,
            yOffset
          );
          yOffset += 10;
        });
      });
    }

    // Adiciona uma linha separadora após cada item
    doc.setDrawColor(0); // Cor da linha (preto)
    doc.line(10, yOffset, 120, yOffset); // Desenha uma linha horizontal
    yOffset += 10; // Adiciona um pequeno espaço após a linha
  });

  // Observações
  if (pedido.observacoes) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVAÇÃO:', 10, yOffset + 10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(pedido.observacoes, 10, yOffset + 20);
  }

  // Salva o PDF
  doc.save(`comanda-pedido-${pedido.id}.pdf`);
};