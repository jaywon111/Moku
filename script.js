class MokuFinal {
    constructor() {
        this.tweaks = [
            {spd:50, str:50, def:50, dex:50, frt:50},
            {spd:50, str:50, def:50, dex:50, frt:50}
        ];
        this.mokis = [
            { id: 1, name: "Neon Oni", img: "https://i.ibb.co/Vcr0vHmh/Screenshot-20260219-204125.jpg", stars: 8, spd: 95, str: 88, def: 70, dex: 65, frt: 80 },
            { id: 2, name: "Void Cat", img: "https://i.ibb.co/Xx3LzTyB/Screenshot-20260219-204357.jpg", stars: 6, spd: 88, str: 60, def: 75, dex: 90, frt: 70 },
            { id: 3, name: "Cyber Toad", img: "https://i.ibb.co/cXVcQSW8/Screenshot-20260219-204204.jpg", stars: 4, spd: 40, str: 90, def: 85, dex: 45, frt: 95 },
            { id: 4, name: "Mecha Kong", img: "https://i.ibb.co/5g2FtYNr/Screenshot-20260219-204608.jpg", stars: 1, spd: 92, str: 75, def: 80, dex: 70, frt: 60 },
            { id: 5, name: "Glitch Spirit", img: "https://i.ibb.co/ZpWgZJGY/Screenshot-20260219-204810.jpg", stars: 2, spd: 85, str: 98, def: 50, dex: 95, frt: 88 }
        ];
        this.schemes = [
            { name: "TAKING A DIVE", rarity: "EPIC", effect: "+150 points on loss", strat: "Use when win-rate is <30% to farm points." },
            { name: "SHADOW ARTS", rarity: "RARE", effect: "+10% Speed to team", strat: "Dominates the first-strike meta." },
            { name: "BOUNTY HUNTER", rarity: "LEGENDARY", effect: "2x Points for higher rank kills", strat: "Best for 'Sleeper' units targeting whales." },
            { name: "GLASS CANNON", rarity: "RARE", effect: "+50% STR / -50% DEF", strat: "High risk blitz for Spirit/Oni builds." },
            { name: "RECYCLE BIN", rarity: "COMMON", effect: "Refunds 50 Gems on loss", strat: "Sustainable farming for budget players." },
            { name: "DATA BREACH", rarity: "EPIC", effect: "Reveal opponent hidden stats", strat: "Counter 'Sleeper' 1-star tactics." },
            { name: "OVERCLOCK", rarity: "LEGENDARY", effect: "+20% All Biological Stats", strat: "The ultimate power multiplier for Arena." }
        ];
        this.selected = [];
        this.chaosInterval = null;
        this.init();
    }

    init() {
        this.renderFighters();
        this.renderSchemes();
        this.renderScout();
        this.initCLI();
        this.initMatrix();
    }

    renderFighters() {
        document.getElementById('fighter-grid').innerHTML = this.mokis.map(m => `
            <div class="moki-card" onclick="app.toggleSelection(${m.id}, this)">
                <img src="${m.img}" class="h-24 w-full object-cover opacity-60 hover:opacity-100 transition-opacity">
                <div class="p-2 text-[8px] font-bold text-center truncate uppercase">${m.name}</div>
            </div>`).join('');
    }

    renderSchemes() {
        document.getElementById('schemes-grid').innerHTML = this.schemes.map(s => `
            <div class="scheme-item p-4 border border-gray-800 hover:border-cyan-500 transition-all cursor-pointer bg-black/50" onclick="app.toggleScheme(this)">
                <div class="flex justify-between items-center">
                    <span class="font-bold text-xs tracking-tighter text-white">${s.name}</span>
                    <span class="text-[8px] text-pink-500 font-bold border border-pink-900 px-2 py-0.5">${s.rarity}</span>
                </div>
                <div class="scheme-content text-[11px] hidden">
                    <p class="text-cyan-400 italic mt-2">${s.effect}</p>
                    <p class="text-gray-500 mt-1 text-[10px] uppercase tracking-tighter">${s.strat}</p>
                </div>
            </div>`).join('');
    }

    toggleScheme(el) {
        const content = el.querySelector('.scheme-content');
        const isHidden = content.classList.contains('hidden');
        document.querySelectorAll('.scheme-content').forEach(c => c.classList.add('hidden'));
        if (isHidden) {
            content.classList.remove('hidden');
        }
    }

    updateStat(idx, stat, val, labelId, pwrId) {
        this.tweaks[idx][stat] = parseInt(val);
        document.getElementById(labelId).innerText = val;
        this.updatePower(idx, pwrId);
    }

    updatePower(idx, pwrId) {
        const t = this.tweaks[idx];
        const power = (t.spd * 1.5 + t.str * 1.2 + t.def * 1.1 + t.dex * 0.8 + t.frt * 1) / 5;
        document.getElementById(pwrId).innerText = `PWR: ${power.toFixed(1)}`;
    }

    toggleSelection(id, el) {
        if (this.selected.includes(id)) {
            this.selected = this.selected.filter(i => i !== id);
            el.classList.remove('selected');
        } else if (this.selected.length < 2) {
            this.selected.push(id);
            el.classList.add('selected');
        }
        
        if (this.selected.length === 2) {
            document.getElementById('battle-stage').classList.remove('hidden');
            const p1 = this.mokis.find(m => m.id === this.selected[0]);
            const p2 = this.mokis.find(m => m.id === this.selected[1]);
            
            document.getElementById('t1-title').innerText = p1.name.toUpperCase();
            document.getElementById('t2-title').innerText = p2.name.toUpperCase();
            document.getElementById('fighter1-img').src = p1.img;
            document.getElementById('fighter2-img').src = p2.img;
            
            // Reset stats to default 50
            ['spd','str','def','dex','frt'].forEach(stat => {
                this.tweaks[0][stat] = 50;
                this.tweaks[1][stat] = 50;
                document.getElementById(`t1-${stat}-val`).innerText = '50';
                document.getElementById(`t2-${stat}-val`).innerText = '50';
                document.querySelectorAll(`#t1-${stat}-val`).forEach(el => {
                    const range = el.closest('div')?.nextElementSibling;
                    if (range) range.value = 50;
                });
            });
            
            this.updatePower(0, 't1-pwr');
            this.updatePower(1, 't2-pwr');
            
            document.getElementById('simulation-result').classList.add('hidden');
        } else {
            document.getElementById('battle-stage').classList.add('hidden');
        }
    }

    startSimulation() {
        
        document.getElementById('simulation-result').classList.remove('hidden');
        document.getElementById('calculating-state').classList.remove('hidden');
        document.getElementById('results-state').classList.add('hidden');
        
        
        let pos = 30 + Math.random() * 40;
        const slider = document.getElementById('chaos-slider');
        const fill = document.getElementById('chaos-fill');
        
        if (this.chaosInterval) clearInterval(this.chaosInterval);
        
        this.chaosInterval = setInterval(() => {
            pos = 20 + Math.random() * 60;
            slider.style.left = pos + '%';
            fill.style.width = pos + '%';
        }, 100);
        
        
        setTimeout(() => {
            clearInterval(this.chaosInterval);
            this.showResults();
        }, 2000);
    }

    showResults() {
        document.getElementById('calculating-state').classList.add('hidden');
        document.getElementById('results-state').classList.remove('hidden');
        
        const p1 = this.mokis.find(m => m.id === this.selected[0]);
        const p2 = this.mokis.find(m => m.id === this.selected[1]);
        
        
        const pow1 = (this.tweaks[0].spd * 1.5 + this.tweaks[0].str * 1.2 + this.tweaks[0].def * 1.1 + this.tweaks[0].dex * 0.8 + this.tweaks[0].frt * 1);
        const pow2 = (this.tweaks[1].spd * 1.5 + this.tweaks[1].str * 1.2 + this.tweaks[1].def * 1.1 + this.tweaks[1].dex * 0.8 + this.tweaks[1].frt * 1);
        
        const total = pow1 + pow2;
        const pct1 = (pow1 / total * 100).toFixed(1);
        const pct2 = (pow2 / total * 100).toFixed(1);
        
        document.getElementById('alpha-pct').innerText = pct1 + '%';
        document.getElementById('omega-pct').innerText = pct2 + '%';
        
        const chaos = (Math.random() * 4 - 2).toFixed(2);
        document.getElementById('chaos-factor').innerText = chaos + '%';
        
        const barWidth = (pow1 / total * 100);
        document.getElementById('result-bar').style.width = barWidth + '%';
        
        const winner = pow1 > pow2 ? p1 : p2;
        const winnerEl = document.getElementById('winner-name');
        winnerEl.innerText = winner.name.toUpperCase();
        winnerEl.style.color = pow1 > pow2 ? 'var(--neon-cyan)' : 'var(--moku-pink)';
        winnerEl.classList.add('glitch-text');
        setTimeout(() => winnerEl.classList.remove('glitch-text'), 800);
    }

    downloadReport(event) {
        if (this.selected.length < 2) {
            this.print("> ERROR: Select two athletes first");
            return;
        }
        
        const p1 = this.mokis.find(m => m.id === this.selected[0]);
        const p2 = this.mokis.find(m => m.id === this.selected[1]);
        
        const pow1 = (this.tweaks[0].spd * 1.5 + this.tweaks[0].str * 1.2 + this.tweaks[0].def * 1.1 + this.tweaks[0].dex * 0.8 + this.tweaks[0].frt * 1);
        const pow2 = (this.tweaks[1].spd * 1.5 + this.tweaks[1].str * 1.2 + this.tweaks[1].def * 1.1 + this.tweaks[1].dex * 0.8 + this.tweaks[1].frt * 1);
        const winner = pow1 > pow2 ? p1 : p2;
        
        const date = new Date().toLocaleString();
        
        const content = `╔════════════════════════════════════╗
║    MOKU ALPHA TERMINAL      ║
║    BATTLE ARENA REPORT            ║
╠════════════════════════════════════╣
║ Generated: ${date.padEnd(28)} ║
╠════════════════════════════════════╣
║ MOKU ALPHA: ${p1.name.padEnd(24)} ║
║   SPD: ${this.tweaks[0].spd}  STR: ${this.tweaks[0].str}  ║
║   DEF: ${this.tweaks[0].def}  DEX: ${this.tweaks[0].dex}  ║
║   FRT: ${this.tweaks[0].frt}  PWR: ${pow1.toFixed(1)}  ║
╠════════════════════════════════════╣
║ MOKU OMEGA: ${p2.name.padEnd(23)} ║
║   SPD: ${this.tweaks[1].spd}  STR: ${this.tweaks[1].str}  ║
║   DEF: ${this.tweaks[1].def}  DEX: ${this.tweaks[1].dex}  ║
║   FRT: ${this.tweaks[1].frt}  PWR: ${pow2.toFixed(1)}  ║
╠════════════════════════════════════╣
║ WINNER: ${winner.name.padEnd(28)} ║
╚════════════════════════════════════╝`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; 
        a.download = `Moku_Arena_${Date.now()}.txt`; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.print("> REPORT GENERATED: CHECK DOWNLOADS");
        
        if (event && event.target) {
            const btn = event.target.closest('button');
            if (btn) {
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => btn.style.transform = 'scale(1)', 200);
            }
        }
    }

    renderScout() {
        document.getElementById('scout-body').innerHTML = this.mokis.map(m => {
            const sleeper = m.stars < 3 && m.spd > 80;
            return `<tr class="border-b border-cyan-900/10">
                <td class="p-4 font-bold tracking-tighter">${m.name}</td>
                <td class="p-4 text-cyan-400">${m.spd}</td>
                <td class="p-4 text-pink-500">${'★'.repeat(m.stars)}</td>
                <td class="p-4 text-right ${sleeper ? 'text-green-500 italic' : 'text-gray-600'}">${sleeper ? 'SLEEPER: BUY' : 'STABLE: HOLD'}</td>
            </tr>`;
        }).join('');
    }

    navigate(t) {
        document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
        document.getElementById(`${t}-section`).classList.remove('hidden');
        //this.print(`> ACCESSING: ${t.toUpperCase()}`);
    }

    initCLI() {
        document.getElementById('cli-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = e.target.value.toLowerCase().trim();
                e.target.value = '';
                if (['arena', 'schemes', 'scout'].includes(cmd)) this.navigate(cmd);
                else if (cmd === 'status') this.print("SYSTEM: BATTLE ARENA ACTIVE");
                else if (cmd === 'clear') document.getElementById('terminal-output').innerHTML = '';
                else this.print(`> UNKNOWN: ${cmd}`);
            }
        });
    }

    print(msg) {
        const out = document.getElementById('terminal-output');
        const d = document.createElement('div');
        d.innerText = msg;
        out.appendChild(d);
        out.scrollTop = out.scrollHeight;
    }

    initMatrix() {
        const c = document.getElementById('matrix'), x = c.getContext('2d');
        c.width = window.innerWidth; c.height = window.innerHeight;
        const dps = Array(Math.floor(c.width/14)).fill(1);
        setInterval(() => {
            x.fillStyle = "rgba(0,0,0,0.05)"; x.fillRect(0,0,c.width,c.height);
            x.fillStyle = "#00f0ff"; x.font = "14px monospace";
            dps.forEach((y, i) => {
                x.fillText("MOKU"[Math.floor(Math.random()*4)], i*14, y*14);
                if (y*14 > c.height && Math.random() > 0.975) dps[i] = 0;
                dps[i]++;
            });
        }, 33);
    }
}
const app = new MokuFinal();
