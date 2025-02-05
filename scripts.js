// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expenseTotal = document.querySelector("aside header h2")
const expenseQuantity = document.querySelector("aside header p span")

// Atualiza toda vez que for utilizado o input.
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "")

  value = Number(value) / 100

  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  // Formatando input para formato Real Brasileiro
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  return value
}

form.onsubmit = (event) => {
  event.preventDefault()

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  expenseAdd(newExpense)
}

// Adiciona um novo item na lista.
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para adicionar o item li na lista ul.
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o ícone da categoria.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.name)

    // Cria a informação da despeza.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")
    
    // Cria o nome da despeza.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despeza.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona as informações do item.
    expenseItem.append(expenseIcon)

    // Adicionando name e category em expenseInfo.
    expenseInfo.append(expenseName,expenseCategory)

    // Cria o valor da despeza.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Cria o ícone de remover.
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "Remover")

    // Adicionando as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    // Adiciona o Item na lista.
    expenseList.append(expenseItem)
    
    // Limpa o formulário
    formClear()
    
    // Atualiza os totais
    updateTotals()

  } catch (error) {
    alert("Não foi possível adicionar esse item na sua lista de despezas")
    console.error
  }
}

// Atualiza os totais
function updateTotals() {
  try {
    // Recupera todos os itens li's da lista ul
    const items = expenseList.children
    
    // Atualiza a quantidade de itens da lista
    expenseQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

    // Percorrer cada item da lista
    let total = 0

    for(let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")

      // Remover caracteres não númericos e substitui a vírgula por ponto.
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace("," , ".")

      // Converter o valor para float.
      value = parseFloat(value)

      // Verifica se é um numero válido.
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total. O valor não parece ser um número")
      }

      // Incrementar o valor total.
      total += Number(value)
    }

    // Cria a span para adicioanar o R$ formatado.
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpa o conteúdo do elemento
    expenseTotal.innerHTML = ""

    // Adiciona o Símbolo da moeda e o valor formatado
    expenseTotal.append(symbolBRL, total)

  } catch (error) {
    alert("Não foi possível atualizar os totais")
    console.error
  }
}

// Evento que captura o clique nas listas
expenseList.addEventListener("click", function(event) {
  // Verificar es o elemento clicado é o ícone de remover.
  if(event.target.classList.contains("remove-icon")) {
    // Obtém a li pai do elemento clicado
    const item = event.target.closest(".expense")

    // Remove o item
    item.remove()
  }

  // Atualiza os totais novamente.
  updateTotals()

})

function formClear() {
  // Limpar inputs do formulário
  amount.value = ""
  expense.value = ""
  category.value = ""

  // Coloca o foco no input Amount
  expense.focus()
}