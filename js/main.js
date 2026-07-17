// Application State
const state = {
    content: null,
    currentChapter: null
};

// DOM Elements
const homeView = document.getElementById('home-view');
const chapterView = document.getElementById('chapter-view');
const chapterGrid = document.getElementById('chapter-grid');
const navbar = document.getElementById('navbar');
const homeLink = document.getElementById('home-link');
const expandBtn = document.getElementById('expand-btn');
const expandPrompt = document.getElementById('expand-prompt');
const deepDiveContainer = document.getElementById('deep-dive-container');
const storyContainer = document.getElementById('story-container');
const skipAnimationToggle = document.getElementById('skip-animation');

// Share Modal Elements
const shareBtn = document.getElementById('nav-share-btn');
const shareModal = document.getElementById('share-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');

// Initialize Application
async function init() {
    await fetchContent();
    renderHomeCards();
    handleRouting();
    setupEventListeners();
    
    // Listen to hash changes for routing
    window.addEventListener('hashchange', handleRouting);
}

// Fetch Content (Try API, fallback to JSON)
async function fetchContent() {
    try {
        const response = await fetch('/api/content');
        if (!response.ok) throw new Error('API not available');
        const data = await response.json();
        state.content = data;
    } catch (error) {
        console.log('Falling back to static content.json');
        try {
            const res = await fetch('data/content.json');
            state.content = await res.json();
        } catch (e) {
            console.error('Failed to load content:', e);
            document.body.innerHTML = '<h1 style="color:white; text-align:center; margin-top:20vh;">Error loading content</h1>';
        }
    }
}

// Render Chapter Cards on Home View
function renderHomeCards() {
    if (!state.content || !state.content.chapters) return;
    
    chapterGrid.innerHTML = state.content.chapters.map(chapter => `
        <a href="#${chapter.slug}" class="chapter-card" data-tilt data-tilt-max="10" data-tilt-speed="400" data-tilt-glare data-tilt-max-glare="0.2">
            <div class="icon-container">
                ${chapter.icon}
            </div>
            <span>Chapter ${chapter.order_index}</span>
            <h3>${chapter.title}</h3>
            <p>${chapter.teaser_text}</p>
        </a>
    `).join('');

    // Initialize VanillaTilt on the newly created cards
    if (window.VanillaTilt) {
        VanillaTilt.init(document.querySelectorAll(".chapter-card"));
    }
}

// Routing Logic
function handleRouting() {
    const hash = window.location.hash.replace('#', '');
    
    if (!hash || hash === 'home') {
        showHomeView();
    } else {
        const chapter = state.content.chapters.find(c => c.slug === hash);
        if (chapter) {
            showChapterView(chapter);
        } else {
            showHomeView();
        }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// View Transitions
function showHomeView() {
    state.currentChapter = null;
    chapterView.classList.remove('active');
    
    setTimeout(() => {
        chapterView.style.display = 'none';
        homeView.style.display = 'block';
        
        // Slight delay to allow display block to render before opacity transition
        setTimeout(() => {
            homeView.classList.add('active');
            
            // Re-trigger hero animation on return
            if (window.Animations && window.Animations.playHeroBackground) {
                window.Animations.playHeroBackground();
            }
            
            // Stagger cards in
            gsap.fromTo('.chapter-card', 
                { y: 50, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", clearProps: "all" }
            );

        }, 50);
        navbar.classList.add('hidden');
    }, 600);
}

function showChapterView(chapter) {
    state.currentChapter = chapter;
    
    // Update navbar progress
    updateProgress(chapter.order_index);
    navbar.classList.remove('hidden');
    
    // Reset Deep Dive State
    expandPrompt.classList.remove('hidden');
    deepDiveContainer.classList.add('hidden');
    deepDiveContainer.classList.remove('visible');
    
    // Populate Content
    deepDiveContainer.innerHTML = chapter.deep_dive_html;
    injectDynamicContent(chapter);
    
    homeView.classList.remove('active');
    setTimeout(() => {
        homeView.style.display = 'none';
        chapterView.style.display = 'block';
        setTimeout(() => chapterView.classList.add('active'), 50);
        
        // Trigger Story Teaser Animation
        if (window.Animations && window.Animations.playTeaser) {
            const skip = skipAnimationToggle.checked;
            window.Animations.playTeaser(chapter.slug, skip);
        }
    }, 600);
}

function updateProgress(currentIndex) {
    document.querySelectorAll('.step').forEach((stepEl, idx) => {
        const stepNum = idx + 1;
        stepEl.className = 'step'; // reset
        if (stepNum < currentIndex) {
            stepEl.classList.add('completed');
        } else if (stepNum === currentIndex) {
            stepEl.classList.add('active');
        }
    });
}

// Inject Dynamic Content (Founders, charts initialization)
function injectDynamicContent(chapter) {
    if (chapter.slug === 'founders' && state.content.founders) {
        const container = deepDiveContainer.querySelector('#founderCardsContainer');
        if (container) {
            container.innerHTML = state.content.founders.map(f => `
                <div class="founder-card" data-tilt data-tilt-max="5" data-tilt-speed="300" data-tilt-glare data-tilt-max-glare="0.1">
                    <h4>${f.name}</h4>
                    <p>${f.role}</p>
                    <div class="bio">
                        <strong style="color:var(--brand-coral)">Background:</strong> ${f.background}<br><br>
                        <strong style="color:var(--brand-coral)">Connection:</strong> ${f.personal_connection}
                    </div>
                </div>
            `).join('');
            
            if (window.VanillaTilt) {
                VanillaTilt.init(container.querySelectorAll(".founder-card"));
            }
        }
    }
}

// Event Listeners
function setupEventListeners() {
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '';
    });
    
    expandBtn.addEventListener('click', () => {
        expandPrompt.classList.add('hidden');
        deepDiveContainer.classList.remove('hidden');
        
        // Trigger slide up animation
        setTimeout(() => {
            deepDiveContainer.classList.add('visible');
            
            // Initialize charts after container is visible
            if (window.Charts && state.currentChapter) {
                window.Charts.initCharts(state.currentChapter.slug, state.content);
            }
        }, 50);
    });
    
    // Share Modals
    shareBtn.addEventListener('click', openShareModal);
    modalCloseBtn.addEventListener('click', closeShareModal);
    
    document.getElementById('footer-copy-btn').addEventListener('click', copyLink);
    document.getElementById('modal-copy-btn').addEventListener('click', copyLink);
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === shareModal) {
            closeShareModal();
        }
    });
}

function openShareModal() {
    shareModal.classList.add('visible');
    if(window.QRUtils) window.QRUtils.generateModalQR();
}

function closeShareModal() {
    shareModal.classList.remove('visible');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.origin).then(() => {
        alert('Link copied to clipboard!');
    });
}

// Start
document.addEventListener('DOMContentLoaded', init);
