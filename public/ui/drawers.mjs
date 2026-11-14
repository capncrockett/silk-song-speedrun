import { byId } from "./dom.mjs";

// Shared native-dialog lifecycle; feature modules provide their opening behavior.
export function createDrawer({ id, openId, closeId, pageClass, beforeOpen, afterOpen }) {
  const drawer = byId(id);
  const trigger = byId(openId);
  let closeTimer;
  let afterClose;

  function close(callback) {
    if (!drawer.open) {
      callback?.();
      return;
    }
    if (callback) afterClose = callback;
    if (drawer.dataset.closing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawer.close();
      return;
    }
    drawer.dataset.closing = "true";
    closeTimer = window.setTimeout(() => drawer.close(), 220);
  }

  trigger.addEventListener("click", () => {
    beforeOpen?.();
    drawer.showModal();
    trigger.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add(pageClass);
    afterOpen?.();
  });
  byId(closeId).addEventListener("click", () => close());
  drawer.addEventListener("cancel", (event) => { event.preventDefault(); close(); });
  drawer.addEventListener("click", (event) => {
    if (event.target !== drawer) return;
    const bounds = drawer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
  });
  drawer.addEventListener("animationend", (event) => {
    if (event.target === drawer && drawer.dataset.closing) drawer.close();
  });
  drawer.addEventListener("close", () => {
    window.clearTimeout(closeTimer);
    delete drawer.dataset.closing;
    trigger.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove(pageClass);
    const callback = afterClose;
    afterClose = null;
    callback?.();
  });

  return { close };
}
