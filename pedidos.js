// FIREBASE
const firebaseConfig = {
    databaseURL: "https://trufas-da-ana-default-rtdb.firebaseio.com/"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

const lista = document.getElementById("listaPedidos");
const alerta = document.getElementById("alerta");
const modal = document.getElementById("modal");
const modalTexto = document.getElementById("modalTexto");

let primeiraCarga = true;
let pedidosExistentes = new Set();

// ===== FUNÇÕES =====
function voltarPainel() {
    window.location.href = "adm.html";
}

function mostrarAlerta() {
    alerta.style.display = "block";
    setTimeout(() => alerta.style.display = "none", 3000);
}

function resumir(texto, limite = 70) {
    if (!texto) return "—";
    return texto.length > limite ? texto.slice(0, limite) + "..." : texto;
}

function abrirModal(pedido) {
    modalTexto.textContent =
        pedido.pedido ||
        (Array.isArray(pedido.sabores)
            ? pedido.sabores.join(", ")
            : pedido.sabores || "Pedido não informado");

    modal.style.display = "flex";
}

function fecharModal() {
    modal.style.display = "none";
}

// FECHAR MODAL TOCANDO FORA
modal.addEventListener("pointerdown", (e) => {
    if (e.target === modal) fecharModal();
});

// ===== LISTENER FIREBASE =====
database.ref("pedidos").on("value", snapshot => {
    lista.innerHTML = "";

    if (!snapshot.exists()) {
        lista.innerHTML = `<div class="pedido"><i>Nenhum pedido 🍫</i></div>`;
        primeiraCarga = false;
        return;
    }

    snapshot.forEach(child => {
        const id = child.key;
        const pedido = child.val();

        if (!pedidosExistentes.has(id) && !primeiraCarga) {
            mostrarAlerta();
        }
        pedidosExistentes.add(id);

        const textoPedido =
            pedido.pedido ||
            (Array.isArray(pedido.sabores)
                ? pedido.sabores.join(", ")
                : pedido.sabores || "");

        const card = document.createElement("div");
        card.className = "pedido";

        // 🔥 FUNCIONA EM CELULAR
        card.addEventListener("pointerdown", () => abrirModal(pedido));

        card.innerHTML = `
            <strong>${pedido.nome || "Cliente"}</strong><br>
            <small>${pedido.data || ""} • ${pedido.hora || ""}</small><br><br>

            <b>Tipo:</b> ${pedido.tipo_entrega || "—"}<br>
            <b>Endereço:</b><br>
            <small>${pedido.endereco || "Retirada no local"}</small><br><br>

            <b>Pedido:</b><br>
            <small>${resumir(textoPedido)}</small><br><br>

            <b>Quantidade:</b> ${pedido.quantidade || 0}<br>
            <b>Pagamento:</b> ${pedido.pagamento || "—"}<br>
            <b>Subtotal:</b> R$ ${pedido.total || "0.00"}<br>
            <b>Frete:</b> R$ ${pedido.frete || "0.00"}<br>
            <b>Total:</b> <span class="total">R$ ${pedido.valor_final || "0.00"}</span>

            <button class="botao-entregue">✔ Entregue</button>
        `;

        const botao = card.querySelector(".botao-entregue");
        botao.addEventListener("pointerdown", (e) => {
            e.stopPropagation();
            entregarPedido(id);
        });

        lista.appendChild(card);
    });

    primeiraCarga = false;
});

// ===== REMOVER PEDIDO =====
function entregarPedido(id) {
    if (confirm("Confirmar entrega do pedido?")) {
        database.ref("pedidos/" + id).remove();
    }
}
