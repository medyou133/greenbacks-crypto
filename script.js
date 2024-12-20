// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', () => {
    // Only prevent default for hash links (internal page navigation)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Make sure regular links work
    document.querySelectorAll('a:not([href^="#"])').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        });
    });
});

// Navigation bar background change on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(9, 9, 9, 0.95)';
    } else {
        nav.style.background = 'rgba(9, 9, 9, 0.8)';
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .tokenomics-card').forEach((element) => {
    observer.observe(element);
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Charts
    initializePriceChart();
    initializeMarketCharts();
    
    // Initialize Trading Interface
    initializeTradingInterface();
    
    // Start Live Updates
    startLiveUpdates();
    
    // Initialize Navigation
    initializeNavigation();
});

// Price Chart Initialization
function initializePriceChart() {
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;

    const generatePriceData = () => {
        const data = [];
        let price = 1.2;
        for (let i = 0; i < 100; i++) {
            price += (Math.random() - 0.5) * 0.05;
            data.push(price);
        }
        return data;
    };

    const labels = Array.from({length: 100}, (_, i) => i);
    const data = generatePriceData();

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'GREENBACK$ Price',
                data: data,
                borderColor: '#ffd700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0a0a0'
                    }
                }
            }
        }
    });
}

// Market Charts Initialization
function initializeMarketCharts() {
    const charts = document.querySelectorAll('.market-chart');
    
    charts.forEach(chart => {
        const pair = chart.dataset.pair;
        const ctx = chart.getContext('2d');
        
        const data = Array.from({length: 20}, () => Math.random() * 2);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(20).fill(''),
                datasets: [{
                    data: data,
                    borderColor: '#ffd700',
                    borderWidth: 1.5,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        display: false
                    }
                }
            }
        });
    });
}

// Trading Interface
function initializeTradingInterface() {
    const buyInput = document.querySelector('.trade-input');
    const receiveInput = document.querySelectorAll('.trade-input')[1];
    const currencySelect = document.querySelector('.currency-select');
    
    if (!buyInput || !receiveInput || !currencySelect) return;

    const calculateReceiveAmount = () => {
        const amount = parseFloat(buyInput.value);
        const currency = currencySelect.value;
        let rate;
        
        switch(currency) {
            case 'USDT':
                rate = 1;
                break;
            case 'BTC':
                rate = 0.000234;
                break;
            case 'ETH':
                rate = 0.00156;
                break;
            default:
                rate = 1;
        }
        
        receiveInput.value = amount ? (amount / rate).toFixed(4) : '';
    };

    buyInput.addEventListener('input', calculateReceiveAmount);
    currencySelect.addEventListener('change', calculateReceiveAmount);
}

// Live Updates
function startLiveUpdates() {
    // Price Updates
    setInterval(() => {
        const priceElements = document.querySelectorAll('.price');
        const changeElements = document.querySelectorAll('.change');
        
        priceElements.forEach((el, index) => {
            const currentPrice = parseFloat(el.textContent);
            const change = (Math.random() - 0.5) * 0.01;
            const newPrice = (currentPrice + change).toFixed(6);
            
            el.textContent = newPrice;
            
            if (changeElements[index]) {
                const percentChange = (change / currentPrice * 100).toFixed(2);
                changeElements[index].textContent = `${percentChange > 0 ? '+' : ''}${percentChange}%`;
                changeElements[index].className = `change ${percentChange >= 0 ? 'positive' : 'negative'}`;
            }
        });
    }, 3000);

    // Network Time
    setInterval(() => {
        const timeElement = document.querySelector('.network-time');
        if (timeElement) {
            timeElement.textContent = new Date().toLocaleTimeString();
        }
    }, 1000);

    // Block Number
    let blockNumber = 12345678;
    setInterval(() => {
        const blockElement = document.querySelector('.block-number');
        if (blockElement) {
            blockNumber++;
            blockElement.textContent = `Block #${blockNumber}`;
        }
    }, 15000);
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            link.parentElement.classList.add('active');
            
            // Smooth scroll to section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Wallet Connection Simulation
    const walletButton = document.querySelector('.wallet-button');
    if (walletButton) {
        walletButton.addEventListener('click', () => {
            walletButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Connecting...</span>';
            
            setTimeout(() => {
                walletButton.innerHTML = '<i class="fas fa-check-circle"></i><span>Connected</span>';
                walletButton.style.background = 'linear-gradient(135deg, #00ff9d, #00cc7e)';
            }, 2000);
        });
    }
}

