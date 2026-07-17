window.Animations = {
    playHeroBackground: function() {
        const container = document.getElementById('hero-bg');
        if (!container) return;
        
        // Advanced particle/network SVG
        container.innerHTML = `
            <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" opacity="0.8">
                <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#7047B8" stop-opacity="0.1"/>
                        <stop offset="50%" stop-color="#F76B55" stop-opacity="0.8"/>
                        <stop offset="100%" stop-color="#7047B8" stop-opacity="0.1"/>
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- World Map abstract curves -->
                <path d="M100 250 Q 300 100 500 250 T 900 250" fill="none" stroke="url(#lineGrad)" stroke-width="3" stroke-dasharray="10 10" class="hero-path" filter="url(#glow)"/>
                <path d="M200 350 Q 400 200 600 350 T 800 150" fill="none" stroke="url(#lineGrad)" stroke-width="2" stroke-dasharray="5 15" class="hero-path-2" opacity="0.6"/>
                
                <circle cx="100" cy="250" r="6" fill="#F76B55" class="node" filter="url(#glow)"/>
                <circle cx="500" cy="250" r="8" fill="#F76B55" class="node" filter="url(#glow)"/>
                <circle cx="900" cy="250" r="6" fill="#F76B55" class="node" filter="url(#glow)"/>
                
                <circle cx="200" cy="350" r="4" fill="#7047B8" class="node-alt"/>
                <circle cx="600" cy="350" r="5" fill="#7047B8" class="node-alt"/>
            </svg>
        `;

        if (this.shouldSkip()) return;

        gsap.to('.hero-path', {
            strokeDashoffset: -100,
            duration: 4,
            repeat: -1,
            ease: "linear"
        });
        
        gsap.to('.hero-path-2', {
            strokeDashoffset: 100,
            duration: 6,
            repeat: -1,
            ease: "linear"
        });
        
        gsap.to('.node', {
            scale: 1.5,
            opacity: 0.6,
            duration: 1.5,
            yoyo: true,
            repeat: -1,
            stagger: 0.3,
            ease: "sine.inOut"
        });
    },

    playTeaser: function(slug, skip = false) {
        const container = document.getElementById('story-container');
        if (!container) return;
        container.innerHTML = ''; 

        if (slug === 'friction') this.playFrictionTeaser(container, skip);
        else if (slug === 'founders') this.playFoundersTeaser(container, skip);
        else if (slug === 'business_model') this.playBusinessModelTeaser(container, skip);
        else if (slug === 'geography') this.playGeographyTeaser(container, skip);
        else if (slug === 'status_today') this.playStatusTeaser(container, skip);
    },

    shouldSkip: function() {
        const toggle = document.getElementById('skip-animation');
        return toggle && toggle.checked;
    },

    playFrictionTeaser: function(container, skip) {
        container.innerHTML = `
            <div style="position:relative; width: 400px; height: 300px; perspective: 1000px;">
                <svg id="paper-iso" viewBox="0 0 100 100" width="100%" height="100%" style="overflow:visible;">
                    <defs>
                        <filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                            <feOffset dx="2" dy="4" result="offsetblur"/>
                            <feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
                            <feMerge> 
                                <feMergeNode/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <polygon id="poly1" points="20,20 80,20 80,80 20,80" fill="#E5E7EB" filter="url(#dropshadow)"/>
                    <polygon id="poly2" points="20,20 80,20 50,50" fill="#D1D5DB" />
                </svg>
                <div id="pain-words" style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; pointer-events:none;">
                    <div class="word" style="color:#F76B55; font-weight:800; font-size:2rem; text-shadow: 0 0 10px rgba(247, 107, 85, 0.5); opacity:0; transform:translateZ(-100px) scale(0);">HIGH FEES</div>
                    <div class="word" style="color:#F76B55; font-weight:800; font-size:1.8rem; text-shadow: 0 0 10px rgba(247, 107, 85, 0.5); opacity:0; transform:translateZ(-100px) scale(0);">3+ DAYS</div>
                    <div class="word" style="color:#F76B55; font-weight:800; font-size:2.2rem; text-shadow: 0 0 10px rgba(247, 107, 85, 0.5); opacity:0; transform:translateZ(-100px) scale(0);">NO TRACKING</div>
                </div>
            </div>
        `;

        if (skip) {
            gsap.set('.word', { opacity: 1, scale: 1, z: 0 });
            return;
        }

        const tl = gsap.timeline();
        gsap.set('#paper-iso', { rotationX: 60, rotationZ: -45 });
        
        tl.to('#paper-iso', { rotationX: 0, rotationZ: 0, duration: 1.5, ease: "power3.out" })
          .fromTo('#poly1', { attr: { points: "40,40 60,40 60,60 40,60" } }, { attr: { points: "10,10 90,10 90,90 10,90" }, duration: 1 }, "-=1.5")
          .to('#poly2', { opacity: 0, duration: 0.5 }, "-=1")
          .to('.word', { 
              opacity: 1, 
              scale: 1, 
              z: 50, 
              y: () => (Math.random() * 40 - 20),
              x: () => (Math.random() * 40 - 20),
              duration: 0.8, 
              stagger: 0.2, 
              ease: "back.out(1.7)" 
          }, "-=0.5");
    },

    playFoundersTeaser: function(container, skip) {
        container.innerHTML = `
            <div style="display:flex; gap:30px; align-items:center; perspective: 800px;">
                <div class="comic-panel p1" style="background:rgba(255,255,255,0.05); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:25px; width: 220px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); opacity:0; transform: translateX(-100px) rotateY(20deg);">
                    <div style="font-weight:700; color:#F76B55; margin-bottom:10px;">Nairobi, 2010</div>
                    <div style="height:4px; width:40px; background:#7047B8; margin-bottom:15px; border-radius:2px;"></div>
                    <p style="font-size:0.9rem; color:#D1D5DB; line-height:1.4;">"Working at Barclays, I watched people struggle just to send money home."</p>
                </div>
                <div class="comic-panel p2" style="background:rgba(255,255,255,0.05); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:25px; width: 220px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); opacity:0; transform: translateY(100px) scale(0.8);">
                    <div style="font-weight:700; color:#F76B55; margin-bottom:10px;">The Idea</div>
                    <div style="height:4px; width:40px; background:#7047B8; margin-bottom:15px; border-radius:2px;"></div>
                    <p style="font-size:0.9rem; color:#D1D5DB; line-height:1.4;">"What if remittances didn't have to be broken?"</p>
                </div>
                <div class="comic-panel p3" style="background:rgba(255,255,255,0.05); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:25px; width: 220px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); opacity:0; transform: translateX(100px) rotateY(-20deg);">
                    <div style="font-weight:700; color:#F76B55; margin-bottom:10px;">Seattle, 2011</div>
                    <div style="height:4px; width:40px; background:#7047B8; margin-bottom:15px; border-radius:2px;"></div>
                    <p style="font-size:0.9rem; color:#D1D5DB; line-height:1.4;">Matt Oppenheimer, Josh Hug, Shivaas Gulati join forces.</p>
                </div>
            </div>
        `;

        if (skip) {
            gsap.set('.comic-panel', { opacity: 1, x: 0, y: 0, rotationY: 0, scale: 1 });
            return;
        }

        gsap.to('.comic-panel', { 
            opacity: 1, 
            x: 0, 
            y: 0, 
            rotationY: 0,
            scale: 1,
            duration: 0.8, 
            stagger: 0.4, 
            ease: "power3.out"
        });
    },

    playBusinessModelTeaser: function(container, skip) {
        container.innerHTML = `
            <svg width="600" height="300" viewBox="0 0 600 300">
                <defs>
                    <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#4B2E83"/>
                        <stop offset="100%" stop-color="#F76B55"/>
                    </linearGradient>
                    <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                
                <!-- Sender -->
                <circle cx="100" cy="150" r="30" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
                <text x="100" y="155" fill="#fff" text-anchor="middle" font-weight="bold" font-family="sans-serif">Sender</text>
                
                <!-- Flow 1 -->
                <path d="M 130 150 C 200 150, 200 100, 300 100" fill="none" stroke="url(#flowGrad)" stroke-width="6" stroke-dasharray="300" stroke-dashoffset="300" id="bm-flow1" filter="url(#glow2)"/>
                <path d="M 130 150 C 200 150, 200 200, 300 200" fill="none" stroke="url(#flowGrad)" stroke-width="4" stroke-dasharray="300" stroke-dashoffset="300" id="bm-flow2" filter="url(#glow2)"/>
                
                <!-- Remitly Nodes -->
                <rect x="300" y="80" width="100" height="40" rx="20" fill="rgba(75, 46, 131, 0.4)" stroke="#7047B8" stroke-width="2"/>
                <text x="350" y="105" fill="#fff" text-anchor="middle" font-size="12">TX Fee</text>
                
                <rect x="300" y="180" width="100" height="40" rx="20" fill="rgba(75, 46, 131, 0.4)" stroke="#7047B8" stroke-width="2"/>
                <text x="350" y="205" fill="#fff" text-anchor="middle" font-size="12">FX Spread</text>
                
                <!-- Flow to Recipient -->
                <path d="M 400 150 L 500 150" fill="none" stroke="#F76B55" stroke-width="8" stroke-dasharray="100" stroke-dashoffset="100" id="bm-flow3" filter="url(#glow2)"/>
                
                <!-- Recipient -->
                <circle cx="530" cy="150" r="30" fill="rgba(255,255,255,0.05)" stroke="#F76B55" stroke-width="2"/>
                <text x="530" y="155" fill="#fff" text-anchor="middle" font-weight="bold" font-family="sans-serif">Recipient</text>
            </svg>
        `;

        if (skip) {
            gsap.set('#bm-flow1, #bm-flow2, #bm-flow3', { strokeDashoffset: 0 });
            return;
        }

        const tl = gsap.timeline();
        tl.to('#bm-flow1', { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" })
          .to('#bm-flow2', { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, "-=0.8")
          .to('#bm-flow3', { strokeDashoffset: 0, duration: 1, ease: "power2.out" });
    },

    playGeographyTeaser: function(container, skip) {
        container.innerHTML = `
            <svg width="600" height="300" viewBox="0 0 600 300">
                <!-- Abstract dotted world map -->
                <g opacity="0.2">
                    <circle cx="200" cy="100" r="2" fill="#fff"/><circle cx="210" cy="110" r="2" fill="#fff"/><circle cx="190" cy="120" r="2" fill="#fff"/>
                    <circle cx="350" cy="80" r="2" fill="#fff"/><circle cx="360" cy="70" r="2" fill="#fff"/><circle cx="340" cy="90" r="2" fill="#fff"/>
                    <circle cx="450" cy="150" r="2" fill="#fff"/><circle cx="460" cy="160" r="2" fill="#fff"/><circle cx="440" cy="140" r="2" fill="#fff"/>
                </g>
                
                <circle cx="200" cy="100" r="6" fill="#F76B55" class="geo-pin usa" opacity="0"/>
                <circle cx="200" cy="100" r="40" fill="none" stroke="#F76B55" stroke-width="2" class="geo-ring usa-ring" opacity="0"/>
                <text x="200" y="130" fill="#fff" text-anchor="middle" class="geo-pin usa" opacity="0" font-weight="bold">Seattle, USA</text>

                <circle cx="350" cy="80" r="6" fill="#7047B8" class="geo-pin eu" opacity="0"/>
                <circle cx="350" cy="80" r="30" fill="none" stroke="#7047B8" stroke-width="2" class="geo-ring eu-ring" opacity="0"/>
                <text x="350" y="55" fill="#fff" text-anchor="middle" class="geo-pin eu" opacity="0" font-weight="bold">UK / Europe</text>

                <circle cx="450" cy="150" r="6" fill="#F76B55" class="geo-pin uae" opacity="0"/>
                <circle cx="450" cy="150" r="50" fill="none" stroke="#F76B55" stroke-width="2" class="geo-ring uae-ring" opacity="0"/>
                <text x="450" y="180" fill="#fff" text-anchor="middle" class="geo-pin uae" opacity="0" font-weight="bold">UAE (2025)</text>

                <path d="M 200 100 Q 275 30 350 80 T 450 150" fill="none" stroke="#fff" stroke-dasharray="5,5" stroke-opacity="0.5" id="geo-arcs" style="stroke-dashoffset: 400; stroke-dasharray: 400;"/>
            </svg>
        `;

        if (skip) {
            gsap.set('.geo-pin', { opacity: 1 });
            gsap.set('#geo-arcs', { strokeDashoffset: 0 });
            return;
        }

        const tl = gsap.timeline();
        tl.to('.usa', { opacity: 1, duration: 0.3, scale: 1.2, yoyo: true, repeat: 1 })
          .set('.usa', { opacity: 1 })
          .fromTo('.usa-ring', { scale: 0.1, opacity: 1 }, { scale: 2, opacity: 0, duration: 1.5 })
          .to('#geo-arcs', { strokeDashoffset: 0, duration: 2, ease: "power1.inOut" }, "-=1")
          .to('.eu', { opacity: 1, duration: 0.3, scale: 1.2, yoyo: true, repeat: 1 }, "-=1.5")
          .set('.eu', { opacity: 1 })
          .fromTo('.eu-ring', { scale: 0.1, opacity: 1 }, { scale: 2, opacity: 0, duration: 1.5 }, "-=1.5")
          .to('.uae', { opacity: 1, duration: 0.3, scale: 1.2, yoyo: true, repeat: 1 }, "-=0.5")
          .set('.uae', { opacity: 1 })
          .fromTo('.uae-ring', { scale: 0.1, opacity: 1 }, { scale: 2, opacity: 0, duration: 1.5 }, "-=0.5");
    },

    playStatusTeaser: function(container, skip) {
        container.innerHTML = `
            <svg width="600" height="200" viewBox="0 0 600 200">
                <defs>
                    <filter id="ecg-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <!-- Base grid -->
                <path d="M 0 100 L 600 100 M 0 50 L 600 50 M 0 150 L 600 150" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
                
                <!-- ECG path -->
                <path d="M 0 100 L 100 100 L 115 60 L 130 140 L 145 100 L 300 100 L 320 20 L 340 160 L 360 100 L 600 100" 
                      fill="none" stroke="#F76B55" stroke-width="4" id="ecg-line" filter="url(#ecg-glow)" style="stroke-dasharray: 800; stroke-dashoffset: 800;" />
                
                <text x="122" y="45" fill="#fff" font-weight="bold" font-family="sans-serif" font-size="14" opacity="0" class="ecg-text">IPO '21</text>
                <text x="330" y="15" fill="#fff" font-weight="bold" font-family="sans-serif" font-size="14" opacity="0" class="ecg-text">Profitability '25</text>
            </svg>
        `;

        if (skip) {
            gsap.set('#ecg-line', { strokeDashoffset: 0 });
            gsap.set('.ecg-text', { opacity: 1 });
            return;
        }

        const tl = gsap.timeline();
        tl.to('#ecg-line', { strokeDashoffset: 0, duration: 2.5, ease: "linear" })
          .to('.ecg-text', { opacity: 1, duration: 0.5, stagger: 0.8 }, "-=2");
    }
};
