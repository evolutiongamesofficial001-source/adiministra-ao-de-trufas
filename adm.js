// FIREBASE
const firebaseConfig = {
    databaseURL: "https://like-deslike-e-comentario-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const lista = document.getElementById("listaSabores");
const modal = document.getElementById("modal");

// NAVEGAÇÃO
function irPedidos() {
    window.location.href = "pedidos.html";
}

// MODAL
function abrirModal() {
    modal.style.display = "flex";
}

function fecharModal() {
    modal.style.display = "none";
}

// SALVAR SABOR
function salvarSabor() {
    const nome = document.getElementById("nome").value.trim();
    const pequena = document.getElementById("pequena").value;
    const grande = document.getElementById("grande").value;

    if (!nome) {
        alert("Informe o nome do sabor");
        return;
    }

    const novo = {
        nome: nome
    };

    if (pequena) novo.pequena = Number(pequena);
    if (grande) novo.grande = Number(grande);

    database.ref("trufas").push(novo);

    document.getElementById("nome").value = "";
    document.getElementById("pequena").value = "";
    document.getElementById("grande").value = "";

    fecharModal();
}

// LISTAR SABORES
database.ref("trufas").on("value", snapshot => {
    lista.innerHTML = "";

    snapshot.forEach(child => {
        const id = child.key;
        const sabor = child.val();

        const div = document.createElement("div");
        div.className = "sabor";

        div.innerHTML = `
            <div>
                <strong>${sabor.nome}</strong><br>
                <small>
                    ${sabor.pequena ? "Pequena: R$ " + sabor.pequena : ""}
                    ${sabor.grande ? " | Grande: R$ " + sabor.grande : ""}
                </small>
            </div>
            <button onclick="removerSabor('${id}')">🗑️</button>
        `;

        lista.appendChild(div);
    });
});

// REMOVER
function removerSabor(id) {
    if (confirm("Remover este sabor?")) {
        database.ref("trufas/" + id).remove();
    }
}
