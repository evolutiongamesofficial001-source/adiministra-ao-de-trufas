// FIREBASE
const firebaseConfig = {
    databaseURL: "https://trufas-da-ana-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const lista = document.getElementById("listaPedidos");
const alerta = document.getElementById("alerta");

let pedidosExistentes = new Set();
let primeiraCarga = true;

// VOLTAR AO PAINEL
function voltarPainel() {
    window.location.href = "adm.html";
}

// ALERTA VISUAL
function mostrarAlerta() {
    alerta.style.display = "block";
    setTimeout(() => {
        alerta.style.display = "none";
    }, 3000);
}

// SEPARAR SABORES
function separarSabores(texto) {
    if (!texto) return [];

    return texto.split(";").flatMap(parte => {
        const [tipo, sabores] = parte.split(":");
        if (!sabores) return [];
        return sabores.split(",").map(s => `${tipo.trim()} – ${s.trim()}`);
    });
}

// LISTENER FIREBASE
database.ref("pedidos").on("value", snapshot => {
    lista.innerHTML = "";

    snapshot.forEach(child => {
        const id = child.key;
        const pedido = child.val();

        if (!pedidosExistentes.has(id) && !primeiraCarga) {
            mostrarAlerta();
        }

        pedidosExistentes.add(id);

        const sabores = separarSabores(pedido.pedido);
        const saboresHTML = sabores.map(s => `<li>${s}</li>`).join("");

        const div = document.createElement("div");
        div.className = "pedido";

        div.innerHTML = `
            <strong>${pedido.nome}</strong><br>
            <small>${pedido.data} • ${pedido.hora}</small><br><br>

            <b>Sabores:</b>
            <div class="area-sabores">
                <ul>${saboresHTML}</ul>
            </div>

            <b>Quantidade:</b> ${pedido.quantidade_total}<br>
            <b>Total:</b> <span class="total">R$ ${pedido.valor_final}</span>

            <button class="botao-entregue" onclick="entregarPedido('${id}')">
                ✔ Entregue
            </button>
        `;

        lista.appendChild(div);
    });

    primeiraCarga = false;
});

// REMOVER PEDIDO
function entregarPedido(id) {
    if (confirm("Confirmar entrega do pedido?")) {
        database.ref("pedidos/" + id).remove();
    }
}
