// --- script.js ---

// 1. Armazenamento dos Itens do Menu (simples, como um array de objetos)
const menuItens = [
    { id: 1, nome: "Hamburguer Clássico", preco: 8.50 },
    { id: 2, nome: "Batatas Fritas", preco: 3.00 },
    { id: 3, nome: "Cerveja Artesanal (IPA)", preco: 6.00 },
    { id: 4, nome: "Sumo de Laranja Natural", preco: 3.50 }
];

// Variável para armazenar o pedido do cliente (ID do item e quantidade)
let pedidoAtual = {};

// Número de WhatsApp do restaurante (IMPORTANTE: Mude para o seu número! Formato: 55DDI_DDD_NUMERO)
const WHATSAPP_NUMERO = "351912345678"; // Exemplo: Portugal (351)

// 2. Função principal para adicionar/remover itens (será chamada pelo HTML)
function atualizarPedido(itemId, acao) {
    const item = menuItens.find(i => i.id == itemId);

    if (!item) return;

    // Inicializa a quantidade se não existir
    if (!pedidoAtual[itemId]) {
        pedidoAtual[itemId] = { ...item, quantidade: 0 };
    }

    if (acao === 'adicionar') {
        pedidoAtual[itemId].quantidade += 1;
    } else if (acao === 'remover' && pedidoAtual[itemId].quantidade > 0) {
        pedidoAtual[itemId].quantidade -= 1;
    }

    // Remove do carrinho se a quantidade for zero
    if (pedidoAtual[itemId].quantidade === 0) {
        delete pedidoAtual[itemId];
    }

    // Atualiza a interface (será implementada no HTML)
    renderizarPedido();
}

// 3. Função para gerar a mensagem e o link do WhatsApp
function gerarLinkWhatsapp() {
    let mensagem = "*NOVO PEDIDO DE MESA/BALCÃO*\n\n";
    let totalGeral = 0;

    // Converte o objeto do pedido para uma lista de itens
    const itensNoCarrinho = Object.values(pedidoAtual);

    if (itensNoCarrinho.length === 0) {
        alert("Por favor, selecione pelo menos um item.");
        return;
    }

    // Loop para formatar cada item do pedido
    itensNoCarrinho.forEach(item => {
        const subtotal = item.quantidade * item.preco;
        totalGeral += subtotal;
        mensagem += `${item.quantidade}x ${item.nome} - €${item.preco.toFixed(2)} (Subtotal: €${subtotal.toFixed(2)})\n`;
    });

    mensagem += `\n*TOTAL GERAL: €${totalGeral.toFixed(2)}*`;
    mensagem += "\n\n(Por favor, adicione o número da mesa ou do pedido no balcão: XXX)";

    // Codifica a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);

    // Cria o link final (API oficial do WhatsApp)
    const link = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMERO}&text=${mensagemCodificada}`;

    // Abre o WhatsApp
    window.open(link, '_blank');
}

// 4. Função para renderizar (mostrar) o menu e o resumo do pedido na tela
function renderizarPedido() {
    const listaItensHtml = document.getElementById('lista-itens');
    const resumoPedidoHtml = document.getElementById('resumo-pedido');
    const totalHtml = document.getElementById('total-geral');
    let totalGeral = 0;
    
    // 4a. Renderizar o Menu (Apenas se for a primeira vez)
    if (listaItensHtml.innerHTML === "") {
        menuItens.forEach(item => {
            listaItensHtml.innerHTML += `
                <div class="item" data-id="${item.id}">
                    <span class="nome-item">${item.nome}</span>
                    <span class="preco-item">€${item.preco.toFixed(2)}</span>
                    <div class="controles">
                        <button onclick="atualizarPedido(${item.id}, 'remover')">-</button>
                        <span id="quantidade-${item.id}" class="quantidade">0</span>
                        <button onclick="atualizarPedido(${item.id}, 'adicionar')">+</button>
                    </div>
                </div>
            `;
        });
    }

    // 4b. Atualizar o Resumo e as Quantidades
    let resumoHtml = '';
    Object.values(pedidoAtual).forEach(item => {
        const subtotal = item.quantidade * item.preco;
        totalGeral += subtotal;
        
        // Atualiza a quantidade ao lado do item no menu principal
        document.getElementById(`quantidade-${item.id}`).innerText = item.quantidade;
        
        // Adiciona ao resumo
        resumoHtml += `<p>${item.quantidade}x ${item.nome} (${subtotal.toFixed(2)}€)</p>`;
    });

    resumoPedidoHtml.innerHTML = resumoHtml === '' ? '<p>Seu pedido está vazio.</p>' : resumoHtml;
    totalHtml.innerText = totalGeral.toFixed(2);
}

// 5. Inicialização: Renderiza o menu quando a página carregar
document.addEventListener('DOMContentLoaded', renderizarPedido);