class MokuFinal {
    constructor() {
        this.tweaks = [{spd:0, str:0}, {spd:0, str:0}];
        this.mokis = [
            { id: 1, name: "Neon Oni", img: "https://i.ibb.co/Vcr0vHmh/Screenshot-20260219-204125.jpg", stars: 8, spd: 95, str: 88 },
            { id: 2, name: "Void Cat", img: "https://i.ibb.co/Xx3LzTyB/Screenshot-20260219-204357.jpg", stars: 6, spd: 88, str: 60 },
            { id: 3, name: "Cyber Toad", img: "https://i.ibb.co/cXVcQSW8/Screenshot-20260219-204204.jpg", stars: 4, spd: 40, str: 90 },
            { id: 4, name: "Mecha Kong", img: "https://i.ibb.co/5g2FtYNr/Screenshot-20260219-204608.jpg", stars: 1, spd: 92, str: 75 },
            { id: 5, name: "Glitch Spirit", img: "https://i.ibb.co/ZpWgZJGY/Screenshot-20260219-204810.jpg", stars: 2, spd: 85, str: 98 }
        ];
        this.schemes = [
            { name: "TAKING A DIVE", rarity: "EPIC", cost: "600G", effect: "+150 points on loss", strat: "Use when win-rate is <30% to farm points." },
            { name: "SHADOW ARTS", rarity: "RARE", cost: "600G", effect: "+10% Speed to team", strat: "Dominates the first-strike meta." },
            { name: "BOUNTY HUNTER", rarity: "LEGENDARY", cost: "600G", effect: "2x Points for higher rank kills", strat: "Best for 'Sleeper' units targeting whales." },
            { name: "GLASS CANNON", rarity: "RARE", cost: "600G", effect: "+50% STR / -50% DEF", strat: "High risk blitz for Spirit/Oni builds." },
            { name: "RECYCLE BIN", rarity: "COMMON", cost: "600G", effect: "Refunds 50 Gems on loss", strat: "Sustainable farming for budget players." },
            { name: "DATA BREACH", rarity: "EPIC", cost: "600G", effect: "Reveal opponent hidden stats", strat: "Counter 'Sleeper' 1-star tactics." },
            { name: "OVERCLOCK", rarity: "LEGENDARY", cost: "600G", effect: "+20% All Biological Stats", strat: "The ultimate power multiplier for Arena." }
        ];
        this.selected = [];
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
            <div class="scheme-item p-4" onclick="app.toggleScheme(this)">
                <div class="flex justify-between items-center">
                    <span class="font-bold text-xs tracking-tighter text-white">${s.name}</span>
                    <span class="text-[8px] text-pink-500 font-bold border border-pink-900 px-2 py-0.5">${s.rarity}</span>
                </div>
                <div class="scheme-content text-[11px]">
                    <p class="text-cyan-400 italic">${s.effect}</p>
                    <p class="text-gray-500 mt-2 text-[10px] uppercase tracking-tighter">${s.strat}</p>
                </div>
            </div>`).join('');
    }

    updateStats(idx, stat, val, labelId) {
        this.tweaks[idx][stat] = parseInt(val);
        document.getElementById(labelId).innerText = `+${val}`;
    }

    toggleSelection(id, el) {
        if (this.selected.includes(id)) {
            this.selected = this.selected.filter(i => i !== id);
            el.classList.remove('selected');
        } else if (this.selected.length < 2) {
            this.selected.push(id);
            el.classList.add('selected');
        }
        document.getElementById('battle-stage').classList.toggle('hidden', this.selected.length < 2);
        if (this.selected.length === 2) {
            document.getElementById('t1-title').innerText = this.mokis.find(m => m.id === this.selected[0]).name;
            document.getElementById('t2-title').innerText = this.mokis.find(m => m.id === this.selected[1]).name;
        }
    }

    runSimulation() {
        const p1 = this.mokis.find(m => m.id === this.selected[0]);
        const p2 = this.mokis.find(m => m.id === this.selected[1]);
        const s1 = (p1.spd + this.tweaks[0].spd) * 1.5 + (p1.str + this.tweaks[0].str);
        const s2 = (p2.spd + this.tweaks[1].spd) * 1.5 + (p2.str + this.tweaks[1].str);
        const winName = document.getElementById('winner-name');
        document.getElementById('simulation-result').classList.remove('hidden');
        winName.classList.add('glitch-text');
        const winner = s1 > s2 ? p1 : p2;
        winName.innerText = winner.name.toUpperCase();
        winName.style.color = s1 > s2 ? 'var(--moku-pink)' : 'var(--neon-cyan)';
        document.getElementById('win-chance').innerText = `WIN_PROBABILITY: ${((Math.max(s1,s2)/(s1+s2))*100).toFixed(1)}%`;
        setTimeout(() => winName.classList.remove('glitch-text'), 800);
    }

    downloadReport() {
        const p1 = this.mokis.find(m => m.id === this.selected[0]);
        const p2 = this.mokis.find(m => m.id === this.selected[1]);
        const content = `MOKU ALPHA TERMINAL REPORT\n==========================\nAthlete 1: ${p1.name} (Mod Speed: +${this.tweaks[0].spd})\nAthlete 2: ${p2.name} (Mod Speed: +${this.tweaks[1].spd})\nResult: SUCCESSFUL SIMULATION\nGrand Arena S1 Ready.`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'Moku_Tactical_Report.txt'; a.click();
        this.print("> REPORT GENERATED. CHECK DOWNLOADS.");
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
        this.print(`> GOTO_${t.toUpperCase()}`);
    }

    initCLI() {
        document.getElementById('cli-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = e.target.value.toLowerCase().trim();
                e.target.value = '';
                if (['arena', 'schemes', 'scout'].includes(cmd)) this.navigate(cmd);
                else if (cmd === 'status') this.print("SYSTEM: S1 ACTIVE | POOL: $1,000,000");
                else if (cmd === 'clear') document.getElementById('terminal-output').innerHTML = '';
                else this.print(`ERR: '${cmd}' INVALID COMMAND`);
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