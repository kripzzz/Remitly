window.Charts = {
    instances: {},

    initCharts: function(slug, content) {
        // Destroy existing charts to prevent canvas reuse errors if navigating back
        this.destroyCharts();

        if (slug === 'friction') {
            this.renderFrictionChart();
        } else if (slug === 'business_model') {
            this.renderBusinessModelCharts(content.revenue_data);
        } else if (slug === 'geography') {
            this.renderScaleChart(content.revenue_data);
        }
    },

    destroyCharts: function() {
        Object.keys(this.instances).forEach(key => {
            if (this.instances[key]) {
                this.instances[key].destroy();
            }
        });
        this.instances = {};
    },

    renderFrictionChart: function() {
        const ctx = document.getElementById('frictionChart');
        if (!ctx) return;

        this.instances['friction'] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Traditional Operators', 'Digital-Native Challengers'],
                datasets: [{
                    label: 'Illustrative Cost to Send $200 (%)',
                    data: [7.5, 1.5],
                    backgroundColor: ['#6B7280', '#4B2E83'],
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Historical Remittance Industry Cost vs Digital Alternatives' }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Percentage Cost (%)' }
                    }
                }
            }
        });
    },

    renderBusinessModelCharts: function(revenueData) {
        const mixCtx = document.getElementById('revenueMixChart');
        const growthCtx = document.getElementById('revenueGrowthChart');

        if (mixCtx) {
            this.instances['mix'] = new Chart(mixCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Transaction Fees (~40%)', 'FX Spread (~60%)'],
                    datasets: [{
                        data: [40, 60],
                        backgroundColor: ['#F76B55', '#4B2E83'],
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        title: { display: true, text: 'Illustrative Historical Revenue Mix' }
                    }
                }
            });
        }

        if (growthCtx && revenueData) {
            // Filter out Q1 2026 for the annual bar chart to not skew scale
            const annualData = revenueData.filter(d => d.fiscal_period.includes('FY'));
            
            this.instances['growth'] = new Chart(growthCtx, {
                type: 'bar',
                data: {
                    labels: annualData.map(d => d.fiscal_period),
                    datasets: [{
                        label: 'Revenue (USD Millions)',
                        data: annualData.map(d => d.revenue_usd_millions),
                        backgroundColor: '#4B2E83',
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: 'Annual Revenue Growth' }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'Revenue (USD Millions)' }
                        }
                    }
                }
            });
        }
    },

    renderScaleChart: function(revenueData) {
        const ctx = document.getElementById('scaleChart');
        if (!ctx) return;

        // Using revenue as a proxy for scale growth line chart
        const annualData = revenueData.filter(d => d.fiscal_period.includes('FY'));

        this.instances['scale'] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: annualData.map(d => d.fiscal_period),
                datasets: [{
                    label: 'Revenue Proxy for Volume (USD Millions)',
                    data: annualData.map(d => d.revenue_usd_millions),
                    borderColor: '#F76B55',
                    backgroundColor: 'rgba(247, 107, 85, 0.2)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Platform Scale Growth (Revenue Proxy)' }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
};
