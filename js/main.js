(() => {
  const chapterSlugs = ["friction", "founders", "business-model", "geography", "status-today"];
  const state = { content: null, current: "home", completed: new Set(JSON.parse(localStorage.getItem("remitly-completed") || "[]")) };

  async function fetchJson(url) {
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error(`${url} returned ${response.status}`);
    return response.json();
  }

  async function loadContent() {
    const fallback = await fetchJson("data/content.json");
    try {
      const [chapters, founders, revenue, milestones] = await Promise.all([
        fetchJson("/api/content"), fetchJson("/api/founders"), fetchJson("/api/revenue"), fetchJson("/api/milestones")
      ]);
      return { chapters: chapters.chapters, founders: founders.founders, revenue: revenue.revenue, milestones: milestones.milestones };
    } catch {
      document.documentElement.dataset.contentSource = "static-fallback";
      return fallback;
    }
  }

  function renderContent(data) {
    data.chapters.forEach((chapter) => {
      const slot = document.querySelector(`[data-content-slot="${chapter.slug}"]`);
      if (slot) slot.innerHTML = chapter.deepDiveHtml;
    });

    const founderGrid = document.querySelector("#founderGrid");
    founderGrid.innerHTML = data.founders.map((founder) => {
      const initials = founder.name.split(" ").map((part) => part[0]).join("");
      return `<article class="founder-card" tabindex="0" role="button" aria-label="Flip ${founder.name} card" aria-pressed="false">
        <div class="founder-face founder-front"><img src="assets/img/${founder.name.split(" ")[0].toLowerCase()}.png" class="founder-image" alt="${founder.name}"><h3>${founder.name}</h3><p>${founder.role}</p><small>Tap to flip ↻</small></div>
        <div class="founder-face founder-back"><p class="eyebrow">Background</p><p>${founder.background}</p><p class="eyebrow">Connection to the problem</p><p>${founder.personalConnection}</p><small>Tap to return ↻</small></div>
      </article>`;
    }).join("");

    founderGrid.querySelectorAll(".founder-card").forEach((card) => {
      const flip = () => {
        card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", String(card.classList.contains("is-flipped")));
      };
      card.addEventListener("click", flip);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); flip(); }
      });
    });
  }

  function updateProgress(slug) {
    document.querySelectorAll("[data-progress]").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.progress === slug);
      link.classList.toggle("is-complete", state.completed.has(link.dataset.progress));
    });
  }

  function route() {
    const requested = location.hash.replace("#", "") || "home";
    const indexAnchor = requested === "chapters";
    const slug = chapterSlugs.includes(requested) ? requested : "home";
    state.current = slug;
    document.querySelectorAll("[data-view]").forEach((view) => view.classList.toggle("is-active", view.dataset.view === slug));
    document.body.classList.toggle("in-chapter", slug !== "home");
    updateProgress(slug);
    if (indexAnchor) {
      requestAnimationFrame(() => document.querySelector("#chapters").scrollIntoView({ behavior: document.body.classList.contains("reduce-motion") ? "auto" : "smooth" }));
    } else {
      window.scrollTo({ top: 0, behavior: document.body.classList.contains("reduce-motion") ? "auto" : "smooth" });
    }
    if (slug !== "home") window.runChapterAnimation?.(slug);
    document.title = slug === "home" ? "Remitly — Decoded | Interactive Fintech Case Study" : `${document.querySelector(`#${slug} h1`).textContent} | Remitly — Decoded`;
  }

  function setupExploreButtons() {
    document.querySelectorAll("[data-explore]").forEach((button) => {
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", () => {
        const slug = button.dataset.explore;
        const panel = document.querySelector(`[data-deep-dive="${slug}"]`);
        const isOpen = panel.classList.toggle("is-open");
        button.setAttribute("aria-expanded", String(isOpen));
        button.querySelector("span").textContent = isOpen ? "Close the details" : "Explore the details";
        if (isOpen) {
          state.completed.add(slug);
          localStorage.setItem("remitly-completed", JSON.stringify([...state.completed]));
          updateProgress(slug);
          window.initCharts?.(state.content, slug);
          requestAnimationFrame(() => panel.scrollIntoView({ behavior: document.body.classList.contains("reduce-motion") ? "auto" : "smooth", block: "start" }));
          window.animateCounters?.(panel);
        }
      });
    });
  }

  function setupControls() {
    document.querySelector(".floating-home").addEventListener("click", () => { location.hash = "home"; });
    document.querySelector(".floating-share").addEventListener("click", () => {
      location.hash = "status-today";
      setTimeout(() => {
        const button = document.querySelector('[data-explore="status-today"]');
        if (button.getAttribute("aria-expanded") !== "true") button.click();
        else document.querySelector(".share-block").scrollIntoView({ behavior: "smooth" });
      }, 350);
    });

    const motionToggle = document.querySelector(".motion-toggle");
    const reduceByDefault = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.toggle("reduce-motion", reduceByDefault);
    motionToggle.setAttribute("aria-pressed", String(reduceByDefault));
    motionToggle.textContent = reduceByDefault ? "Enable motion" : "Skip motion";
    motionToggle.addEventListener("click", () => {
      const reduced = document.body.classList.toggle("reduce-motion");
      motionToggle.setAttribute("aria-pressed", String(reduced));
      motionToggle.textContent = reduced ? "Enable motion" : "Skip motion";
      if (!reduced && state.current !== "home") window.runChapterAnimation?.(state.current);
    });
  }

  document.addEventListener("DOMContentLoaded", async () => { if(window.VanillaTilt) { VanillaTilt.init(document.querySelectorAll(".chapter-card"), { max: 15, speed: 400, glare: true, "max-glare": 0.3 }); }
    setupExploreButtons();
    setupControls();
    window.setupQrCodes?.();
    try {
      state.content = await loadContent();
      renderContent(state.content);
    } catch {
      document.querySelectorAll("[data-content-slot]").forEach((slot) => { slot.innerHTML = "<p>The case-study content could not be loaded. Refresh the page to try again.</p>"; });
    }
    addEventListener("hashchange", route);
    route();
  });
})();


