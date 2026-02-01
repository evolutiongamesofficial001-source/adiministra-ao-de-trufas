const firebaseConfig = {
    databaseURL: "https://trufas-da-ana-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const lista = document.getElementById("listaPedidos");
const alerta = document.getElementById("alerta");
const modal = document.getElementById("modal");
const modalTexto = document.getElementById("modalTexto");

let primeiraCarga = true;
let pedidosExistentes = new Set();

function voltarPainel() {
    window.location.href = "adm.html";
}

function mostrarAlerta() {
    alerta.style.display = "block";
    setTimeout(() => alerta.style.display = "none", 3000);
}

function abrirModal(pedido) {
    modalTexto.textContent = pedido.pedido || pedido.sabores || "—";
    modal.style.display = "flex";
}

function fecharModal() {
    modal.style.display = "none";
}

modal.addEventListener("pointerdown", e => {
    if (e.target === modal) fecharModal();
});

database.ref("pedidos").on("value", snapshot => {
    lista.innerHTML = "";

    snapshot.forEach(child => {
        const id = child.key;
        const pedido = child.val();

        if (!pedidosExistentes.has(id) && !primeiraCarga) {
            mostrarAlerta();
        }
        pedidosExistentes.add(id);

        const card = document.createElement("div");
        card.className = "pedido";
        card.innerHTML = `
            <strong>${pedido.nome || "Cliente"}</strong><br>
            <small>${pedido.data || ""} • ${pedido.hora || ""}</small><br><br>
            <b>Pedido:</b><br>
            <small>${pedido.pedido || "—"}</small><br><br>
            <b>Total:</b> <span class="total">R$ ${pedido.valor_final || "0.00"}</span>
            <button class="botao-entregue">✔ Entregue</button>
        `;

        card.querySelector(".botao-entregue").onclick = e => {
            e.stopPropagation();
            if (confirm("Confirmar entrega?")) {
                database.ref("pedidos/" + id).remove();
            }
        };

        card.onclick = () => abrirModal(pedido);
        lista.appendChild(card);
    });

    primeiraCarga = false;
});
