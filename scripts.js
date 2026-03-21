const filterMyDiscount = document.querySelector(".filter-btn.discount")
const filterMyAll = document.querySelector(".filter-btn.active")
const filterMyComputer = document.querySelector(".filter-btn.computadores")
const filterMySmartphone = document.querySelector(".filter-btn.smartphone")
const filterMyAudio = document.querySelector(".filter-btn.audio")
const filterMyAcessorios = document.querySelector(".filter-btn.acessorios")
const searchInput = document.querySelector(".filter-search")
const generateReportBtn = document.querySelector(".btn-report")
const reportContent = document.querySelector("#reportContent")

const productContainer = document.querySelector(".products-container.products-grid")

function filterMyCategory(category) {
  return menuOptions.filter(product => product.category === category)
}

function formatBRL(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  })
}

let currencyList = [...menuOptions]
let discount = false

function applyDiscount(list) {
  return list.map(p => {
    const original = p.originalPrice ?? p.price
    return {
      ...p,
      originalPrice: original,
      price: original * 0.9
    }
  })
}

function removeDiscount(list) {
  return list.map(p => ({
    ...p,
    price: p.originalPrice ?? p.price
  }))
}

function searchProducts(text) {
  return currencyList.filter(product =>
    product.name.toLowerCase().includes(text.toLowerCase())
  )
}

function renderProducts(list) {
  productContainer.innerHTML = list.map(product => {
    const base = product.originalPrice ?? product.price
    const percent = Math.round((product.price / base) * 100)

    return `
    <article class="product-card reveal" data-name="${product.name.toLowerCase()}">
      <div class="product-media">
        <img src="${product.src}" alt="${product.name}">
      </div>

      <div class="product-body">
        <div class="product-title">${product.name}</div>

        <div class="mini-chart">
          <div class="mini-chart__bar" aria-hidden="true">
            <div class="mini-chart__fill" style="width: ${percent}%;"></div>
          </div>

          <div class="mini-chart__meta">
            <span>Preço</span>
            <strong class="price" data-price="${product.price}">
              ${formatBRL(product.price)}
            </strong>
          </div>
        </div>

        <button class="product-btn" onclick="analyzeProduct('${product.name}')">
          Analisar produto
        </button>
      </div>
    </article>
    `
  }).join("")
}



function updateDiscountOnly() {
  const listToShow = discount ? applyDiscount(currencyList) : removeDiscount(currencyList)

  const cards = document.querySelectorAll(".product-card")

  cards.forEach(card => {
    const titleEl = card.querySelector(".product-title")
    const priceEl = card.querySelector(".price")
    const fillEl = card.querySelector(".mini-chart__fill")

    if (!titleEl || !priceEl || !fillEl) return

    const productName = titleEl.textContent.trim().toLowerCase()
    const product = listToShow.find(item => item.name.trim().toLowerCase() === productName)

    if (!product) return

    priceEl.textContent = formatBRL(product.price)
    priceEl.dataset.price = product.price

    fillEl.style.width = discount ? "90%" : "100%"
  })
}






function updatePricesAndBars() {
  const visibleList = discount ? applyDiscount(currencyList) : removeDiscount(currencyList)

  visibleList.forEach(product => {
    const card = document.querySelector(`.product-card[data-name="${product.name.toLowerCase()}"]`)
    if (!card) return

    const priceEl = card.querySelector(".price")
    const fillEl = card.querySelector(".mini-chart__fill")

    if (priceEl) {
      priceEl.textContent = formatBRL(product.price)
      priceEl.dataset.price = product.price
    }

    if (fillEl) {
      fillEl.style.width = discount ? "90%" : "100%"
    }
  })
}


document.querySelector(".btn.primary").addEventListener("click", function (e) {
  e.preventDefault()

  const target = document.querySelector("#produtos")
  const offset = -20
  const position = target.offsetTop - offset

  window.scrollTo({
    top: position,
    behavior: "smooth"
  })
})

document.querySelector(".btn.secondary").addEventListener("click", function (e) {
  e.preventDefault()

  const target = document.querySelector("#analise")
  const offset = 8
  const position = target.offsetTop - offset

  window.scrollTo({
    top: position,
    behavior: "smooth"
  })
})

function renderCurrency() {
  const listToShow = discount ? applyDiscount(currencyList) : removeDiscount(currencyList)
  renderProducts(listToShow)
  initReveal()
}

filterMyAll.addEventListener("click", () => {
  document.body.classList.remove("animate-bar")
  currencyList = [...menuOptions]
  renderCurrency()
})

