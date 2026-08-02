/* ==========================================================================
   Bizim Dünyamız - Interactive Canvas & Dynamics
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mouse Position Tracker for Card Spotlight Effect
    const cards = document.querySelectorAll('.nav-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 2. Floating Heart Background Particle System
    const canvas = document.getElementById('heartCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 12 + 6;
            this.speedY = Math.random() * 1 + 0.3;
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.fadeSpeed = Math.random() * 0.002 + 0.001;
            this.color = ['#ff4b72', '#a855f7', '#ec4899', '#ff758c'][Math.floor(Math.random() * 4)];
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y * 0.01) * 0.5;
            this.opacity -= this.fadeSpeed;

            if (this.y < -20 || this.opacity <= 0) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.font = `${this.size}px sans-serif`;
            ctx.fillText('♥', this.x, this.y);
            ctx.restore();
        }
    }

    const particleCount = Math.min(Math.floor(width / 25), 45);
    const particles = Array.from({ length: particleCount }, () => new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();

    // 3. Interactive Click Hearts
    window.addEventListener('click', (e) => {
        createHeartBurst(e.clientX, e.clientY);
    });

    function createHeartBurst(x, y) {
        const count = 6;
        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            heart.style.fontSize = `${Math.random() * 16 + 12}px`;
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '9999';
            heart.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
            document.body.appendChild(heart);

            const destinationX = (Math.random() - 0.5) * 120;
            const destinationY = (Math.random() - 0.5) * 120 - 40;

            requestAnimationFrame(() => {
                heart.style.transform = `translate(${destinationX}px, ${destinationY}px) scale(1.4)`;
                heart.style.opacity = '0';
            });

            setTimeout(() => {
                heart.remove();
            }, 1000);
        }
    }
});
