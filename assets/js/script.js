// Ultra Simple Particle System - Mobile Optimized
const ParticleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    rafId: null,
    isActive: true,
    
    init() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.isMobile = window.innerWidth <= 768;
        
        this.resize();
        this.createParticles();
        this.loop();
        
        // Simple resize handler
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.isMobile = window.innerWidth <= 768;
                this.resize();
                this.createParticles();
            }, 200);
        });
        
        // Pause when hidden
        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
            if (this.isActive) this.loop();
        });
    },
    
    resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        // Mobile: lower resolution for performance
        const dpr = this.isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
        
        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    
    createParticles() {
        this.particles = [];
        // Very few particles on mobile
        const count = this.isMobile ? 10 : 40;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 1
            });
        }
    },
    
    loop() {
        if (!this.isActive) {
            cancelAnimationFrame(this.rafId);
            return;
        }
        
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        this.ctx.clearRect(0, 0, w, h);
        
        // Simple particle rendering
        this.ctx.fillStyle = 'rgba(14, 165, 233, 0.5)';
        
        for (let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.rafId = requestAnimationFrame(() => this.loop());
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ParticleSystem.init());
} else {
    ParticleSystem.init();
}