filterMyComputer.addEventListener("click", () => {
  document.body.classList.remove("animate-bar")
  currencyList = filterMyCategory("computadores")
  renderCurrency()
})

filterMySmartphone.addEventListener("click", () => {
  document.body.classList.remove("animate-bar")
  currencyList = filterMyCategory("smartphone")
  renderCurrency()
})

filterMyAcessorios.addEventListener("click", () => {
  document.body.classList.remove("animate-bar")
  currencyList = filterMyCategory("acessorios")
  renderCurrency()
})

filterMyAudio.addEventListener("click", () => {
  document.body.classList.remove("animate-bar")
  currencyList = filterMyCategory("audio")
  renderCurrency()
})

filterMyDiscount.addEventListener("click", () => {
  discount = !discount

  const fills = document.querySelectorAll(".mini-chart__fill")
  const prices = document.querySelectorAll(".price")

  const listToShow = discount ? applyDiscount(currencyList) : removeDiscount(currencyList)

  fills.forEach(fill => {
    fill.style.width = discount ? "90%" : "100%"
  })

  prices.forEach((priceEl, index) => {
    if (listToShow[index]) {
      priceEl.textContent = formatBRL(listToShow[index].price)
      priceEl.dataset.price = listToShow[index].price
    }
  })

  filterMyDiscount.textContent = discount
    ? "Desativar Descontos"
    : "Ativar Descontos"

  filterMyDiscount.classList.toggle("active-discount")
})






renderProducts(menuOptions)

searchInput.addEventListener("input", (e) => {
  document.body.classList.remove("animate-bar")
  const value = e.target.value

  const filtered = searchProducts(value)
  const listToShow = discount ? applyDiscount(filtered) : removeDiscount(filtered)

  renderProducts(listToShow)
  initReveal()
})

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function generateInsights(list) {
  if (!list || list.length === 0) {
    reportContent.innerHTML = `<p>Nenhum dado encontrado para gerar insights.</p>`
    return
  }

  const totalRevenue = list.reduce((acc, product) => acc + product.price, 0)
  const revenueByCategory = {}

  list.forEach(product => {
    if (!revenueByCategory[product.category]) {
      revenueByCategory[product.category] = 0
    }

    revenueByCategory[product.category] += product.price
  })

  let topCategory = ""
  let topCategoryRevenue = 0

  for (const category in revenueByCategory) {
    if (revenueByCategory[category] > topCategoryRevenue) {
      topCategoryRevenue = revenueByCategory[category]
      topCategory = category
    }
  }

  const topCategoryPercent = ((topCategoryRevenue / totalRevenue) * 100).toFixed(0)

  const topProduct = list.reduce((prev, current) =>
    current.price > prev.price ? current : prev
  )

  const bestConversionCategory = "audio"
  const userGrowth = "+18%"

  reportContent.innerHTML = `
    <div class="insight-list">
      <div class="insight-item" style="animation-delay:0.2s;">
        <span>📊</span>
        <span><strong>${capitalize(topCategory)}</strong> representa <strong>${topCategoryPercent}%</strong> da receita atual.</span>
      </div>

      <div class="insight-item" style="animation-delay:0.8s;">
        <span>🎧</span>
        <span><strong>${bestConversionCategory}</strong> apresentou a melhor conversão no período.</span>
      </div>

      <div class="insight-item" style="animation-delay:1.4s;">
        <span>📈</span>
        <span>Crescimento de usuários estimado em <strong>${userGrowth}</strong>.</span>
      </div>

      <div class="insight-item" style="animation-delay:2s;">
        <span>⭐</span>
        <span>Produto destaque: <strong>${topProduct.name}</strong>.</span>
      </div>
    </div>
  `
}

generateReportBtn.addEventListener("click", () => {
  generateInsights(currencyList)
})

function exportVisibleProducts() {
  const cards = document.querySelectorAll(".product-card")
  const data = []

  cards.forEach(card => {
    const name = card.querySelector(".product-title").innerText
    const price = card.querySelector(".price").innerText

    data.push(`${name} - ${price}`)
  })

  console.log(data)
}

