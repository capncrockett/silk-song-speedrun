// Small DOM helpers. Feature behavior belongs in the feature modules.
export const byId = (id) => document.getElementById(id);

export function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export function mapPin(pin) {
  return `https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=${pin}`;
}

export function link(title, href, className) {
  const anchor = node("a", className, title);
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener";
  return anchor;
}

export function links(links = []) {
  return links.map((item) => link(item.title, item.pin ? mapPin(item.pin) : item.url));
}

export function status(id, message, isError = false) {
  const target = byId(id);
  target.textContent = message;
  target.classList.toggle("error", isError);
}
