class PowerWheel {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.itemsInput = document.getElementById('items');
        this.startColorInput = document.getElementById('startColor');
        this.endColorInput = document.getElementById('endColor');
        this.updateBtn = document.getElementById('updateBtn');
        this.spinBtn = document.getElementById('spinBtn');
        this.winnerDisplay = document.getElementById('winnerDisplay');
        this.winnerText = document.getElementById('winnerText');
        this.presetBtns = document.querySelectorAll('.btn-preset');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.modalOverlay = document.getElementById('settingsModal');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.spinDurationInput = document.getElementById('spinDuration');
        this.spinDurationValue = document.getElementById('spinDurationValue');
        this.spinRevolutionsInput = document.getElementById('spinRevolutions');
        this.spinRevolutionsValue = document.getElementById('spinRevolutionsValue');

        this.items = [];
        this.colors = [];
        this.rotation = 0;
        this.isSpinning = false;
        this.animationFrameId = null;

        this.settings = { duration: 8, revolutions: 9 };
        this.presets = {
            strength: ['Below Average Human','Average Human','Athletic Human','Wall','Small Building','Building','Large Building','City Block','Multi-City Block','Town','Mountain','Multi-Mountain','Island','Country','Multi-Country','Continent','Moon','Planetary','Multi-Planetary','Star','Solar System','Cosmic', 'Black Hole', 'Galactic','Multi-Galactic','Universal ','Universal+','Multiversal','Low-Complex Multiversal','Multiversal', 'Complex Multiversal', 'High Complex Multiversal', 'Outerversal','Boundless'],
            speed: ['Average Human', 'Cheetah', 'Subsonic', 'Subsonic++','Sound Barrier', 'Supersonic', 'Hypersonic','Massively Hypersonic','Relativistic','Speed of Light','FTL','FTL+', 'Massivel FTL', 'Massively FTL+', 'Cosmic', 'Infinite','Immeasurable','Irrelevant','Omnipresent'],
            magic: ['No Magic','Latent Power','Basic','Apprentince', 'Intermediate','Advanced','Mage','Archmage', 'Lich', 'Planetary','Solar','Reality Warping','Conceptual Manipulation','Metaphysical Power','Omnipotence'],
            iq: ['Primitive', 'Cat', 'Below Average','Average','Above Average','Smart','Gifted','Genius','Super Genius','Albert Einstein','Superhuman','Cosmic','Nigh-Omniscient','Omniscient']
        };