function exportToCSV() {
  const rows = [
    ["Produto", "Preço"],
    ["Monitor 4K", "3500"],
    ["Smartphone", "2800"]
  ]

  let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")

  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "produtos.csv")

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function baixarModeloExcel() {
  const link = document.createElement("a")

  link.href = "./excel/NexumTech.xlsx"
  link.download = "NexumTech.xlsx"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function exportExcel() {
  const listaAtual = discount
    ? applyDiscount(currencyList)
    : removeDiscount(currencyList)

  const dadosExportacao = listaAtual.map(item => ({
    Produto: item.name,
    Preco: item.price,
    Categoria: item.category
  }))

  const worksheet = XLSX.utils.json_to_sheet(dadosExportacao)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos")
  XLSX.writeFile(workbook, "relatorio_produtos.xlsx")
}

function gerarMetricas() {
  const revenue = Math.floor(Math.random() * (12200 - 12000 + 1)) + 12000
  const activeUsers = Math.floor(Math.random() * (160 - 150 + 1)) + 1230
  const growth = Math.floor(Math.random() * (22 - 18 + 1)) + 18

  document.getElementById("revenue").textContent = `R$${revenue.toLocaleString()}`
  document.getElementById("activeUsers").textContent = activeUsers.toLocaleString()
  document.getElementById("growth").textContent = `+${growth}%`
}

gerarMetricas()
setInterval(gerarMetricas, 2000)

function updateKpis() {
  document.getElementById("conversion").textContent = (4 + Math.random() * 0.3).toFixed(1) + "%"
  document.getElementById("carts").textContent = (250 + Math.floor(Math.random() * 7)).toLocaleString("pt-BR")
  document.getElementById("orders").textContent = 450 + Math.floor(Math.random() * 2)
  document.getElementById("satisfaction").textContent = (4.5 + Math.random() * 0.1).toFixed(1)
}

updateKpis()
setInterval(updateKpis, 2000)

const bars = document.querySelectorAll(".bar")

function animateBars() {
  bars.forEach(bar => {
    const randomBars = Math.floor(Math.random() * 70) + 50
    bar.style.setProperty("--h", randomBars + "%")
  })
}

animateBars()
setInterval(animateBars, 4000)

function updateTable() {
  document.getElementById("sales-computers").textContent = 200 + Math.floor(Math.random() * 40)
  document.getElementById("conv-computers").textContent = (3 + Math.random()).toFixed(1) + "%"
  document.getElementById("rev-computers").textContent = "R$ " + (55000 + Math.floor(Math.random() * 8000)).toLocaleString("pt-BR")

  document.getElementById("sales-audio").textContent = 280 + Math.floor(Math.random() * 50)
  document.getElementById("conv-audio").textContent = (3.5 + Math.random()).toFixed(1) + "%"
  document.getElementById("rev-audio").textContent = "R$ " + (20000 + Math.floor(Math.random() * 5000)).toLocaleString("pt-BR")

  document.getElementById("sales-wear").textContent = 140 + Math.floor(Math.random() * 40)
  document.getElementById("conv-wear").textContent = (2.3 + Math.random()).toFixed(1) + "%"
  document.getElementById("rev-wear").textContent = "R$ " + (16000 + Math.floor(Math.random() * 4000)).toLocaleString("pt-BR")

  document.getElementById("sales-acc").textContent = 100 + Math.floor(Math.random() * 40)
  document.getElementById("conv-acc").textContent = (1.8 + Math.random()).toFixed(1) + "%"
  document.getElementById("rev-acc").textContent = "R$ " + (5000 + Math.floor(Math.random() * 3000)).toLocaleString("pt-BR")
}

updateTable()
setInterval(updateTable, 4000)

window.analyzeProduct = function (product) {
  const modal = document.getElementById("productModal")
  const title = document.getElementById("modalProductTitle")
  const sales = document.getElementById("modalSales")
  const revenue = document.getElementById("modalRevenue")
  const conversion = document.getElementById("modalConversion")

  const bar1 = document.getElementById("modalBar1")
  const bar2 = document.getElementById("modalBar2")
  const bar3 = document.getElementById("modalBar3")
  const bar4 = document.getElementById("modalBar4")
  const bar5 = document.getElementById("modalBar5")

  const data = {
    "smartphone": {
      sales: 540,
      revenue: "R$ 7.200",
      conversion: "4.2%",
      bars: [45, 70, 55, 82, 68]
    },
    "notebook": {
      sales: 320,
      revenue: "R$ 12.800",
      conversion: "3.8%",
      bars: [60, 50, 75, 68, 90]
    },
    "gaming mouse": {
      sales: 380,
      revenue: "R$ 5.550",
      conversion: "5.1%",
      bars: [35, 58, 62, 48, 72]
    },
    "wireless earbuds": {
      sales: 620,
      revenue: "R$ 8.200",
      conversion: "4.9%",
      bars: [50, 64, 70, 88, 76]
    },
    "smartwatch": {
      sales: 240,
      revenue: "R$ 3.900",
      conversion: "3.2%",
      bars: [30, 45, 40, 52, 60]
    },
    "mechanical keyboard": {
      sales: 290,
      revenue: "R$ 4.400",
      conversion: "3.7%",
      bars: [42, 55, 48, 66, 58]
    },
    "headphone": {
      sales: 210,
      revenue: "R$ 2.800",
      conversion: "2.9%",
      bars: [28, 38, 50, 44, 56]
    },
    "4k hdr monitor": {
      sales: 180,
      revenue: "R$ 9.500",
      conversion: "2.6%",
      bars: [48, 52, 60, 70, 78]
    }
  }

  const key = product.trim().toLowerCase()
  const productData = data[key]

  if (!productData) {
    alert("Produto não encontrado: " + product)
    return
  }

  title.textContent = product
  sales.textContent = productData.sales
  revenue.textContent = productData.revenue
  conversion.textContent = productData.conversion

  bar1.style.height = productData.bars[0] + "%"
  bar2.style.height = productData.bars[1] + "%"
  bar3.style.height = productData.bars[2] + "%"
  bar4.style.height = productData.bars[3] + "%"
  bar5.style.height = productData.bars[4] + "%"

  modal.classList.add("show")
}

window.closeProductModal = function () {
  document.getElementById("productModal").classList.remove("show")
}

const openSettings = document.querySelector("#openSettings")
const settingsPopup = document.querySelector("#settingsPopup")
const closeSettings = document.querySelector("#closeSettings")

if (openSettings && settingsPopup && closeSettings) {
  openSettings.addEventListener("click", function (e) {
    e.preventDefault()
    settingsPopup.classList.add("show")
  })

  closeSettings.addEventListener("click", function () {
    settingsPopup.classList.remove("show")
  })

  settingsPopup.addEventListener("click", function (e) {
    if (e.target === settingsPopup) {
      settingsPopup.classList.remove("show")
    }
  })
}









function initReveal() {
  const elements = document.querySelectorAll(".reveal")

  function handleReveal() {
    const triggerPoint = window.innerHeight * 0.88

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const isVisible = rect.top < triggerPoint && rect.bottom > 0

      if (isVisible) {
        element.classList.add("show")
      } else {
        element.classList.remove("show")
      }
    })
  }

  window.addEventListener("scroll", handleReveal)
  window.addEventListener("resize", handleReveal)
  handleReveal()
}

