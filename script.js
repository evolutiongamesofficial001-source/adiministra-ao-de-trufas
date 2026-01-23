function verificar() {
    const resposta = document.getElementById("resposta").value.trim().toLowerCase();
    const mensagem = document.getElementById("mensagem");

    if (resposta === "trufa") {
        window.location.href = "adm.html";
    } else {
        mensagem.textContent = "Palavra incorreta 😕";
    }
}
