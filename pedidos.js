const pedidos = [
    { cliente: "Carlos", item: "Trufa de chocolate" },
    { cliente: "Maria", item: "Trufa branca" },
    { cliente: "João", item: "Trufa meio amarga" }
];

const lista = document.getElementById("listaPedidos");

pedidos.forEach(pedido => {
    const div = document.createElement("div");
    div.className = "pedido";
    div.innerHTML = `
        <strong>${pedido.cliente}</strong><br>
        ${pedido.item}
    `;
    lista.appendChild(div);
});

function confirmarPedidos() {
    alert("Pedidos confirmados com sucesso 💖");
}
