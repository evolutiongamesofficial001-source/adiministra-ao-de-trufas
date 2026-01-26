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

// SEPARAR SABORES (FORMATO ANTIGO)
function separarSabores(texto) {
    if (!texto || typeof texto !== "string") return [];

    return texto.split(";").flatMap(parte => {
        const [tipo, sabores] = parte.split(":");
        if (!sabores) return [];
        return sabores.split(",").map(s => `${tipo.trim()} – ${s.trim()}`);
    });
}

// NORMALIZAR SABORES (NOVO + ANTIGO)
function obterSabores(pedido) {
    // formato antigo
    if (pedido.pedido) {
        return separarSabores(pedido.pedido);
    }

    // formato novo (array)
    if (Array.isArray(pedido.sabores)) {
        return pedido.sabores;
    }

    // formato simples (string)
    if (typeof pedido.sabores === "string") {
        return pedido.sabores.split(",").map(s => s.trim());
    }

    return [];
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

        const sabores = obterSabores(pedido);

        const saboresHTML = sabores.length > 0
            ? `<b>Sabores:</b>
               <div class="area-sabores">
                   <ul>${sabores.map(s => `<li>${s}</li>`).join("")}</ul>
               </div>`
            : `<small><i>Sem sabores informados</i></small>`;

        const div = document.createElement("div");
        div.className = "pedido";

        div.innerHTML = `
            <strong>${pedido.nome || "Cliente"}</strong><br>
            <small>${pedido.data || ""} • ${pedido.hora || ""}</small><br><br>

            <b>Tipo:</b> ${pedido.tipo_entrega || "—"}<br>
            <b>Endereço:</b><br>
            <small>${pedido.endereco || "Retirada no local"}</small><br><br>

            ${saboresHTML}

            <b>Quantidade:</b> ${pedido.quantidade || 0}<br>
            <b>Pagamento:</b> ${pedido.pagamento || "—"}<br>
            <b>Subtotal:</b> R$ ${pedido.total || "0.00"}<br>
            <b>Frete:</b> R$ ${pedido.frete || "0.00"}<br>
            <b>Total:</b> <span class="total">R$ ${pedido.valor_final || "0.00"}</span>

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
