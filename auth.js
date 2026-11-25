/* GFF — Autenticação, vínculo familiar, recuperação e alteração de senha */
(() => {
  "use strict";

  const GFF = (window.GFF = window.GFF || {});

  GFF.session = {
    user: null,
    familyId: null,
    familyName: null,
    role: null,
    ready: false,
    isRecovery: false
  };

  const els = {};

  function cacheElements() {
    els.loginScreen = document.getElementById("login-screen");
    els.appShell = document.querySelector(".app-shell");
    els.loginForm = document.getElementById("login-form");
    els.recoveryForm = document.getElementById("recovery-form");
    els.email = document.getElementById("login-email");
    els.password = document.getElementById("login-password");
    els.newPassword = document.getElementById("new-password");
    els.confirmPassword = document.getElementById("confirm-password");
    els.togglePass = document.getElementById("toggle-password");
    els.loginBtn = document.getElementById("login-btn");
    els.recoveryBtn = document.getElementById("recovery-btn");
    els.loginError = document.getElementById("login-error");
    els.recoveryError = document.getElementById("recovery-error");
    els.loginLoading = document.getElementById("login-loading");
    els.forgotLink = document.getElementById("forgot-password-link");
    els.backToLogin = document.getElementById("back-to-login");
    els.familyChip = document.querySelector(".family-chip strong");
    els.familySub = document.querySelector(".family-chip small");
    els.profileBtn = document.querySelector(".profile");
    els.logoutBtn = document.getElementById("logout-btn");
    els.syncStatus = document.querySelector(".sync-status");
    els.loginTitle = document.getElementById("login-title");
    els.loginSubtitle = document.getElementById("login-subtitle");
    // Alterar senha
    els.changePassBtn = document.getElementById("change-password-btn");
    els.changePassModal = document.getElementById("change-password-modal");
    els.changePassForm = document.getElementById("change-password-form");
    els.changeNewPass = document.getElementById("change-new-password");
    els.changeConfirmPass = document.getElementById("change-confirm-password");
    els.changePassError = document.getElementById("change-pass-error");
    els.changePassSuccess = document.getElementById("change-pass-success");
    els.changePassSubmit = document.getElementById("change-pass-submit");
    els.changePassClose = document.getElementById("change-pass-close");
    els.changePassCancel = document.getElementById("change-pass-cancel");
  }

  function showLogin() {
    GFF.session.isRecovery = false;
    if (els.loginScreen) els.loginScreen.hidden = false;
    if (els.appShell) els.appShell.hidden = true;
    document.body.classList.add("login-active");
    if (els.loginForm) els.loginForm.hidden = false;
    if (els.recoveryForm) els.recoveryForm.hidden = true;
    if (els.loginTitle) els.loginTitle.textContent = "Entrar na sua conta";
    if (els.loginSubtitle) els.loginSubtitle.textContent = "Acesse o espaço financeiro da sua família de forma segura.";
    clearErrors();
  }

  function showRecovery() {
    GFF.session.isRecovery = true;
    if (els.loginScreen) els.loginScreen.hidden = false;
    if (els.appShell) els.appShell.hidden = true;
    document.body.classList.add("login-active");
    if (els.loginForm) els.loginForm.hidden = true;
    if (els.recoveryForm) els.recoveryForm.hidden = false;
    if (els.loginTitle) els.loginTitle.textContent = "Definir nova senha";
    if (els.loginSubtitle) els.loginSubtitle.textContent = "Crie uma nova senha para a sua conta.";
    clearErrors();
  }

  function showApp() {
    if (els.loginScreen) els.loginScreen.hidden = true;
    if (els.appShell) els.appShell.hidden = false;
    document.body.classList.remove("login-active");
    updateFamilyUI();
  }

  function openChangePasswordModal() {
    if (!els.changePassModal) return;
    clearChangePassMessages();
    if (els.changeNewPass) els.changeNewPass.value = "";
    if (els.changeConfirmPass) els.changeConfirmPass.value = "";
    els.changePassModal.hidden = false;
    document.body.classList.add("modal-open");
    if (els.changeNewPass) els.changeNewPass.focus();
  }

  function closeChangePasswordModal() {
    if (els.changePassModal) els.changePassModal.hidden = true;
    document.body.classList.remove("modal-open");
    clearChangePassMessages();
  }

  function clearChangePassMessages() {
    if (els.changePassError) {
      els.changePassError.textContent = "";
      els.changePassError.hidden = true;
    }
    if (els.changePassSuccess) {
      els.changePassSuccess.textContent = "";
      els.changePassSuccess.hidden = true;
    }
  }

  function setLoading(isLoading, mode = "login") {
    if (mode === "login") {
      if (els.loginLoading) els.loginLoading.hidden = !isLoading;
      if (els.loginBtn) {
        els.loginBtn.disabled = isLoading;
        els.loginBtn.textContent = isLoading ? "Entrando…" : "Entrar";
      }
      if (els.email) els.email.disabled = isLoading;
      if (els.password) els.password.disabled = isLoading;
    } else if (mode === "recovery") {
      if (els.recoveryBtn) {
        els.recoveryBtn.disabled = isLoading;
        els.recoveryBtn.textContent = isLoading ? "Salvando…" : "Salvar nova senha";
      }
      if (els.newPassword) els.newPassword.disabled = isLoading;
      if (els.confirmPassword) els.confirmPassword.disabled = isLoading;
    } else if (mode === "change") {
      if (els.changePassSubmit) {
        els.changePassSubmit.disabled = isLoading;
        els.changePassSubmit.textContent = isLoading ? "Salvando…" : "Salvar nova senha";
      }
      if (els.changeNewPass) els.changeNewPass.disabled = isLoading;
      if (els.changeConfirmPass) els.changeConfirmPass.disabled = isLoading;
    }
  }

  function showError(msg, target = "login") {
    const map = { login: els.loginError, recovery: els.recoveryError, change: els.changePassError };
    const el = map[target];
    if (el) {
      el.textContent = msg;
      el.hidden = false;
    }
  }

  function clearErrors() {
    [els.loginError, els.recoveryError].forEach(el => {
      if (el) { el.textContent = ""; el.hidden = true; }
    });
  }

  function updateFamilyUI() {
    const name = GFF.session.familyName || "Minha família";
    const roleLabel =
      GFF.session.role === "owner" ? "Proprietário" :
      GFF.session.role === "member" ? "Membro" : "Acesso familiar";

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
      throw new Error("Sua conta ainda não está vinculada a nenhuma família. Solicite um convite ao proprietário.");
    }

    const membership = memberships[0];
    GFF.session.familyId = membership.family_id;
    GFF.session.role = membership.role;

    const { data: family, error: famErr } = await supabase
      .from("families")
      .select("id, name")
      .eq("id", membership.family_id)
      .single();

    GFF.session.familyName = (!famErr && family) ? (family.name || "Família") : "Família";
  }

  async function handleSession(session, event) {
    const supabase = await GFF.getSupabase();

    if (event === "PASSWORD_RECOVERY") {
      GFF.session.user = session?.user || null;
      GFF.session.isRecovery = true;
      GFF.session.ready = true;
      showRecovery();
      return;
    }

    if (!session || !session.user) {
      GFF.session.user = null;
      GFF.session.familyId = null;
      GFF.session.familyName = null;
      GFF.session.role = null;
      GFF.session.isRecovery = false;
      GFF.session.ready = true;
      showLogin();
      return;
    }

    try {
      GFF.session.user = session.user;
      GFF.session.isRecovery = false;
      await loadFamilyContext(supabase, session.user.id);
      GFF.session.ready = true;
      showApp();
    } catch (err) {
      console.error(err);
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

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || event === "USER_DELETED") {
        await handleSession(null, event);
      } else if (
        event === "SIGNED_IN" ||
        event === "TOKEN_REFRESHED" ||
        event === "INITIAL_SESSION" ||
        event === "PASSWORD_RECOVERY"
      ) {
        await handleSession(session, event);
      }
    });

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Erro ao obter sessão:", error);
      showLogin();
      GFF.session.ready = true;
      return;
    }

    if (data.session) {
      const hash = window.location.hash || "";
      if (hash.includes("type=recovery") || GFF.session.isRecovery) {
        await handleSession(data.session, "PASSWORD_RECOVERY");
      } else {
        await handleSession(data.session, "INITIAL_SESSION");
      }
    } else {
      await handleSession(null, "INITIAL_SESSION");
    }
  }

  async function onLoginSubmit(e) {
    e.preventDefault();
    clearErrors();
    const email = (els.email?.value || "").trim();
    const password = els.password?.value || "";

    if (!email || !password) {
      showError("Informe e-mail e senha.");
      return;
    }

    setLoading(true, "login");
    try {
      const supabase = await GFF.getSupabase();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        let msg = "Não foi possível entrar. Verifique seus dados.";
        if (error.message?.includes("Invalid login credentials")) msg = "E-mail ou senha incorretos.";
        else if (error.message?.includes("Email not confirmed")) msg = "Confirme seu e-mail antes de entrar.";
        else if (error.message) msg = error.message;
        showError(msg);
        setLoading(false, "login");
      }
    } catch (err) {
      showError("Erro de conexão. Tente novamente.");
      setLoading(false, "login");
    }
  }

  async function onRecoverySubmit(e) {
    e.preventDefault();
    clearErrors();
    const newPass = els.newPassword?.value || "";
    const confirm = els.confirmPassword?.value || "";

    if (!newPass || newPass.length < 6) {
      showError("A nova senha deve ter pelo menos 6 caracteres.", "recovery");
      return;
    }
    if (newPass !== confirm) {
      showError("As senhas não coincidem.", "recovery");
      return;
    }

    setLoading(true, "recovery");
    try {
      const supabase = await GFF.getSupabase();
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) {
        showError(error.message || "Não foi possível atualizar a senha.", "recovery");
        setLoading(false, "recovery");
        return;
      }
      const { data } = await supabase.auth.getSession();
      await handleSession(data.session, "SIGNED_IN");
    } catch (err) {
      showError("Erro de conexão. Tente novamente.", "recovery");
      setLoading(false, "recovery");
    }
  }

  async function onChangePasswordSubmit(e) {
    e.preventDefault();
    clearChangePassMessages();

    const newPass = els.changeNewPass?.value || "";
    const confirm = els.changeConfirmPass?.value || "";

    if (!newPass || newPass.length < 6) {
      showError("A nova senha deve ter pelo menos 6 caracteres.", "change");
      return;
    }
    if (newPass !== confirm) {
      showError("As senhas não coincidem.", "change");
      return;
    }

    setLoading(true, "change");
    try {
      const supabase = await GFF.getSupabase();
      const { error } = await supabase.auth.updateUser({ password: newPass });

      if (error) {
        showError(error.message || "Não foi possível atualizar a senha.", "change");
        setLoading(false, "change");
        return;
      }

      if (els.changePassSuccess) {
        els.changePassSuccess.textContent = "Senha alterada com sucesso!";
        els.changePassSuccess.hidden = false;
      }
      if (els.changeNewPass) els.changeNewPass.value = "";
      if (els.changeConfirmPass) els.changeConfirmPass.value = "";
      setLoading(false, "change");

      // Fecha o modal após 1,5s
      setTimeout(() => closeChangePasswordModal(), 1500);
    } catch (err) {
      showError("Erro de conexão. Tente novamente.", "change");
      setLoading(false, "change");
    }
  }

  async function onForgotPassword(e) {
    e.preventDefault();
    clearErrors();
    const email = (els.email?.value || "").trim();
    if (!email) {
      showError("Digite seu e-mail primeiro e depois clique em “Esqueci a senha”.");
      return;
    }
    setLoading(true, "login");
    try {
      const supabase = await GFF.getSupabase();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname
      });
      if (error) {
        showError(error.message || "Não foi possível enviar o e-mail de recuperação.");
      } else {
        showError("Enviamos um link de recuperação para o seu e-mail. Verifique a caixa de entrada e o spam.");
      }
    } catch (err) {
      showError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false, "login");
    }
  }

  async function onLogout() {
    try {
      const supabase = await GFF.getSupabase();
      await supabase.auth.signOut();
    } catch (err) {
      GFF.session.user = null;
      GFF.session.familyId = null;
      GFF.session.familyName = null;
      GFF.session.role = null;
      showLogin();
    }
  }

  function bindEvents() {
    if (els.loginForm) els.loginForm.addEventListener("submit", onLoginSubmit);
    if (els.recoveryForm) els.recoveryForm.addEventListener("submit", onRecoverySubmit);
    if (els.changePassForm) els.changePassForm.addEventListener("submit", onChangePasswordSubmit);

    if (els.togglePass && els.password) {
      els.togglePass.addEventListener("click", () => {
        const isPass = els.password.type === "password";
        els.password.type = isPass ? "text" : "password";
        els.togglePass.textContent = isPass ? "Ocultar" : "Mostrar";
      });
    }

    if (els.forgotLink) els.forgotLink.addEventListener("click", onForgotPassword);
    if (els.backToLogin) els.backToLogin.addEventListener("click", (e) => { e.preventDefault(); showLogin(); });
    if (els.logoutBtn) els.logoutBtn.addEventListener("click", onLogout);

    // Alterar senha
    if (els.changePassBtn) els.changePassBtn.addEventListener("click", openChangePasswordModal);
    if (els.profileBtn) els.profileBtn.addEventListener("click", openChangePasswordModal);
    if (els.changePassClose) els.changePassClose.addEventListener("click", closeChangePasswordModal);
    if (els.changePassCancel) els.changePassCancel.addEventListener("click", closeChangePasswordModal);

    // Fechar modal clicando fora
    if (els.changePassModal) {
      els.changePassModal.addEventListener("click", (e) => {
        if (e.target === els.changePassModal) closeChangePasswordModal();
      });
    }
  }

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
