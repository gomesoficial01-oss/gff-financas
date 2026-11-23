/* GFF — Autenticação e vínculo familiar */
(() => {
  "use strict";

  const GFF = (window.GFF = window.GFF || {});

  // Estado da sessão atual
  GFF.session = {
    user: null,
    familyId: null,
    familyName: null,
    role: null,
    ready: false
  };

  const els = {};

  function cacheElements() {
    els.loginScreen = document.getElementById("login-screen");
    els.appShell = document.querySelector(".app-shell");
    els.loginForm = document.getElementById("login-form");
    els.email = document.getElementById("login-email");
    els.password = document.getElementById("login-password");
    els.togglePass = document.getElementById("toggle-password");
    els.loginBtn = document.getElementById("login-btn");
    els.loginError = document.getElementById("login-error");
    els.loginLoading = document.getElementById("login-loading");
    els.familyChip = document.querySelector(".family-chip strong");
    els.familySub = document.querySelector(".family-chip small");
    els.profileBtn = document.querySelector(".profile");
    els.logoutBtn = document.getElementById("logout-btn");
    els.syncStatus = document.querySelector(".sync-status");
  }

  function showLogin() {
    if (els.loginScreen) els.loginScreen.hidden = false;
    if (els.appShell) els.appShell.hidden = true;
    document.body.classList.add("login-active");
    clearError();
  }

  function showApp() {
    if (els.loginScreen) els.loginScreen.hidden = true;
    if (els.appShell) els.appShell.hidden = false;
    document.body.classList.remove("login-active");
    updateFamilyUI();
  }

  function setLoading(isLoading) {
    if (els.loginLoading) els.loginLoading.hidden = !isLoading;
    if (els.loginBtn) {
      els.loginBtn.disabled = isLoading;
      els.loginBtn.textContent = isLoading ? "Entrando…" : "Entrar";
    }
    if (els.email) els.email.disabled = isLoading;
    if (els.password) els.password.disabled = isLoading;
  }

  function showError(msg) {
    if (els.loginError) {
      els.loginError.textContent = msg;
      els.loginError.hidden = false;
    }
  }

  function clearError() {
    if (els.loginError) {
      els.loginError.textContent = "";
      els.loginError.hidden = true;
    }
  }

  function updateFamilyUI() {
    const name = GFF.session.familyName || "Minha família";
    const roleLabel =
      GFF.session.role === "owner"
        ? "Proprietário"
        : GFF.session.role === "member"
          ? "Membro"
          : "Acesso familiar";

    if (els.familyChip) els.familyChip.textContent = name;
    if (els.familySub) els.familySub.textContent = roleLabel;

    if (els.profileBtn) {
      const initial = (GFF.session.user?.email || "U").charAt(0).toUpperCase();
      els.profileBtn.textContent = initial;
      els.profileBtn.title = GFF.session.user?.email || "";
    }

    if (els.syncStatus) {
      els.syncStatus.innerHTML = "<i></i> Conectado";
      els.syncStatus.classList.add("online");
    }
  }

  async function loadFamilyContext(supabase, userId) {
    // Busca o vínculo do usuário na família
    const { data: memberships, error: memErr } = await supabase
      .from("family_members")
      .select("family_id, role")
      .eq("user_id", userId)
      .limit(1);

    if (memErr) {
      console.error("Erro ao buscar family_members:", memErr);
      throw new Error("Não foi possível verificar seu vínculo familiar. Tente novamente.");
    }

    if (!memberships || memberships.length === 0) {
      throw new Error(
        "Sua conta ainda não está vinculada a nenhuma família. Solicite um convite ao proprietário."
      );
    }

    const membership = memberships[0];
    GFF.session.familyId = membership.family_id;
    GFF.session.role = membership.role;

    // Busca o nome da família
    const { data: family, error: famErr } = await supabase
      .from("families")
      .select("id, name")
      .eq("id", membership.family_id)
      .single();

    if (famErr || !family) {
      console.error("Erro ao buscar família:", famErr);
      // Não bloqueia se o nome falhar; usa valor padrão
      GFF.session.familyName = "Família";
    } else {
      GFF.session.familyName = family.name || "Família";
    }
  }

  async function handleSession(session) {
    const supabase = await GFF.getSupabase();

    if (!session || !session.user) {
      GFF.session.user = null;
      GFF.session.familyId = null;
      GFF.session.familyName = null;
      GFF.session.role = null;
      GFF.session.ready = true;
      showLogin();
      return;
    }

    try {
      GFF.session.user = session.user;
      await loadFamilyContext(supabase, session.user.id);
      GFF.session.ready = true;
      showApp();
    } catch (err) {
      console.error(err);
      // Sessão válida, mas sem vínculo familiar → força logout e mostra mensagem
      await supabase.auth.signOut();
      GFF.session.user = null;
      GFF.session.familyId = null;
      GFF.session.familyName = null;
      GFF.session.role = null;
      GFF.session.ready = true;
      showLogin();
      showError(err.message || "Acesso não autorizado à família.");
    }
  }

  async function initAuth() {
    cacheElements();

    const supabase = await GFF.getSupabase();

    // Listener de mudanças de autenticação
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        await handleSession(null);
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
        await handleSession(session);
      }
    });

    // Verifica sessão inicial
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Erro ao obter sessão:", error);
      showLogin();
      GFF.session.ready = true;
      return;
    }
    await handleSession(data.session);
  }

  async function onLoginSubmit(e) {
    e.preventDefault();
    clearError();

    const email = (els.email?.value || "").trim();
    const password = els.password?.value || "";

    if (!email || !password) {
      showError("Informe e-mail e senha.");
      return;
    }

    setLoading(true);

    try {
      const supabase = await GFF.getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        let msg = "Não foi possível entrar. Verifique seus dados.";
        if (error.message?.includes("Invalid login credentials")) {
          msg = "E-mail ou senha incorretos.";
        } else if (error.message?.includes("Email not confirmed")) {
          msg = "Confirme seu e-mail antes de entrar.";
        } else if (error.message) {
          msg = error.message;
        }
        showError(msg);
        setLoading(false);
        return;
      }

      // O onAuthStateChange vai cuidar do resto
      // Mantém loading até o handleSession finalizar
    } catch (err) {
      console.error(err);
      showError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  async function onLogout() {
    try {
      const supabase = await GFF.getSupabase();
      await supabase.auth.signOut();
      // onAuthStateChange cuida da UI
    } catch (err) {
      console.error("Erro ao sair:", err);
      // Força limpeza local mesmo assim
      GFF.session.user = null;
      GFF.session.familyId = null;
      GFF.session.familyName = null;
      GFF.session.role = null;
      showLogin();
    }
  }

  function bindEvents() {
    if (els.loginForm) {
      els.loginForm.addEventListener("submit", onLoginSubmit);
    }

    if (els.togglePass && els.password) {
      els.togglePass.addEventListener("click", () => {
        const isPass = els.password.type === "password";
        els.password.type = isPass ? "text" : "password";
        els.togglePass.textContent = isPass ? "Ocultar" : "Mostrar";
        els.togglePass.setAttribute("aria-label", isPass ? "Ocultar senha" : "Mostrar senha");
      });
    }

    if (els.logoutBtn) {
      els.logoutBtn.addEventListener("click", onLogout);
    }
  }

  // Inicialização quando o DOM estiver pronto
  function start() {
    cacheElements();
    bindEvents();
    initAuth().catch((err) => {
      console.error("Falha ao iniciar autenticação:", err);
      showLogin();
      showError("Não foi possível iniciar o sistema de autenticação.");
      GFF.session.ready = true;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
