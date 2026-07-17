(() => {
  const shareUrl = () => `${location.origin}${location.pathname}`;

  window.setupQrCodes = () => {
    if (window.QRCode) {
      document.querySelectorAll("[data-qr]").forEach((container) => {
        container.innerHTML = "";
        new QRCode(container, { text: shareUrl(), width: 142, height: 142, colorDark: "#26134d", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
      });
    }
    document.querySelectorAll(".copy-link").forEach((button) => {
      button.addEventListener("click", async () => {
        const previous = button.textContent;
        try { await navigator.clipboard.writeText(shareUrl()); button.textContent = "Link copied ✓"; }
        catch { button.textContent = "Copy unavailable"; }
        setTimeout(() => { button.textContent = previous; }, 1800);
      });
    });
  };
})();