// Modal Functions
function showCreatorModal() {
    const modalHTML = `
        <div class="modal active">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Content Creator Support</h2>
                    <button class="close-modal" onclick="closeModal(this)">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="support-options">
                        <div class="support-option">
                            <i class="fas fa-tools"></i>
                            <h3>Professional Tools</h3>
                            <p>Access our suite of professional content creation tools</p>
                        </div>
                        <div class="support-option">
                            <i class="fas fa-chart-line"></i>
                            <h3>Analytics Dashboard</h3>
                            <p>Track your performance with detailed analytics</p>
                        </div>
                        <div class="support-option">
                            <i class="fas fa-users"></i>
                            <h3>Community Support</h3>
                            <p>Connect with other creators and grow together</p>
                        </div>
                        <div class="support-option">
                            <i class="fas fa-dollar-sign"></i>
                            <h3>Revenue Growth</h3>
                            <p>Maximize your earnings with our monetization tools</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalListeners();
}

function showStreamerModal() {
    const modalHTML = `
        <div class="modal active">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">TikTok Live Support</h2>
                    <button class="close-modal" onclick="closeModal(this)">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="support-options">
                        <div class="support-option">
                            <i class="fas fa-video"></i>
                            <h3>Streaming Tools</h3>
                            <p>Professional live streaming tools and features</p>
                        </div>
                        <div class="support-option">
                            <i class="fas fa-chart-bar"></i>
                            <h3>Live Analytics</h3>
                            <p>Real-time streaming analytics and insights</p>
                        </div>
                        <div class="support-option">
                            <i class="fas fa-users"></i>
                            <h3>Audience Growth</h3>
                            <p>Tools to grow and engage your audience</p>
                        </div>
                        <div class="support-option">
                            <i class="fas fa-dollar-sign"></i>
                            <h3>Monetization</h3>
                            <p>Maximize your streaming revenue</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalListeners();
}

function closeModal(button) {
    const modal = button.closest('.modal');
    if (modal) {
        modal.remove();
    }
}

function setupModalListeners() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    });
}

// Browser Navigation Controls
document.addEventListener('DOMContentLoaded', () => {
    // Control buttons functionality
    const backBtn = document.querySelector('.control-btn:nth-child(1)');
    const forwardBtn = document.querySelector('.control-btn:nth-child(2)');
    const refreshBtn = document.querySelector('.control-btn:nth-child(3)');

    backBtn.addEventListener('click', () => {
        window.history.back();
    });

    forwardBtn.addEventListener('click', () => {
        window.history.forward();
    });

    refreshBtn.addEventListener('click', () => {
        window.location.reload();
    });

    // Navigation menu functionality
    const menuItems = document.querySelectorAll('.main-menu li');
    const sections = document.querySelectorAll('section');

    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const targetId = item.querySelector('a').getAttribute('href').substring(1);
            sections.forEach(section => {
                section.classList.remove('active-section');
                if (section.id === targetId) {
                    section.classList.add('active-section');
                }
            });
        });
    });

    // Live price update simulation
    function updatePrice() {
        const priceElement = document.querySelector('.price-card .value');
        const changeElement = document.querySelector('.price-card .change');
        
        if (priceElement && changeElement) {
            const currentPrice = parseFloat(priceElement.textContent.replace('$', ''));
            const change = (Math.random() - 0.5) * 0.1; // Random price change
            const newPrice = (currentPrice + change).toFixed(3);
            const percentChange = ((change / currentPrice) * 100).toFixed(2);
            
            priceElement.textContent = `$${newPrice}`;
            changeElement.textContent = `${percentChange > 0 ? '+' : ''}${percentChange}%`;
            changeElement.className = `change ${percentChange >= 0 ? 'positive' : 'negative'}`;
        }
    }

    // Update price every 5 seconds
    setInterval(updatePrice, 5000);

    // Block number update simulation
    function updateBlockNumber() {
        const blockElement = document.querySelector('.block-number');
        if (blockElement) {
            const currentBlock = parseInt(blockElement.textContent.split('#')[1]);
            blockElement.textContent = `Block #${currentBlock + 1}`;
        }
    }

    // Update block number every 15 seconds
    setInterval(updateBlockNumber, 15000);

    // Add shimmer effect to cards on hover
    const cards = document.querySelectorAll('.feature-card, .price-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.background = `
                radial-gradient(circle at ${x}px ${y}px, 
                rgba(255,255,255,0.1),
                rgba(255,255,255,0.05) 40%,
                rgba(255,255,255,0) 60%)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = 'rgba(255,255,255,0.05)';
        });
    });
});

