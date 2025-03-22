// utils/comandaEntregaGenerator.ts
import { jsPDF } from 'jspdf';

interface Entrega {
  id: number;
  status: string;
  pedido_id: number;
  pedido: {
    id: number;
    forma_pagamento: string;
    observacoes: string;
    cliente: {
      nome: string;
      telefone: string;
      endereco: {
        rua: string;
        numero: string;
        bairro: string;
        cidade: string;
        estado: string;
        cep: string;
        complemento?: string;
        ponto_referencia?: string; // Adicionado campo de ponto de referência
      };
    };
    troco?: string; // Adicionado campo de troco
  };
  entregador?: {
    id: number;
    nome: string;
    telefone: string;
    veiculo: string;
  };
}

export const gerarComandaPDF = (entrega: Entrega) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: [130, 270], // Tamanho personalizado para a comanda (130mm x 270mm)
  });

  // Adiciona uma borda preta ao redor da comanda
  doc.setDrawColor(0); // Preto
  doc.rect(3, 3, 124, 260); // Borda preta (3mm de margem)

  // Configurações do PDF
  doc.setFontSize(12); // Define o tamanho da fonte como 12 para todo o documento
  doc.setFont('helvetica', 'bold');
  doc.text(`COMANDA DA ENTREGA #${entrega.id}`.toUpperCase(), 10, 15);

  // Formata a data e hora do pedido
  const dataHoraPedido = new Date().toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  doc.text(`DATA E HORA: ${dataHoraPedido}`.toUpperCase(), 10, 25);

  // Informações do Pedido
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMAÇÕES DO PEDIDO'.toUpperCase(), 10, 35);
  doc.setFont('helvetica', 'normal'); // Volta para a fonte normal

  let yOffset = 45;

  // Pedido
  doc.text(`PEDIDO: #${entrega.pedido.id}`.toUpperCase(), 10, yOffset);
  yOffset += 10;

  // Identificador
  doc.text(`IDENTIFICADOR: #${entrega.id}`.toUpperCase(), 10, yOffset);
  yOffset += 10;

  // Cliente
  doc.text(
    `CLIENTE: ${entrega.pedido.cliente.nome} (${entrega.pedido.cliente.telefone})`.toUpperCase(),
    10,
    yOffset
  );
  yOffset += 10;

  // Endereço
  // Endereço
doc.text(
  `ENDEREÇO: ${entrega.pedido.cliente.endereco.rua}, ${entrega.pedido.cliente.endereco.numero}`.toUpperCase(),
  10,
  yOffset
);
yOffset += 10; // Incrementa o yOffset após adicionar a linha

// Bairro
doc.text(`BAIRRO: ${entrega.pedido.cliente.endereco.bairro}`.toUpperCase(), 10, yOffset);
yOffset += 10; // Incrementa o yOffset após adicionar a linha

// Cidade/Estado
doc.text(
  `CIDADE/ESTADO: ${entrega.pedido.cliente.endereco.cidade}/${entrega.pedido.cliente.endereco.estado}`.toUpperCase(),
  10,
  yOffset
);
yOffset += 10; // Incrementa o yOffset após adicionar a linha

// Complemento (se existir)
if (entrega.pedido.cliente.endereco.complemento) {
  doc.text(
    `COMPLEMENTO: ${entrega.pedido.cliente.endereco.complemento}`.toUpperCase(),
    10,
    yOffset
  );
  yOffset += 10; // Incrementa o yOffset após adicionar a linha
}

// Ponto de Referência (se existir)
if (entrega.pedido.cliente.endereco.ponto_referencia) {
  doc.text(
    `REFERÊNCIA: ${entrega.pedido.cliente.endereco.ponto_referencia}`.toUpperCase(),
    10,
    yOffset
  );
  yOffset += 10; // Incrementa o yOffset após adicionar a linha
}
  // Entregador
  doc.setFont('helvetica', 'bold');
  doc.text('ENTREGADOR'.toUpperCase(), 10, yOffset);
  doc.setFont('helvetica', 'normal'); // Volta para a fonte normal
  yOffset += 10;

  if (entrega.entregador) {
    doc.text(`NOME: ${entrega.entregador.nome}`.toUpperCase(), 10, yOffset);
    yOffset += 10;
    doc.text(`VEÍCULO: ${entrega.entregador.veiculo}`.toUpperCase(), 10, yOffset);
    yOffset += 10;
  } else {
    doc.text('ENTREGADOR: SEM ENTREGADOR DESIGNADO'.toUpperCase(), 10, yOffset);
    yOffset += 10;
  }

  // Pagamento
  doc.setFont('helvetica', 'bold');
  doc.text('PAGAMENTO'.toUpperCase(), 10, yOffset);
  doc.setFont('helvetica', 'normal'); // Volta para a fonte normal
  yOffset += 10;

  doc.text(
    `FORMA DE PAGAMENTO: ${entrega.pedido.forma_pagamento}`.toUpperCase(),
    10,
    yOffset
  );
  yOffset += 10;

  if (entrega.pedido.troco) {
    doc.text(`TROCO: R$ ${entrega.pedido.troco}`.toUpperCase(), 10, yOffset);
    yOffset += 10;
  }

  // Salva o PDF
  doc.save(`COMANDA-ENTREGA-${entrega.id}.pdf`.toUpperCase());
};