// SIMULATION GAME LOGIC
document.addEventListener('DOMContentLoaded', () => {
    const btnSend = document.getElementById('btn-send-money');
    const methodSelect = document.getElementById('game-method');
    const amountInput = document.getElementById('game-amount');
    const fromSelect = document.getElementById('game-from');
    const countrySelect = document.getElementById('game-country');
    const statusText = document.getElementById('game-status');
    const feesBar = document.getElementById('game-fees');
    const recipientBar = document.getElementById('game-recipient');
    const timeValue = document.getElementById('game-time-value');
    const savingsBox = document.getElementById('game-savings');

    if(btnSend) {
        btnSend.addEventListener('click', () => {
            const method = methodSelect.value;
            let amount = parseFloat(amountInput.value);
            if (isNaN(amount) || amount <= 0) amount = 200;

            const fromName = fromSelect ? fromSelect.options[fromSelect.selectedIndex].text : 'USA';
            const countryName = countrySelect.options[countrySelect.selectedIndex].text;
            
            // 9% traditional vs 1.5% Remitly
            const tradFeeRate = 0.09;
            const remitlyFeeRate = 0.015;
            
            statusText.innerText = 'Sending from ' + fromName + ' to ' + countryName + '...';
            feesBar.style.width = '0%';
            feesBar.innerText = '';
            recipientBar.style.width = '100%';
            recipientBar.innerText = 'Sending...';
            timeValue.innerText = '0 hours';
            savingsBox.style.display = 'none';
            
            setTimeout(() => {
                if(method === 'traditional') {
                    const fee = amount * tradFeeRate;
                    const received = amount - fee;
                    statusText.innerText = `Transfer Complete (${fromName} to ${countryName})`;
                    feesBar.style.width = '9%';
                    feesBar.innerText = `-$${fee.toFixed(2)}`;
                    recipientBar.style.width = '91%';
                    recipientBar.innerText = `Received: $${received.toFixed(2)}`;
                    timeValue.innerText = '72 hours (3 Days)';
                    savingsBox.style.display = 'block';
                    savingsBox.innerHTML = `💸 Traditional fees are eating <strong>$${fee.toFixed(2)}</strong>! Remitly could save you <strong>$${((tradFeeRate - remitlyFeeRate) * amount).toFixed(2)}</strong> and deliver in minutes.`;
                } else {
                    const fee = amount * remitlyFeeRate;
                    const received = amount - fee;
                    statusText.innerText = `Transfer Complete (Remitly to ${countryName})`;
                    feesBar.style.width = '1.5%';
                    feesBar.innerText = `-$${fee.toFixed(2)}`;
                    recipientBar.style.width = '98.5%';
                    recipientBar.innerText = `Received: $${received.toFixed(2)}`;
                    timeValue.innerText = 'Minutes';
                    savingsBox.style.display = 'block';
                    savingsBox.innerHTML = `🚀 <strong>Remitly Magic!</strong> You saved <strong>$${((tradFeeRate - remitlyFeeRate) * amount).toFixed(2)}</strong> and <strong>almost 3 days</strong> compared to traditional methods!`;
                }
            }, 600);
        });
    }

    // STATUS TODAY KPI COUNTER ANIMATION
    const kpiObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const els = entry.target.querySelectorAll('[data-count], [data-count-decimal]');
                els.forEach(el => {
                    const isDecimal = el.hasAttribute('data-count-decimal');
                    const target = parseFloat(isDecimal ? el.getAttribute('data-count-decimal') : el.getAttribute('data-count'));
                    const duration = 1500;
                    const stepTime = 30;
                    const steps = duration / stepTime;
                    const increment = target / steps;
                    let current = 0;
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                            kpiObserver.unobserve(entry.target);
                        }
                        // Keep any non-numeric text like '$' or 'M+' intact in the original HTML, just replace the inner text of the span? 
                        // Actually, the span ONLY contains the number in our HTML setup (e.g. <span>0</span>)
                        el.innerText = isDecimal ? current.toFixed(1) : Math.floor(current);
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.3 });

    const kpiGrid = document.querySelector('.kpi-grid');
    if (kpiGrid) {
        kpiObserver.observe(kpiGrid);
    }
});