// Content Creation Section Functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    const startCreatingBtn = document.getElementById('startCreatingBtn');
    const startStreamingBtn = document.getElementById('startStreamingBtn');
    
    console.log('Start Creating Button:', startCreatingBtn);
    console.log('Start Streaming Button:', startStreamingBtn);

    if (startCreatingBtn) {
        startCreatingBtn.addEventListener('click', () => {
            console.log('Start Creating button clicked');
            showCreatorModal();
        });
    }

    if (startStreamingBtn) {
        startStreamingBtn.addEventListener('click', () => {
            console.log('Start Streaming button clicked');
            showStreamerModal();
        });
    }
});

// Support Section Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get the support buttons
    const startCreatingBtn = document.querySelector('.content-creator .start-button');
    const startStreamingBtn = document.querySelector('.tiktok-live .start-button');

    if (startCreatingBtn) {
        startCreatingBtn.addEventListener('click', () => {
            showCreatorModal();
        });
    }

    if (startStreamingBtn) {
        startStreamingBtn.addEventListener('click', () => {
            showStreamerModal();
        });
    }
});

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const walletButton = document.querySelector('.wallet-button');
    const navLinks = document.querySelectorAll('.nav-links a');
    const networkTime = document.querySelector('.network-time');

    // Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    document.querySelectorAll('a:not([href^="#"])').forEach(link => {
        link.addEventListener('click', function (e) {
            // Let the default navigation happen
            return true;
        });
    });

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Wallet Connection Simulation
    walletButton.addEventListener('click', () => {
        if (walletButton.querySelector('span').textContent === 'Connect Wallet') {
            simulateWalletConnection();
        } else {
            disconnectWallet();
        }
    });

    // Active Section Tracking
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.parentElement.classList.add('active');
            }
        });
    });

    // Network Time Update
    function updateNetworkTime() {
        const now = new Date();
        networkTime.textContent = now.toLocaleTimeString();
    }
    
    updateNetworkTime();
    setInterval(updateNetworkTime, 1000);

    // Statistics Animation
    const stats = document.querySelectorAll('.stat-value');
    stats.forEach(stat => {
        const value = stat.textContent;
        stat.textContent = '0';
        animateValue(stat, 0, parseInt(value), 2000);
    });
});

// Utility Functions
function simulateWalletConnection() {
    const button = document.querySelector('.wallet-button');
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Connecting...</span>';
    
    setTimeout(() => {
        const randomAddress = generateRandomAddress();
        button.innerHTML = `<i class="fas fa-wallet"></i><span>${randomAddress}</span>`;
    }, 1500);
}

function disconnectWallet() {
    const button = document.querySelector('.wallet-button');
    button.innerHTML = '<i class="fas fa-wallet"></i><span>Connect Wallet</span>';
}

function generateRandomAddress() {
    const addr = '0x' + Array.from({length: 8}, () => 
        Math.floor(Math.random() * 16).toString(16)).join('') + '...';
    return addr;
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Platform Statistics
const platformStats = {
    tiktok: {
        creators: '500K+',
        views: '20M+'
    },
    youtube: {
        creators: '300K+',
        views: '15M+'
    },
    instagram: {
        creators: '400K+',
        views: '18M+'
    }
};

// Update Platform Stats
function updatePlatformStats() {
    Object.entries(platformStats).forEach(([platform, stats]) => {
        const card = document.querySelector(`.platform-card.${platform}`);
        if (card) {
            card.querySelector('.creators').textContent = stats.creators;
            card.querySelector('.views').textContent = stats.views;
        }
    });
}

// Content Creation Stats
let contentCreatedToday = 0;
const contentTarget = 50000; // 50K target

function updateContentStats() {
    const contentStats = document.querySelector('.status-value');
    if (contentCreatedToday < contentTarget) {
        contentCreatedToday += Math.floor(Math.random() * 100);
        if (contentCreatedToday > contentTarget) contentCreatedToday = contentTarget;
        contentStats.textContent = `${Math.floor(contentCreatedToday / 1000)}K+`;
    }
}

// Active Users Simulation
function updateActiveUsers() {
    const activeUsers = document.querySelector('.status-value');
    const baseUsers = 2500000; // 2.5M base
    const fluctuation = Math.floor(Math.random() * 100000) - 50000; // ±50K fluctuation
    const total = baseUsers + fluctuation;
    activeUsers.textContent = `${(total / 1000000).toFixed(1)}M Online`;
}

// Initialize Stats Updates
setInterval(updateContentStats, 3000);
setInterval(updateActiveUsers, 5000);
