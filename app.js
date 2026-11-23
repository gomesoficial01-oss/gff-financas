(() => {
  "use strict";

  const titles = {
    dashboard: ["Dashboard", "▦", "Visão geral do dinheiro e dos compromissos."],
    budget: ["Orçamento", "◫", "Planejamento de receitas, categorias e limites mensais."],
    transactions: ["Receitas e despesas", "↕", "Registro de movimentações financeiras e histórico."],
    shopping: ["Lista de compras", "🛒", "Listas compartilhadas, fechamento de compras e integração com estoque."],
    inventory: ["Estoque", "▤", "Produtos da casa, quantidades, níveis mínimos e sugestões de reposição."],
    cards: ["Cartões e parcelas", "▣", "Cartões, compras parceladas, faturas e pagamentos."],
    bills: ["Contas e vencimentos", "▧", "Contas recorrentes, calendário e alertas."],
    goals: ["Projetos de vida", "◎", "Metas, reserva de emergência e acompanhamento dos objetivos."],
    reports: ["Relatórios", "▥", "Comparações mensais, categorias e evolução financeira."],
    assistant: ["Assistente financeiro", "✧", "Análises e recomendações. A IA não altera dados financeiros."]
  };

  function navigate(view) {
    const data = titles[view] || titles.dashboard;
    const navButtons = [...document.querySelectorAll("[data-view]")];
    const dashboard = document.getElementById("view-dashboard");
    const placeholder = document.getElementById("view-placeholder");

    navButtons.forEach(button => button.classList.toggle("active", button.dataset.view === view));
    if (dashboard) dashboard.classList.toggle("active-view", view === "dashboard");
    if (placeholder) placeholder.classList.toggle("active-view", view !== "dashboard");

    const pageTitle = document.getElementById("pageTitle");
    const placeholderTitle = document.getElementById("placeholderTitle");
    const placeholderIcon = document.getElementById("placeholderIcon");
    const placeholderText = document.getElementById("placeholderText");

    if (pageTitle) pageTitle.textContent = data[0];
    if (placeholderTitle) placeholderTitle.textContent = data[0];
    if (placeholderIcon) placeholderIcon.textContent = data[1];
    if (placeholderText) placeholderText.textContent = data[2] + " Este módulo será implementado em uma etapa própria.";

    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.classList.remove("open");
  }

  function bindNavigation() {
    document.querySelectorAll("[data-view]").forEach(button => {
      button.addEventListener("click", () => navigate(button.dataset.view));
    });
    document.querySelectorAll("[data-go]").forEach(button => {
      button.addEventListener("click", () => navigate(button.dataset.go));
    });
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu) {
      mobileMenu.addEventListener("click", () => {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) sidebar.classList.toggle("open");
      });
    }
  }

  // Service Worker
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  // Inicializa navegação assim que possível
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindNavigation);
  } else {
    bindNavigation();
  }
})();
