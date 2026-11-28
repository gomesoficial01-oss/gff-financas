const $ = id => document.getElementById(id);
const TELAS = ["t-login", "t-esqueci", "t-nova", "t-sem", "t-app"];
const mostrar = t => TELAS.forEach(x => $(x).hidden = x !== t);
const msg = (id, txt, tipo = "erro") => { $(id).textContent = txt; $(id).className = "msg " + tipo; };
const traduz = e => {
  const m = (e && e.message || "").toLowerCase();
  if (m.includes("invalid login")) return "E-mail ou senha incorretos.";
  if (m.includes("rate limit")) return "Muitas tentativas. Aguarde alguns minutos.";
  if (m.includes("same password")) return "A nova senha deve ser diferente da atual.";
  if (m.includes("at least")) return "A senha deve ter no mínimo 8 caracteres.";
  if (m.includes("network") || m.includes("fetch")) return "Sem conexão. Tente novamente.";
  return "Algo deu errado. Tente novamente.";
};
window.GFF = { familia: null, papel: null, userId: null };
let recuperando = false;

async function carregarFamilia(user) {
  const { data, error } = await sb.from("family_members")
    .select("role, family_id, families(name)").eq("user_id", user.id).limit(1).maybeSingle();
  if (error || !data) return false;
  GFF.userId = user.id; GFF.familia = data.family_id; GFF.papel = data.role;
  $("h-fam").textContent = (data.families && data.families.name) || "Minha família";
  $("h-papel").textContent = data.role === "owner" ? "Proprietário" : "Membro";
  return true;
}
async function iniciar() {
  const { data: { session } } = await sb.auth.getSession();
  if (recuperando) return mostrar("t-nova");
  if (!session) return mostrar("t-login");
  if (await carregarFamilia(session.user)) { mostrar("t-app"); window.onEntrar && window.onEntrar(); }
  else mostrar("t-sem");
}
sb.auth.onAuthStateChange(ev => {
  if (ev === "PASSWORD_RECOVERY") { recuperando = true; mostrar("t-nova"); }
  if (ev === "SIGNED_OUT") mostrar("t-login");
});
$("f-login").onsubmit = async e => {
  e.preventDefault(); msg("m-login", "Entrando…", "ok");
  const { error } = await sb.auth.signInWithPassword({ email: $("l-email").value.trim(), password: $("l-senha").value });
  if (error) return msg("m-login", traduz(error));
  $("l-senha").value = ""; msg("m-login", ""); iniciar();
};
$("b-esqueci").onclick = () => mostrar("t-esqueci");
$("b-voltar").onclick = () => mostrar("t-login");
$("f-esqueci").onsubmit = async e => {
  e.preventDefault();
  const { error } = await sb.auth.resetPasswordForEmail($("e-email").value.trim(), { redirectTo: location.origin + location.pathname });
  msg("m-esqueci", error ? traduz(error) : "Se o e-mail estiver cadastrado, você receberá o link em instantes.", error ? "erro" : "ok");
};
async function trocarSenha(a, b, m) {
  if (a !== b) { msg(m, "As senhas não coincidem."); return false; }
  if (a.length < 8) { msg(m, "A senha deve ter no mínimo 8 caracteres."); return false; }
  const { error } = await sb.auth.updateUser({ password: a });
  if (error) { msg(m, traduz(error)); return false; }
  return true;
}
$("f-nova").onsubmit = async e => {
  e.preventDefault();
  if (await trocarSenha($("n-senha").value, $("n-senha2").value, "m-nova")) {
    recuperando = false; history.replaceState(null, "", location.pathname); iniciar();
  }
};
$("b-alterar").onclick = () => { $("f-alt").reset(); msg("m-alt", ""); $("d-senha").showModal(); };
$("a-cancel").onclick = () => $("d-senha").close();
$("f-alt").onsubmit = async e => {
  e.preventDefault();
  if (await trocarSenha($("a-senha").value, $("a-senha2").value, "m-alt")) {
    msg("m-alt", "Senha alterada com sucesso.", "ok"); setTimeout(() => $("d-senha").close(), 1200);
  }
};
document.querySelectorAll(".sair").forEach(b => b.onclick = async () => { await sb.auth.signOut(); GFF.familia = null; });
iniciar();
