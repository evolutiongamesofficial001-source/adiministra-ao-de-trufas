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

let pedidosExistentes = new Set();
let primeiraCarga = true;

// VOLTAR
function voltarPainel() {
    window.location.href = "adm.html";
}

// ALERTA
function mostrarAlerta() {
    alerta.style.display = "block";
    setTimeout(() => alerta.style.display = "none", 3000);
}

// RESUMIR TEXTO
function resumir(texto, limite = 60) {
    if (!texto) return "—";
    return texto.length > limite ? texto.slice(0, limite) + "..." : texto;
}

// MODAL — MOSTRA SÓ A LINHA DO PEDIDO
function abrirModal(pedido) {
    if (pedido.pedido) {
        modalTexto.textContent = pedido.pedido;
    } else if (pedido.sabores) {
        modalTexto.textContent = Array.isArray(pedido.sabores)
            ? pedido.sabores.join(", ")
            : pedido.sabores;
    } else {
        modalTexto.textContent = "Pedido não informado.";
    }

    modal.style.display = "flex";
}

function fecharModal() {
    modal.style.display = "none";
}

// LISTENER FIREBASE (CORRIGIDO)
database.ref("pedidos").on("value", snapshot => {
    lista.innerHTML = "";

    // 👉 SE NÃO EXISTIR NENHUM PEDIDO
    if (!snapshot.exists()) {
        lista.innerHTML = `
            <div class="pedido">
                <small><i>Nenhum pedido no momento 🍫</i></small>
            </div>
        `;
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

        const div = document.createElement("div");
        div.className = "pedido";
        div.onclick = () => abrirModal(pedido);

        div.innerHTML = `
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

            <button class="botao-entregue"
                onclick="event.stopPropagation(); entregarPedido('${id}')">
                ✔ Entregue
            </button>
        `;

        lista.appendChild(div);
    });

    primeiraCarga = false;
});

// REMOVER
function entregarPedido(id) {
    if (confirm("Confirmar entrega do pedido?")) {
        database.ref("pedidos/" + id).remove();
    }
}
