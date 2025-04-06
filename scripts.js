// Função de inicialização para carregar as tarefas salvas no localStorage
document.addEventListener("DOMContentLoaded", function() {
    carregarTarefas();
});

// Selecionar elementos do DOM
const formAdicionarTarefa = document.getElementById("form-adicionar-tarefa");
const inputNovaTarefa = document.getElementById("input-nova-tarefa");
const listaTarefas = document.getElementById("to-do-list");
const botaoLimparTudo = document.getElementById("limpar-tudo");

// Event listener para adicionar nova tarefa
formAdicionarTarefa.addEventListener("submit", function(event) {
    event.preventDefault();
    const tarefaTexto = inputNovaTarefa.value.trim();

    // Verificar se o input está vazio
    if (tarefaTexto === "") {
        alert("Por favor, insira uma tarefa!");
        return; // Sai da função
    }

    // Verificar se a tarefa já existe
    if (Array.from(listaTarefas.children).some(item => item.childNodes[1].textContent === tarefaTexto)) {
        alert("Essa tarefa já existe!");
        return; // Sai da função
    }

    adicionarTarefa(tarefaTexto);
    salvarTarefasNoLocalStorage();
    inputNovaTarefa.value = ""; // Limpa o campo de input após a adição
});


// Função para adicionar tarefa na lista e no DOM
function adicionarTarefa(tarefaTexto, concluida = false) {
    const tarefaItem = document.createElement("li");
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox-tarefa");
    checkbox.checked = concluida;
    
    if (concluida) {
        tarefaItem.style.textDecoration = "line-through";
    }
    
    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            tarefaItem.style.textDecoration = "line-through";
        } else {
            tarefaItem.style.textDecoration = "none";
        }
        salvarTarefasNoLocalStorage();
    });
    
    tarefaItem.appendChild(checkbox);
    
    // Criar um span para o texto da tarefa
    const textoSpan = document.createElement("span");
    textoSpan.classList.add("texto-tarefa");
    textoSpan.textContent = tarefaTexto;
    tarefaItem.appendChild(textoSpan);
    
    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";
    botaoRemover.classList.add("btn-remover");
    botaoRemover.addEventListener("click", function() {
        tarefaItem.remove();
        salvarTarefasNoLocalStorage();
    });
    
    tarefaItem.appendChild(botaoRemover);
    listaTarefas.appendChild(tarefaItem);
    atualizarBotaoLimpar();
}

// Função para carregar as tarefas salvas no localStorage
function carregarTarefas() {
    const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefasSalvas.forEach(tarefa => {
        adicionarTarefa(tarefa.texto, tarefa.concluida);
    });
}

// Função para salvar as tarefas no localStorage
function salvarTarefasNoLocalStorage() {
    const tarefas = Array.from(listaTarefas.children).map(tarefa => {
        return {
            texto: tarefa.querySelector('.texto-tarefa').textContent,
            concluida: tarefa.querySelector('.checkbox-tarefa').checked
        };
    });
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Atualiza a exibição do botão Limpar tudo
function atualizarBotaoLimpar() {
    if (listaTarefas.children.length > 0) {
        botaoLimparTudo.style.display = "block"; // Mostra o botão se houver tarefas
    } else {
        botaoLimparTudo.style.display = "none"; // Esconde o botão se não houver tarefas
    }
}

// Event listener para o botão Limpar tudo
botaoLimparTudo.addEventListener("click", function() {
    if (confirm("Tem certeza que deseja limpar todas as tarefas?")) {
        listaTarefas.innerHTML = ""; // Limpa a lista de tarefas
        localStorage.removeItem("tarefas"); // Remove as tarefas do localStorage
        atualizarBotaoLimpar(); // Atualiza a exibição do botão
    }
});