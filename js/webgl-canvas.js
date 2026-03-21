class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
            this.glowOffset = Math.random() * Math.PI * 2;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            // REMOVED SHADOW BLUR TO SAVE 40% CPU/GPU USAGE
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x > width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > height || this.y < 0) this.directionY = -this.directionY;

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance; 
            
            if (distance < mouse.radius) {
                this.x -= forceDirectionX * force * this.density * 0.6;
                this.y -= forceDirectionY * force * this.density * 0.6;
            } else {
                if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 100;
                if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 100;
            }

            this.x += this.directionX;
            this.y += this.directionY;
            
            this.glowOffset += 0.05;
            this.size = Math.max(0.1, this.size + Math.sin(this.glowOffset) * 0.05); // Prevent negative size errors

            this.draw();
        }
    }

    function initParticles() {
        particleArray = [];
        // HARD CAPPED THE PARTICLES SO IT DOESN'T CRASH 4K MONITORS
        let numberOfParticles = Math.min(100, (canvas.height * canvas.width) / 15000); 

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1; // Slightly smaller to compensate for no blur
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;
            let color = colors[Math.floor(Math.random() * colors.length)];

            particleArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }