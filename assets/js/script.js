// Optimized Background System
const BackgroundSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    isActive: true,
    isMobile: false,
    
    init() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.isMobile = window.matchMedia('(max-width: 768px)').matches;
        
        this.setupCanvas();
        this.initParticles();
        this.animate();
        this.setupEventListeners();
    },
    
    setupCanvas() {
        const dpr = this.isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
        
        const resize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            this.canvas.width = width * dpr;
            this.canvas.height = height * dpr;
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
            this.ctx.scale(dpr, dpr);
        };
        
        resize();
        
        // Debounced resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.isMobile = window.matchMedia('(max-width: 768px)').matches;
                resize();
                this.initParticles();
            }, 250);
        });
    },
    
    initParticles() {
        this.particles = [];
        // Significantly reduce particles on mobile
        const count = this.isMobile ? 15 : 50;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * (this.isMobile ? 0.1 : 0.2),
                vy: (Math.random() - 0.5) * (this.isMobile ? 0.1 : 0.2),
                size: Math.random() * 1.5 + 0.5
            });
        }
    },
    
    animate() {
        if (!this.isActive) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles
        this.particles.forEach((particle, i) => {
            // Update
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce
            if (particle.x < 0 || particle.x > width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > height) particle.vy *= -1;
            
            // Keep in bounds
            particle.x = Math.max(0, Math.min(width, particle.x));
            particle.y = Math.max(0, Math.min(height, particle.y));
            
            // Draw
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(14, 165, 233, 0.6)';
            this.ctx.fill();
            
            // Connections - skip on mobile or limit heavily
            if (!this.isMobile && i % 3 === 0) {
                this.drawConnections(particle, i, width, height);
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    },
    
    drawConnections(particle, index, width, height) {
        const maxDist = 100;
        let connections = 0;
        
        for (let j = index + 1; j < this.particles.length && connections < 2; j++) {
            const other = this.particles[j];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < maxDist) {
                this.ctx.beginPath();
                this.ctx.moveTo(particle.x, particle.y);
                this.ctx.lineTo(other.x, other.y);
                this.ctx.strokeStyle = `rgba(14, 165, 233, ${0.08 * (1 - dist / maxDist)})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();
                connections++;
            }
        }
    },
    
    setupEventListeners() {
        // Visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isActive = false;
                cancelAnimationFrame(this.animationId);
            } else {
                this.isActive = true;
                this.animate();
            }
        });
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    BackgroundSystem.init();
});