window.addEventListener("DOMContentLoaded", initReveal)









const btn = document.querySelector("#button-notifications")

if (btn) {
  let active = localStorage.getItem("notifications") === "true"

  function update() {
    btn.textContent = active ? "Notificações ativadas" : "Ativar notificações"
    btn.classList.toggle("active-alert", active)
  }

  btn.addEventListener("click", () => {
    active = !active
    localStorage.setItem("notifications", active)
    update()

    if (active) {
      showNotification("🔔 Notificações ativadas")
    } else {
      showNotification("🔕 Notificações desativadas")
    }
  })

  update()
}

function showNotification(message) {
  const notif = document.createElement("div")

  notif.className = "toast-notification"
  notif.textContent = message

  document.body.appendChild(notif)

  setTimeout(() => {
    notif.classList.add("show")
  }, 100)

  setTimeout(() => {
    notif.classList.remove("show")

    setTimeout(() => {
      notif.remove()
    }, 300)
  }, 2500)
}






const hamburger = document.querySelector(".hamburger")
const sidebar = document.querySelector(".sidebar")
const navLinks = document.querySelectorAll(".sidebar .nav a")

if (hamburger && sidebar) {
  hamburger.addEventListener("click", () => {
    sidebar.classList.toggle("open")
    document.body.classList.toggle("menu-open")
  })

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open")
      document.body.classList.remove("menu-open")
    })
  })

  document.addEventListener("click", (e) => {
    const clickedInsideSidebar = sidebar.contains(e.target)
    const clickedHamburger = hamburger.contains(e.target)

    if (!clickedInsideSidebar && !clickedHamburger) {
      sidebar.classList.remove("open")
      document.body.classList.remove("menu-open")
    }
  })
}







if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual"
}

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0)
})

window.addEventListener("load", () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, 0)

  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, 50)

  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
  }, 150)
})