        this.bindEvents();
        this.updateSettingsDisplay();
        this.loadPreset('strength');
    }

    bindEvents() {
        this.updateBtn.addEventListener('click', () => this.updateWheel());
        this.spinBtn.addEventListener('click', () => this.spin());
        this.startColorInput.addEventListener('input', () => this.updateWheel());
        this.endColorInput.addEventListener('input', () => this.updateWheel());
        this.presetBtns.forEach(btn => btn.addEventListener('click', (e) => this.loadPreset(e.target.dataset.preset)));
        this.settingsBtn.addEventListener('click', () => this.showModal());
        this.closeModalBtn.addEventListener('click', () => this.hideModal());
        this.modalOverlay.addEventListener('click', (e) => { if (e.target === this.modalOverlay) this.hideModal(); });
        this.spinDurationInput.addEventListener('input', (e) => this.updateSetting('duration', e.target.value));
        this.spinRevolutionsInput.addEventListener('input', (e) => this.updateSetting('revolutions', e.target.value));
    }

    showModal() { this.modalOverlay.classList.add('show'); }
    hideModal() { this.modalOverlay.classList.remove('show'); }

    updateSetting(key, value) {
        this.settings[key] = parseInt(value, 10);
        this.updateSettingsDisplay();
    }

    updateSettingsDisplay() {
        this.spinDurationValue.textContent = `${this.settings.duration}s`;
        this.spinDurationInput.value = this.settings.duration;
        this.spinRevolutionsValue.textContent = `${this.settings.revolutions}`;
        this.spinRevolutionsInput.value = this.settings.revolutions;
    }

    loadPreset(presetName) {
        if (this.presets[presetName]) {
            this.itemsInput.value = this.presets[presetName].join('\n');
            this.updateWheel();
        }
    }

    updateWheel() {
        if (this.isSpinning) return;
        this.items = this.itemsInput.value.split('\n').filter(item => item.trim() !== '');
        if (this.items.length === 0) this.items = ['Add Items & Spin!'];
        this.colors = this.generateGradient(this.startColorInput.value, this.endColorInput.value, this.items.length);
        this.drawWheel();
        this.spinBtn.disabled = this.items.length <= 1;
    }

    generateGradient(startHex, endHex, steps) {
        const p = hex => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
        const s = p(startHex), e = p(endHex);
        return Array.from({length: steps}, (_,i) => {
            const r = steps > 1 ? i / (steps-1) : 1, rgb = s.map((c,j) => Math.round(c + r * (e[j]-c)));
            return `rgb(${rgb.join(',')})`;
        });
    }

    drawWheel() {
        const ctx = this.ctx;
        const { width, height } = this.canvas;
        ctx.clearRect(0, 0, width, height);

        this.items.forEach((item, index) => {
            this.drawSlice(item, index);
        });
    }

    drawSlice(text, index) {
        const ctx = this.ctx;
        const { width, height } = this.canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = centerX - -1;
        const sliceAngle = (2 * Math.PI) / this.items.length;
        const sliceCenterAngle = this.rotation + (index * sliceAngle) + (sliceAngle / 2);

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(sliceCenterAngle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, -sliceAngle / 2, sliceAngle / 2);
        ctx.closePath();
        ctx.fillStyle = this.colors[index];
        ctx.fill();

        ctx.lineWidth = 0.15;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.stroke();

        const textStartRadius = radius * 0.1;
        const textAvailableLength = radius * 0.85;
        let fontSize = 19;

        ctx.font = `700 ${fontSize}px ${getComputedStyle(document.body).fontFamily}`;
        while (ctx.measureText(text).width > textAvailableLength && fontSize > 8) {
            fontSize--;
            ctx.font = `700 ${fontSize}px ${getComputedStyle(document.body).fontFamily}`;
        }

        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillText(text, textStartRadius + textAvailableLength / 2, 0);

        ctx.restore();
    }
    
    spin() {
        if (this.isSpinning) return;
        
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.winnerDisplay.classList.remove('show');
    
        const winnerIndex = Math.floor(Math.random() * this.items.length);
        const sliceAngle = (2 * Math.PI) / this.items.length;
        
        const finalAngle = -(winnerIndex * sliceAngle);
    
        const fullSpins = this.settings.revolutions * 2 * Math.PI;
        const startRotation = this.rotation;
        const travelDistance = fullSpins + (finalAngle - (startRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        const targetRotation = startRotation + travelDistance;
    
        const startTime = performance.now();
        const duration = this.settings.duration * 1000;
    
        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
    
            if (elapsedTime >= duration) {
                this.rotation = finalAngle;
                this.drawWheel();
                this.onSpinComplete(winnerIndex);
                return;
            }
    
            const progress = elapsedTime / duration;
            const easeOutProgress = 1 - Math.pow(1 - progress, 4);
            this.rotation = startRotation + (targetRotation - startRotation) * easeOutProgress;
            this.drawWheel();
    
            this.animationFrameId = requestAnimationFrame(animate);
        };
    
        this.animationFrameId = requestAnimationFrame(animate);
    }
    
    onSpinComplete(winnerIndex) {
        this.isSpinning = false;
        this.spinBtn.disabled = false;
        this.winnerText.textContent = this.items[winnerIndex];
        this.winnerDisplay.classList.add('show');
        this.triggerConfetti();
    }
    
    triggerConfetti() {
        const duration = 2 * 1000;
        const end = Date.now() + duration;
        (function frame() {
            if (Date.now() < end) {
                requestAnimationFrame(frame);
                [{angle:60,origin:{x:0}}, {angle:120,origin:{x:1}}].forEach(o => {
                    if(!this.startColorInput) return;
                    confetti({particleCount:2,...o,spread:55,colors:[this.startColorInput.value,this.endColorInput.value,'#ffffff']});
                });
            }
        }.bind(this)());
    }
}

document.addEventListener('DOMContentLoaded', () => new PowerWheel());