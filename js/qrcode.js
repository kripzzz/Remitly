window.QRUtils = {
    footerQRRendered: false,
    modalQRRendered: false,

    init: function() {
        // Attempt to load server-side QR, fallback to client-side
        this.renderFooterQR();
    },

    renderFooterQR: function() {
        if (this.footerQRRendered) return;
        const container = document.getElementById('footer-qrcode');
        if (!container) return;

        this.generateQR(container);
        this.footerQRRendered = true;
    },

    generateModalQR: function() {
        if (this.modalQRRendered) return;
        const container = document.getElementById('modal-qrcode');
        if (!container) return;

        this.generateQR(container);
        this.modalQRRendered = true;
    },

    generateQR: function(container) {
        container.innerHTML = ''; // clear

        // Try to fetch server-side QR first
        const img = new Image();
        img.onload = () => {
            // Server returned an image successfully
            container.appendChild(img);
        };
        img.onerror = () => {
            // Server failed, use client-side qrcode.js
            console.log('Falling back to client-side QR generation');
            try {
                new QRCode(container, {
                    text: window.location.origin,
                    width: 128,
                    height: 128,
                    colorDark : "#4B2E83",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            } catch (e) {
                console.error("QRCode library failed:", e);
                container.innerHTML = '<span>QR Failed to Load</span>';
            }
        };
        
        // Point to API
        img.src = '/api/qrcode';
        img.alt = 'QR Code to Share Site';
        img.style.width = '128px';
        img.style.height = '128px';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure layout is ready
    setTimeout(() => {
        window.QRUtils.init();
    }, 500);
});
