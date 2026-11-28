const brl = v => Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const TIPOS = { corrente: "Conta corrente", poupanca: "Poupança", carteira: "Carteira", investimento: "Investimento" };

async function listarContas() {
  const { data, error } = await sb.from("accounts").select("id,name,type,initial_balance").eq("family_id", GFF.familia).order("created_at");
  const el = document.getElementById("lista");
  if (error) { el.innerHTML = '<div class="vazio">Não foi possível carregar as contas. Rode o SQL em supabase/001_contas.sql.</div>'; return; }
  document.getElementById("total").textContent = brl(data.reduce((s, c) => s + Number(c.initial_balance), 0));
  el.innerHTML = "";
  if (!data.length) { el.innerHTML = '<div class="vazio">Nenhuma conta ainda. Adicione a primeira abaixo.</div>'; return; }
  data.forEach(c => {
    const d = document.createElement("div"); d.className = "item";
    const i = document.createElement("div"), n = document.createElement("b"), t = document.createElement("div");
    n.textContent = c.name; t.className = "mut"; t.textContent = TIPOS[c.type] || c.type; i.append(n, t);
    const v = document.createElement("span"); v.className = "v" + (c.initial_balance < 0 ? " neg" : ""); v.textContent = brl(c.initial_balance);
    d.append(i, v);
    if (GFF.papel === "owner") {
      const x = document.createElement("button"); x.textContent = "Excluir"; x.setAttribute("aria-label", "Excluir conta " + c.name);
      x.onclick = async () => { if (confirm("Excluir a conta " + c.name + "?")) { await sb.from("accounts").delete().eq("id", c.id); listarContas(); } };
      d.append(x);
    }
    el.append(d);
  });
}
document.getElementById("f-conta").onsubmit = async e => {
  e.preventDefault();
  const m = document.getElementById("m-conta");
  const { error } = await sb.from("accounts").insert({
    family_id: GFF.familia, created_by: GFF.userId,
    name: document.getElementById("c-nome").value.trim(),
    type: document.getElementById("c-tipo").value,
    initial_balance: Number(document.getElementById("c-saldo").value)
  });
  m.className = "msg " + (error ? "erro" : "ok"); m.textContent = error ? "Não foi possível salvar a conta." : "Conta adicionada.";
  if (!error) { e.target.reset(); listarContas(); }
};
window.onEntrar = listarContas;
