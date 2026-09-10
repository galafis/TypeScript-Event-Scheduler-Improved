import EventScheduler from "./dist/src/EventScheduler.js";
const scheduler = new EventScheduler();
let lang = "en";
const key = "event-scheduler-v1";
const tr = (en, pt) => (lang === "en" ? en : pt);
const message = (text) =>
  (document.querySelector("#message").textContent = text);
try {
  const saved = localStorage.getItem(key);
  if (saved) scheduler.importJSON(saved);
} catch {
  message(
    "Stored data could not be loaded / Não foi possível carregar os dados",
  );
}
function save() {
  try {
    localStorage.setItem(key, scheduler.toJSON());
    return true;
  } catch {
    message(
      tr(
        "Storage unavailable. Export a backup.",
        "Armazenamento indisponível. Exporte uma cópia.",
      ),
    );
    return false;
  }
}
function render() {
  document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
  document
    .querySelectorAll("[data-en]")
    .forEach((el) => (el.textContent = el.dataset[lang]));
  document.querySelector("#language").textContent =
    lang === "en" ? "Português" : "English";
  const list = document.querySelector("#list");
  list.replaceChildren();
  const filter = document.querySelector("#filter").value;
  const events = filter
    ? scheduler.getEventsByDate(new Date(filter + "T00:00:00Z"))
    : scheduler.getAllEvents();
  if (!events.length) {
    list.textContent = tr(
      "No events for this view.",
      "Nenhum evento nesta visualização.",
    );
    return;
  }
  for (const event of events) {
    const article = document.createElement("article");
    article.className = "entry";
    const row = document.createElement("div");
    row.className = "row";
    const title = document.createElement("h3");
    title.textContent = event.name;
    const remove = document.createElement("button");
    remove.className = "secondary";
    remove.textContent = tr("Delete", "Excluir");
    remove.setAttribute("aria-label", tr("Delete ", "Excluir ") + event.name);
    remove.onclick = () => {
      scheduler.deleteEvent(event.id);
      save();
      render();
    };
    row.append(title, remove);
    const date = document.createElement("p");
    date.textContent =
      new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "pt-BR", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }).format(event.date) + " UTC";
    const description = document.createElement("small");
    description.textContent = event.description || "";
    article.append(row, date, description);
    list.append(article);
  }
}
document.querySelector("#form").onsubmit = (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  if (
    !scheduler.addEvent({
      ...data,
      id: crypto.randomUUID(),
      date: new Date(data.date + "Z"),
    })
  ) {
    message(tr("Check the title and date.", "Verifique título e data."));
    return;
  }
  if (save()) message(tr("Event saved.", "Evento salvo."));
  event.target.reset();
  render();
};
document.querySelector("#filter").onchange = render;
document.querySelector("#language").onclick = () => {
  lang = lang === "en" ? "pt" : "en";
  render();
};
document.querySelector("#export").onclick = () => {
  const url = URL.createObjectURL(
    new Blob([scheduler.toJSON()], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "schedule.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
document.querySelector("#import").onchange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 1000000)
      throw Error("File exceeds 1 MB / arquivo maior que 1 MB");
    scheduler.importJSON(await file.text());
    save();
    render();
  } catch (error) {
    message(error.message);
  }
  event.target.value = "";
};
render();
