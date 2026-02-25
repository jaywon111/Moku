class MokuAlphaTerminal {
    constructor() {
        // Team stats (averages)
        this.teamStats = [
            {spd:50, str:50, def:50, dex:50, frt:50}, // Team Alpha
            {spd:50, str:50, def:50, dex:50, frt:50}  // Team Omega
        ];
        
        // TEAMS (each = 3 Moki)
        this.teams = [
            { 
                id: 1, 
                name: "TEAM ALPHA", 
                captain: "GENESIS #1042",
                roster: ["#1042", "#0891", "#4523"],
                img: "https://placehold.co/400x400/ff007a/00f0ff?text=TEAM+A",
                stars: 8, 
                spd: 95, str: 88, def: 70, dex: 65, frt: 80 
            },
            { 
                id: 2, 
                name: "TEAM OMEGA", 
                captain: "GENESIS #2357",
                roster: ["#2357", "#6712", "#9034"],
                img: "https://placehold.co/400x400/00f0ff/ff007a?text=TEAM+O",
                stars: 6, 
                spd: 88, str: 60, def: 75, dex: 90, frt: 70 
            },
            { 
                id: 3, 
                name: "TEAM GHOST", 
                captain: "GENESIS #3891",
                roster: ["#3891", "#5123", "#7765"],
                img: "https://placehold.co/400x400/ff007a/00f0ff?text=TEAM+G",
                stars: 4, 
                spd: 40, str: 90, def: 85, dex: 45, frt: 95 
            },
            { 
                id: 4, 
                name: "TEAM CYBER", 
                captain: "GENESIS #4562",
                roster: ["#4562", "#2341", "#8902"],
                img: "https://placehold.co/400x400/00f0ff/ff007a?text=TEAM+C",
                stars: 1, 
                spd: 92, str: 75, def: 80, dex: 70, frt: 60 
            },
            { 
                id: 5, 
                name: "TEAM SPIRIT", 
                captain: "GENESIS #5738",
                roster: ["#5738", "#9901", "#1123"],
                img: "https://placehold.co/400x400/ff007a/00f0ff?text=TEAM+S",
                stars: 2, 
                spd: 85, str: 98, def: 50, dex: 95, frt: 88 
            }
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
        
        this.selectedTeams = [];
        this.chaosInterval = null;
        this.init();
    }

    init() {
        this.renderTeams();
        this.renderSchemes();
        this.renderScout();
        this.initCLI();
        this.initMatrix();
    }

    renderTeams() {
        document.getElementById('team-grid').innerHTML = this.teams.map(t => `
            <div class="team-card" onclick="app.toggleTeam(${t.id}, this)">
                <img src="${t.img}" class="h-24 w-full object-cover opacity-60 hover:opacity-100 transition-opacity">
                <div class="p-2 text-[8px] font-bold text-center truncate uppercase">${t.name}</div>
                <div class="text-[6px] text-center text-cyan-700">${t.roster.join(' ')}</div>
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

    updateTeamStat(teamIdx, stat, val, labelId, pwrId) {
        this.teamStats[teamIdx][stat] = parseInt(val);
        document.getElementById(labelId).innerText = val;
        this.updateTeamPower(teamIdx, pwrId);
    }

    updateTeamPower(teamIdx, pwrId) {
        const t = this.teamStats[teamIdx];
        
        const power = (t.spd * 1.5 + t.str * 1.2 + t.def * 1.1 + t.dex * 0.8 + t.frt * 1.0) / 5;
        document.getElementById(pwrId).innerText = `PWR: ${power.toFixed(1)}`;
    }

    toggleTeam(id, el) {
        if (this.selectedTeams.includes(id)) {
            this.selectedTeams = this.selectedTeams.filter(i => i !== id);
            el.classList.remove('selected');
        } else if (this.selectedTeams.length < 2) {
            this.selectedTeams.push(id);
            el.classList.add('selected');
        }
        
        if (this.selectedTeams.length === 2) {
            document.getElementById('battle-stage').classList.remove('hidden');
            const team1 = this.teams.find(t => t.id === this.selectedTeams[0]);
            const team2 = this.teams.find(t => t.id === this.selectedTeams[1]);
            
            
            document.getElementById('team1-name').value = team1.name;
            document.getElementById('team2-name').value = team2.name;
            
            
            document.getElementById('team1-moki1').innerText = team1.roster[0];
            document.getElementById('team1-moki2').innerText = team1.roster[1];
            document.getElementById('team1-moki3').innerText = team1.roster[2];
            document.getElementById('team2-moki1').innerText = team2.roster[0];
            document.getElementById('team2-moki2').innerText = team2.roster[1];
            document.getElementById('team2-moki3').innerText = team2.roster[2];
            
            // Set images
            document.getElementById('team1-img').src = team1.img;
            document.getElementById('team2-img').src = team2.img;
            document.getElementById('team1-img').classList.remove('hidden');
            document.getElementById('team2-img').classList.remove('hidden');
            document.getElementById('team1-icon').classList.add('hidden');
            document.getElementById('team2-icon').classList.add('hidden');
            
            
            ['spd','str','def','dex','frt'].forEach(stat => {
                this.teamStats[0][stat] = 50;
                this.teamStats[1][stat] = 50;
                document.getElementById(`team1-${stat}-val`).innerText = '50';
                document.getElementById(`team2-${stat}-val`).innerText = '50';
                
                const range1 = document.querySelector(`#team1-${stat}-val`).closest('div')?.nextElementSibling;
                const range2 = document.querySelector(`#team2-${stat}-val`).closest('div')?.nextElementSibling;
                if (range1) range1.value = 50;
                if (range2) range2.value = 50;
            });
            
            this.updateTeamPower(0, 'team1-pwr');
            this.updateTeamPower(1, 'team2-pwr');
            
            document.getElementById('simulation-result').classList.add('hidden');
        } else {
            document.getElementById('battle-stage').classList.add('hidden');
        }
    }

    startSimulation() {
        if (this.selectedTeams.length < 2) {
            this.print("> ERROR: Select two teams first");
            return;
        }
        
        const resultSection = document.getElementById('simulation-result');
        const calcState = document.getElementById('calculating-state');
        const resState = document.getElementById('results-state');
        
        resultSection.classList.remove('hidden');
        calcState.classList.remove('hidden');
        resState.classList.add('hidden');
        
        this.print("> INJECTING CHAOS PROTOCOL...");
        document.body.style.filter = "hue-rotate(90deg) brightness(1.2)";
        
        let progress = 0;
        const slider = document.getElementById('chaos-slider');
        const fill = document.getElementById('chaos-fill');
        
        if (this.chaosInterval) clearInterval(this.chaosInterval);
        
        this.chaosInterval = setInterval(() => {
            progress += Math.random() * 15;
            let visualPos = Math.sin(Date.now() / 100) * 30 + 50;
            slider.style.left = visualPos + '%';
            fill.style.width = visualPos + '%';
            
            if (progress >= 100) {
                clearInterval(this.chaosInterval);
                document.body.style.filter = "none";
                this.showResults();
            }
        }, 80);
    }

    showResults() {
        document.getElementById('calculating-state').classList.add('hidden');
        document.getElementById('results-state').classList.remove('hidden');
        
        const team1 = this.teams.find(t => t.id === this.selectedTeams[0]);
        const team2 = this.teams.find(t => t.id === this.selectedTeams[1]);
        
        
        const pow1 = (this.teamStats[0].spd * 1.5 + this.teamStats[0].str * 1.2 + this.teamStats[0].def * 1.1 + this.teamStats[0].dex * 0.8 + this.teamStats[0].frt * 1.0);
        const pow2 = (this.teamStats[1].spd * 1.5 + this.teamStats[1].str * 1.2 + this.teamStats[1].def * 1.1 + this.teamStats[1].dex * 0.8 + this.teamStats[1].frt * 1.0);
        
        const total = pow1 + pow2;
        const pct1 = (pow1 / total * 100).toFixed(1);
        const pct2 = (pow2 / total * 100).toFixed(1);
        
        document.getElementById('alpha-pct').innerText = pct1 + '%';
        document.getElementById('omega-pct').innerText = pct2 + '%';
        
        
        const chaos = (Math.random() * 4 - 2).toFixed(2);
        document.getElementById('chaos-factor').innerText = chaos + '%';
        
        const barWidth = (pow1 / total * 100);
        document.getElementById('result-bar').style.width = barWidth + '%';
        
        
        const gachaWinner = Math.random() < (pow1/(pow1+pow2)) ? team1.name : team2.name;
        const combatWinner = Math.random() < (pow1/(pow1+pow2)) ? team1.name : team2.name;
        const wartWinner = Math.random() < (pow1/(pow1+pow2)) ? team1.name : team2.name;
        
        document.getElementById('gacha-winner').innerText = gachaWinner;
        document.getElementById('combat-winner').innerText = combatWinner;
        document.getElementById('wart-winner').innerText = wartWinner;
        
        // Overall winner
        const winner = pow1 > pow2 ? team1 : team2;
        const winnerEl = document.getElementById('winner-name');
        winnerEl.innerText = winner.name;
        winnerEl.style.color = pow1 > pow2 ? 'var(--neon-cyan)' : 'var(--moku-pink)';
        winnerEl.classList.add('glitch-text');
        setTimeout(() => winnerEl.classList.remove('glitch-text'), 800);
        
        this.print(`> VICTOR: ${winner.name} (${pow1 > pow2 ? pct1 : pct2}%)`);
        this.print("> GACHA | COMBAT | WART // 3V3 MAYHEM");
    }

    downloadReport(event) {
        if (this.selectedTeams.length < 2) {
            this.print("> ERROR: Select two teams first");
            return;
        }
        
        const team1 = this.teams.find(t => t.id === this.selectedTeams[0]);
        const team2 = this.teams.find(t => t.id === this.selectedTeams[1]);
        
        const pow1 = (this.teamStats[0].spd * 1.5 + this.teamStats[0].str * 1.2 + this.teamStats[0].def * 1.1 + this.teamStats[0].dex * 0.8 + this.teamStats[0].frt * 1.0);
        const pow2 = (this.teamStats[1].spd * 1.5 + this.teamStats[1].str * 1.2 + this.teamStats[1].def * 1.1 + this.teamStats[1].dex * 0.8 + this.teamStats[1].frt * 1.0);
        const winner = pow1 > pow2 ? team1 : team2;
        
        const date = new Date().toLocaleString();
        
        const content = `╔════════════════════════════════════╗
║    MOKU ALPHA TERMINAL v2.1      ║
║    3V3 MAYHEM BATTLE REPORT       ║
╠════════════════════════════════════╣
║ ${date}                            
╠════════════════════════════════════╣
║ TEAM ALPHA: ${team1.name}                      
║ ROSTER: ${team1.roster.join(' ')}               
║   SPD: ${this.teamStats[0].spd}  STR: ${this.teamStats[0].str}  
║   DEF: ${this.teamStats[0].def}  DEX: ${this.teamStats[0].dex}  
║   FRT: ${this.teamStats[0].frt}  PWR: ${pow1.toFixed(1)}  
╠════════════════════════════════════╣
║ TEAM OMEGA: ${team2.name}                     
║ ROSTER: ${team2.roster.join(' ')}               
║   SPD: ${this.teamStats[1].spd}  STR: ${this.teamStats[1].str}  
║   DEF: ${this.teamStats[1].def}  DEX: ${this.teamStats[1].dex}  
║   FRT: ${this.teamStats[1].frt}  PWR: ${pow2.toFixed(1)}  
╠════════════════════════════════════╣
║ WIN CONDITIONS:                                
║ GACHA  → ${Math.random() < 0.5 ? team1.name : team2.name}           
║ COMBAT → ${Math.random() < 0.5 ? team1.name : team2.name}           
║ WART   → ${Math.random() < 0.5 ? team1.name : team2.name}           
╠════════════════════════════════════╣
║ VICTOR: ${winner.name}                         
║ PRIZE POOL: $1,000,000 GUARANTEED  
║ mXP CARRIES TO SEASON 2            
╚════════════════════════════════════╝`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; 
        a.download = `Moku_3v3_${Date.now()}.txt`; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.print("> REPORT GENERATED: 3V3 MAYHEM DATA");
        
        if (event && event.target) {
            const btn = event.target.closest('button');
            if (btn) {
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => btn.style.transform = 'scale(1)', 200);
            }
        }
    }

    renderScout() {
        document.getElementById('scout-body').innerHTML = this.teams.map(t => {
            
            const sleeper = t.stars < 3 && t.spd > 80;
            return `<tr class="border-b border-cyan-900/10">
                <td class="p-4 font-bold tracking-tighter">${t.captain}</td>
                <td class="p-4 text-cyan-400">${t.spd}</td>
                <td class="p-4 text-pink-500">${'★'.repeat(t.stars)}</td>
                <td class="p-4 text-right ${sleeper ? 'text-green-500 italic' : 'text-gray-600'}">${sleeper ? '🚀 SLEEPER' : 'HOLD'}</td>
            </tr>`;
        }).join('');
    }

    navigate(t) {
        document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
        document.getElementById(`${t}-section`).classList.remove('hidden');
        this.print(`> ACCESSING: ${t.toUpperCase()} SECTOR`);
    }

    initCLI() {
        document.getElementById('cli-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = e.target.value.toLowerCase().trim();
                e.target.value = '';
                
                const commands = {
                    'arena': () => this.navigate('arena'),
                    'schemes': () => this.navigate('schemes'),
                    'scout': () => this.navigate('scout'),
                    'status': () => this.print("> SEASON 1: $1M POOL • mXP CARRIES OVER"),
                    'clear': () => document.getElementById('terminal-output').innerHTML = '',
                    'help': () => {
                        this.print("> COMMANDS: arena, schemes, scout, status, clear");
                        this.print("> TIP: Select two teams, tweak stats, simulate 3v3");
                    }
                };
                
                if (commands[cmd]) {
                    commands[cmd]();
                } else {
                    this.print(`> UNKNOWN: '${cmd}' (type 'help')`);
                }
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

const app = new MokuAlphaTerminal();