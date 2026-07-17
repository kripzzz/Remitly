(() => {
  const played = new Set();
  const reduced = () => document.body.classList.contains("reduce-motion") || matchMedia("(prefers-reduced-motion: reduce)").matches;

  function countElement(element, target, suffix = "") {
    if (!window.gsap || reduced()) { element.textContent = `${target}${suffix}`; return; }
    const proxy = { value: 0 };
    gsap.to(proxy, { value: target, duration: 1.25, ease: "power2.out", onUpdate: () => { element.textContent = `${Math.round(proxy.value)}${suffix}`; } });
  }

  window.animateCounters = (scope = document) => {
    scope.querySelectorAll("[data-count]").forEach((element) => {
      const target = Number(element.dataset.count);
      const original = element.textContent;
      const suffix = original.replace(/[\d,.]/g, "");
      countElement(element, target, suffix);
    });
    scope.querySelectorAll("[data-count-decimal]").forEach((element) => {
      const target = Number(element.dataset.countDecimal);
      const prefix = element.textContent.trim().startsWith("$") ? "$" : "";
      const suffix = element.textContent.trim().endsWith("B") ? "B" : "";
      if (!window.gsap || reduced()) { element.textContent = `${prefix}${target}${suffix}`; return; }
      const proxy = { value: 0 };
      gsap.to(proxy, { value: target, duration: 1.3, ease: "power2.out", onUpdate: () => { element.textContent = `${prefix}${proxy.value.toFixed(1)}${suffix}`; } });
    });
  };

  function friction() {
    const timeline = gsap.timeline();
    timeline.fromTo("#friction .paper-sheet", { rotateX: 76, rotateZ: -12, scale: .55, opacity: 0 }, { rotateX: 0, rotateZ: -3, scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" })
      .from("#friction .pain", { scale: 0, opacity: 0, stagger: .14, ease: "back.out(1.8)" }, "-=.4")
      .to("#friction .fee-gauge i", { width: "90%", duration: 1.2, ease: "power2.out" }, "-=.6");
    countElement(document.querySelector("#friction [data-count]"), 9);
  }

  function founders() {
    gsap.timeline().to("#founders .comic-panel", { y: 0, opacity: 1, duration: .55, stagger: .35, ease: "power2.out" })
      .from("#founders .avatar, #founders .idea-bulb, #founders .avatar-group, #founders .mini-laptop, #founders .rebrand-word", { scale: .3, rotation: -10, opacity: 0, duration: .4, stagger: .35, ease: "back.out(1.8)" }, .2);
  }

  function business() {
    const lines = document.querySelectorAll("#business-model .flow-line");
    lines.forEach((line) => { const length = line.getTotalLength(); line.style.strokeDasharray = length; line.style.strokeDashoffset = length; });
    gsap.timeline().to(lines, { strokeDashoffset: 0, duration: 1.5, stagger: .25, ease: "power2.inOut" })
      .from("#business-model .flow-node", { scale: .5, opacity: 0, transformOrigin: "center", stagger: .18, ease: "back.out(1.7)" }, .1)
      .from("#business-model .flow-label", { opacity: 0, y: 10, stagger: .15 }, "-=.5");
  }

  function geography() {
    const route = document.querySelector("#geography .geo-route");
    const length = route.getTotalLength();
    route.style.strokeDasharray = length; route.style.strokeDashoffset = length;
    gsap.timeline().from("#geography .geo-land", { opacity: 0, scale: .9, transformOrigin: "center", duration: .8 })
      .from("#geography .geo-pin", { y: -60, scale: 0, opacity: 0, stagger: .32, ease: "bounce.out" }, "-=.25")
      .to(route, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" }, .5)
      .from("#geography .year-counter", { opacity: 0, x: -25 }, "-=.5");
  }

  function status() {
    const line = document.querySelector("#status-today .ecg-line");
    const length = line.getTotalLength();
    line.style.strokeDasharray = length; line.style.strokeDashoffset = length;
    gsap.timeline().to(line, { strokeDashoffset: 0, duration: 2.3, ease: "power1.inOut" })
      .from("#status-today .ecg-labels text", { opacity: 0, y: 10, stagger: .28 }, .4);
  }

  const animations = { friction, founders, "business-model": business, geography, "status-today": status };
  window.runChapterAnimation = (slug) => {
    if (!window.gsap || reduced()) return;
    gsap.killTweensOf(`#${slug} *`);
    animations[slug]?.();
    played.add(slug);
  };
})();
