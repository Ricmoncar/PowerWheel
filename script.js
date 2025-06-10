class PowerWheel {
    constructor() {
        // DOM Elements
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.itemsContainer = document.getElementById('itemsContainer');
        this.addItemBtn = document.getElementById('addItemBtn');
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

        // State
        this.items = [];
        this.colors = [];
        this.rotation = 0;
        this.isSpinning = false;
        this.animationFrameId = null;
        this.standbyFrameId = null;
        this.totalWeight = 0;

        // Settings & Presets
        this.settings = { duration: 12, revolutions: 15 };
        this.presets = {
            strength: ['Below Average Human','Average Human','Athletic Human','Wall','Small Building','Building','Large Building','City Block','Multi-City Block','Town','Mountain','Multi-Mountain','Island','Country','Multi-Country','Continent','Moon','Planetary','Multi-Planetary','Star','Solar System','Cosmic', 'Black Hole', 'Galactic','Multi-Galactic','Universal','Universal+','Multiversal','Low-Complex Multiversal', 'Complex Multiversal', 'High Complex Multiversal', 'Outerversal','Boundless'],
            speed: ['Sub-human','Average Human', 'Cheetah', 'Subsonic', 'Transonic','Sound Barrier', 'Supersonic','Supersonic+', 'Hypersonic','Hypersonic+','Massively Hypersonic','Sub-Relativistic','Relativistic','Speed of Light','FTL','FTL+', 'Massively FTL', 'Massively FTL+', 'Immeasurable','Irrelevant','Omnipresent'],
            magic: ['No Magic','Latent Power','Basic Spells','Apprentice', 'Intermediate Magic','Advanced Runes','Mage','Archmage', 'Grand Wizard', 'Sage', 'Planetary Magic','Solar Magic','Reality Warping','Conceptual Manipulation','Metaphysical Power','Causality Manipulation','Plot Manipulation', 'Omnipotence'],
            iq: ['Primitive', 'Below Average','Average','Above Average','Smart','Gifted','Genius','Super Genius','Prodigy','Mega Genius', 'Superhuman','Cosmic Intelligence','Nigh-Omniscient','Omniscient'],
            skill: ['Clumsy', 'Regular Human', 'Amateur','Trained Fighter','Martial Artist','Expert Brawler', 'Black Belt', 'Tactical Genius','Planetary Champion','Precognitive Fighter','Reactive Evolution','Galactic Warrior','Plot Armor'],
            weapon: [
                // --- Basic & Improvised ---
                'Fists', 'Spiky Toothbrush', 'Clarinet', 'Guitar', 'Baseball bat', 'Lipstick', 'Club', 'Staff', 'Throwing Rocks', 'Improvised Shield',
                'Rubber Chicken', 'Banana', 'Toaster', 'Umbrella', 'Frozen Fish', 'Squeaky Hammer', 'Plunger', 'Traffic Cone', 'Spoon', 'Rolling Pin',
                'Sock Filled With Coins', 'Lawn Gnome', 'Bag of Marshmallows', 'Selfie Stick', 'Keyboard', 'Cactus', 'Pizza Cutter', 'Slipper', 'Teddy Bear',
                'Water Balloon', 'Paintbrush', 'Toilet Brush', 'Garden Hose', 'Remote Control', 'Plastic Flamingo', 'Loaf of Bread', 'Pillow', 'Rubber Duck',
                'Bag of Chips', 'Stapler', 'Shovel', 'Baguette', 'Cheese Grater', 'Fly Swatter', 'Mop', 'Old Boot', 'VHS Tape', 'Pineapple', 'Bubble Wand', 'Krispy Treat',
                // --- Melee - Daggers & Short Blades ---
                'Dagger', 'Knife', 'Kukri', 'Kris', 'Stiletto', 'Tanto', 'Seax', 'Parrying Dagger',
                // --- Melee - Swords ---
                'Shortsword', 'Gladius', 'Arming Sword', 'Broadsword', 'Scimitar', 'Falchion', 'Messer', 'Katana', 'Rapier', 'Longsword', 'Bastard Sword', 'Claymore', 'Zweihänder', 'Flamberge',
                // --- Melee - Axes ---
                'Hand Axe', 'Battle Axe', 'Dane Axe', 'War Axe', 'Double-Headed Axe',
                // --- Melee - Blunt & Crushing ---
                'Mace', 'Morning Star', 'War Hammer', 'Flail', 'War Pick', 'Quarterstaff', 'Cestus', 'Brass Knuckles', 'Sledgehammer',
                // --- Melee - Polearms ---
                'Spear', 'Boar Spear', 'Trident', 'Javelin', 'Pike', 'Lance', 'Glaive', 'Naginata', 'Guisarme', 'Voulge', 'Billhook', 'Poleaxe', 'Halberd', 'War Scythe',
                'Sling', 'Shortbow', 'Longbow', 'Recurve Bow', 'Light Crossbow', 'Heavy Crossbow', 'Repeating Crossbow',
                // --- Ranged - Firearms ---
                'Hand Cannon', 'Arquebus', 'Flintlock Pistol', 'Musket', 'Blunderbuss', 'Revolver', 'Lever-Action Rifle', 'Pump-Action Shotgun', 'Bolt-Action Rifle', 'Submachine Gun', 'Assault Rifle',
                // --- Higher Concepts ---
                'Kris`s Blade', 'Susie´s Axe', 'Enchanted Weapon', 'Sentient Weapon', 'Energy Blade', 'Divine Bow', 'Reality-Bending Pencil', 'Cosmic Staff', 'Dimensional Sword', 'Time Manipulating Dagger', 'Quantum Gun', 'Multiversal Axe', 'Omnipotent Hammer'
            ],
            elements: [
                // --- Foundational ---
                'Fire', 'Water', 'Earth', 'Air',
                // --- Physical & Environmental ---
                'Ice', 'Lightning', 'Plant', 'Wood', 'Metal', 'Sand', 'Magma', 'Steam', 'Mud', 'Smoke', 'Crystal', 'Glass', 'Ash', 'Poison', 'Acid',
                // --- Energy & Force ---
                'Light', 'Darkness', 'Shadow', 'Sound', 'Vibration', 'Kinetic Force', 'Gravity', 'Magnetism', 'Plasma', 'Radiation',
                // --- Biological & Ethereal ---
                'Life', 'Death', 'Blood', 'Bone', 'Flesh', 'Spirit', 'Soul', 'Aura', 'Chi', 'Mind', 'Dream', 'Emotion', 'Illusion',
                // --- Abstract & Conceptual ---
                'Time', 'Space', 'Aether', 'Nether', 'Chaos', 'Order', 'Creation', 'Destruction', 'Luck', 'Fate', 'Logic', 'Knowledge', 'Nothingness', 'Possibility', 'Reality',
                // --- Ultimate Tier ---
                'Vector Manipulation', 'Spirit', 'ERASURE', 'VOID', 'N-EX'
            ]
        };

        // --- Audio Pool for Ticks ---
        this.tickAudioPool = [];
        this.tickPoolSize = 8; // Number of simultaneous tick sounds allowed
        this.currentTickIndex = 0;
        for (let i = 0; i < this.tickPoolSize; i++) {
            const audio = new Audio('sounds/tick.mp3');
            audio.volume = 0.4;
            this.tickAudioPool.push(audio);
        }
        
        // Other sounds
        this.sounds = {
            win: new Audio('sounds/win.mp3'),
            click: new Audio('sounds/click.mp3')
        };
        this.sounds.click.volume = 0.3;

        // Initialization
        this.bindEvents();
        this.updateSettingsDisplay();
        this.loadPreset('strength');
        this.startStandbyAnimation();
    }

    bindEvents() {
        this.updateBtn.addEventListener('click', () => { this.playSound('click'); this.updateWheel(); });
        this.spinBtn.addEventListener('click', () => this.spin());
        this.startColorInput.addEventListener('input', () => this.updateWheel());
        this.endColorInput.addEventListener('input', () => this.updateWheel());
        this.presetBtns.forEach(btn => btn.addEventListener('click', (e) => { this.playSound('click'); this.loadPreset(e.target.dataset.preset); }));
        this.settingsBtn.addEventListener('click', () => { this.playSound('click'); this.showModal(); });
        this.closeModalBtn.addEventListener('click', () => { this.playSound('click'); this.hideModal(); });
        this.modalOverlay.addEventListener('click', (e) => { if (e.target === this.modalOverlay) this.hideModal(); });
        this.spinDurationInput.addEventListener('input', (e) => this.updateSetting('duration', e.target.value));
        this.spinRevolutionsInput.addEventListener('input', (e) => this.updateSetting('revolutions', e.target.value));
        this.addItemBtn.addEventListener('click', () => { this.playSound('click'); this.addItemRow(); });
    }

    playSound(soundName) {
        if (soundName === 'tick') {
            const sound = this.tickAudioPool[this.currentTickIndex];
            sound.currentTime = 0;
            sound.play().catch(e => console.error("Error playing tick sound:", e));
            this.currentTickIndex = (this.currentTickIndex + 1) % this.tickPoolSize;
        } else if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => console.error(`Could not play ${soundName} sound:`, e));
        }
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

    addItemRow(name = 'New Item', weight = 1) {
        const row = document.createElement('div');
        row.className = 'item-row';
        row.innerHTML = `
            <input type="text" class="item-name" value="${name}">
            <input type="number" class="item-weight" value="${weight}" min="1" step="1">
            <button class="btn btn-remove" title="Remove Item">×</button>
        `;
        row.querySelector('.btn-remove').addEventListener('click', (e) => {
            this.playSound('click');
            e.currentTarget.parentElement.remove();
            this.updateWheel();
        });
        this.itemsContainer.appendChild(row);
    }

    loadPreset(presetName) {
        if (!this.presets[presetName]) return;
        this.itemsContainer.innerHTML = ''; // Clear existing items
        this.presets[presetName].forEach(item => this.addItemRow(item, 1));
        this.updateWheel();
    }

    updateWheel() {
        if (this.isSpinning) return;
        const itemRows = this.itemsContainer.querySelectorAll('.item-row');
        this.items = Array.from(itemRows).map(row => {
            const name = row.querySelector('.item-name').value.trim();
            const weight = parseInt(row.querySelector('.item-weight').value, 10) || 1;
            return { name, weight };
        }).filter(item => item.name !== '');

        if (this.items.length === 0) this.items = [{ name: 'Add Items!', weight: 1 }];

        this.totalWeight = this.items.reduce((sum, item) => sum + item.weight, 0);
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
    
        let currentAngle = this.rotation;
    
        this.items.forEach((item, index) => {
            const sliceAngle = (item.weight / this.totalWeight) * (2 * Math.PI);
            this.drawSlice(item.name, index, currentAngle, sliceAngle);
            currentAngle += sliceAngle;
        });
    }
    
    drawSlice(text, index, startAngle, sliceAngle) {
        const ctx = this.ctx;
        const { width, height } = this.canvas;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = centerX;
    
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = this.colors[index % this.colors.length];
        ctx.fill();
    
        ctx.lineWidth = 0.2;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.stroke();
    
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
    
        const textStartRadius = radius * 0.1;
        const textAvailableLength = radius * 0.85;
        let fontSize =  Math.min(20, sliceAngle * 150);

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
        this.playSound('click');
        this.stopStandbyAnimation();
        
        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.winnerDisplay.classList.remove('show');
    
        const randomWeight = Math.random() * this.totalWeight;
        let weightSum = 0;
        let winnerIndex = -1;
        for (let i = 0; i < this.items.length; i++) {
            weightSum += this.items[i].weight;
            if (randomWeight <= weightSum) {
                winnerIndex = i;
                break;
            }
        }
    
        let angleToWinner = 0;
        for (let i = 0; i < winnerIndex; i++) {
            angleToWinner += (this.items[i].weight / this.totalWeight) * (2 * Math.PI);
        }
        const winnerSliceAngle = (this.items[winnerIndex].weight / this.totalWeight) * (2 * Math.PI);
        const randomAngleInSlice = Math.random() * winnerSliceAngle * 0.8 + winnerSliceAngle * 0.1;
        const finalAngle = -(angleToWinner + randomAngleInSlice);

        const fullSpins = this.settings.revolutions * 2 * Math.PI;
        const startRotation = this.rotation;
        const travelDistance = fullSpins + (finalAngle - (startRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
        const targetRotation = startRotation + travelDistance;
    
        const startTime = performance.now();
        const duration = this.settings.duration * 1000;
        
        const tickAngle = (2 * Math.PI) / this.items.length;
        let lastTickIndex = Math.floor(Math.abs(startRotation) / tickAngle);

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
            
            const currentTickIndex = Math.floor(Math.abs(this.rotation) / tickAngle);
            if (currentTickIndex > lastTickIndex) {
                this.playSound('tick');
                lastTickIndex = currentTickIndex;
            }
    
            this.animationFrameId = requestAnimationFrame(animate);
        };
    
        this.animationFrameId = requestAnimationFrame(animate);
    }
    
    onSpinComplete(winnerIndex) {
        this.isSpinning = false;
        this.spinBtn.disabled = false;
        this.winnerText.textContent = this.items[winnerIndex].name;
        this.winnerDisplay.classList.add('show');
        this.playSound('win');
        this.triggerConfetti();
        this.startStandbyAnimation();
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

    startStandbyAnimation() {
        if (this.standbyFrameId) return; // Already running
        const animateStandby = () => {
            this.rotation += 0.0005;
            this.drawWheel();
            this.standbyFrameId = requestAnimationFrame(animateStandby);
        };
        animateStandby();
    }

    stopStandbyAnimation() {
        if (this.standbyFrameId) {
            cancelAnimationFrame(this.standbyFrameId);
            this.standbyFrameId = null;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new PowerWheel());