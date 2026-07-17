(() => {
  const charts = {};
  const colors = { purple: "#4b2e83", purpleDark: "#26134d", coral: "#ff6b52", orange: "#ff9d44", mint: "#bce7d2", grid: "rgba(37,24,67,.12)" };
  const common = { responsive: true, maintainAspectRatio: true, animation: { duration: 900 }, plugins: { legend: { labels: { color: colors.purpleDark, font: { family: "DM Mono", size: 10 }, usePointStyle: true } } } };

  function create(id, config) {
    if (!window.Chart || charts[id] || !document.getElementById(id)) return;
    charts[id] = new Chart(document.getElementById(id), config);
  }

  window.initCharts = (data, slug) => {
    if (slug === "friction") create("costChart", { type: "bar", data: { labels: ["Traditional / offline", "Digital-native"], datasets: [{ label: "Illustrative cost range midpoint (%)", data: [8.5, 3], backgroundColor: [colors.coral, colors.mint], borderColor: [colors.purpleDark, colors.purpleDark], borderWidth: 2, borderRadius: 3 }] }, options: { ...common, scales: { y: { beginAtZero: true, max: 12, grid: { color: colors.grid }, ticks: { callback: (value) => `${value}%` } }, x: { grid: { display: false } } }, plugins: { ...common.plugins, legend: { display: false } } } });
    if (slug === "business-model") create("revenueMixChart", { type: "doughnut", data: { labels: ["Transaction fees (40%)", "FX spread (60%)"], datasets: [{ data: [40, 60], backgroundColor: [colors.orange, colors.purple], borderColor: "#fffaf1", borderWidth: 6 }] }, options: { ...common, cutout: "62%", plugins: { legend: { display: true, position: 'bottom', labels: { color: colors.purpleDark, font: { family: "DM Mono", size: 12 }, usePointStyle: true } }, tooltip: { callbacks: { label: function(context) { return context.label; } } } } } });

    const revenue = data?.revenue || [];
    if (slug === "business-model") create("revenueGrowthChart", { type: "bar", data: { labels: revenue.map((row) => row.fiscalPeriod), datasets: [{ label: "Revenue", data: revenue.map((row) => row.revenueUsdMillions), backgroundColor: [colors.mint, colors.purple, colors.coral, colors.orange, colors.mint, colors.purple], borderColor: colors.purpleDark, borderWidth: 1, borderRadius: 3 }] }, options: { ...common, scales: { y: { beginAtZero: true, grid: { color: colors.grid }, ticks: { callback: (value) => `$${value}M` } }, x: { grid: { display: false } } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(context) { return '$' + context.raw + ' Million'; } } } } } });
    if (slug === "geography") create("customerChart", { type: "line", data: { labels: ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"], datasets: [{ label: "Active customers (millions)", data: [1, 1.6, 2.8, 3.8, 5.9, 7.3, 8.6, 9.2], borderColor: colors.coral, backgroundColor: "rgba(255,107,82,.18)", fill: true, tension: .38, pointBackgroundColor: colors.purpleDark, pointRadius: 4 }] }, options: { ...common, scales: { y: { beginAtZero: true, grid: { color: colors.grid }, ticks: { callback: (value) => `${value}M` } }, x: { grid: { display: false } } } } });
  };
})();
