class MokuTerminal {
            constructor() {
                this.mode = 'classic';
                this.lockerVisible = true;
                this.leaderboardVisible = true;
                
                this.savedMokis = JSON.parse(localStorage.getItem('mokuTerminal')) || [];
                
                this.tipIndex = 0;
                this.tips = [
                    "👋 WELCOME! Add your Moki to the locker below.",
                    "📝 Click any Moki card to use it in BATTLE or CONTEST.",
                    "⚔️ BATTLE MODE: Test 3v3 matchups with adjustable enemies.",
                    "🏆 CONTEST MODE: Build 4 Moki + 1 Scheme lineups.",
                    "🔍 MATCHUP SCOUT: See how your lineup stacks vs Champions.",
                    "📊 SYNERGY SCORE: Higher = better contest performance.",
                    "💡 Click Champions to analyze matchups against your lineup.",
                    "🎯 SCHEME RECOMMENDATIONS based on your team's highest stat.",
                    "📈 mXP ESTIMATOR: Predict earnings before entering contests.",
                    "✨ Your Moki are saved in your browser — they'll be here next time!"
                ];
                
                this.myTeam = [null, null, null];
                this.enemyStats = { spd: 50, str: 50, def: 50, dex: 50, frt: 50 };
                this.contestLineup = { 1: null, 2: null, 3: null, 4: null, scheme: null };
                this.currentPickerSlot = 1;
                
                
                this.champions = [
                    { rank: 1, name: "#1042", class: "Striker", spd: 98, str: 92, def: 88, dex: 95, frt: 85, wins: 87 },
                    { rank: 2, name: "#2357", class: "Bruiser", spd: 88, str: 99, def: 90, dex: 82, frt: 88, wins: 84 },
                    { rank: 3, name: "#3891", class: "Defender", spd: 72, str: 88, def: 99, dex: 75, frt: 94, wins: 82 },
                    { rank: 4, name: "#4562", class: "Sprinter", spd: 99, str: 78, def: 75, dex: 92, frt: 80, wins: 81 },
                    { rank: 5, name: "#5738", class: "Grinder", spd: 85, str: 88, def: 92, dex: 88, frt: 97, wins: 80 },
                    { rank: 6, name: "#6712", class: "Striker", spd: 94, str: 89, def: 82, dex: 91, frt: 83, wins: 78 },
                    { rank: 7, name: "#8902", class: "Bruiser", spd: 86, str: 96, def: 88, dex: 79, frt: 85, wins: 77 },
                    { rank: 8, name: "#9034", class: "Defender", spd: 70, str: 82, def: 97, dex: 71, frt: 92, wins: 76 },
                    { rank: 9, name: "#1123", class: "Sprinter", spd: 97, str: 75, def: 72, dex: 94, frt: 78, wins: 75 },
                    { rank: 10, name: "#2341", class: "Grinder", spd: 83, str: 85, def: 90, dex: 84, frt: 95, wins: 74 },
                    { rank: 11, name: "#3456", class: "Striker", spd: 92, str: 88, def: 80, dex: 90, frt: 81, wins: 73 },
                    { rank: 12, name: "#4567", class: "Bruiser", spd: 84, str: 94, def: 86, dex: 77, frt: 83, wins: 72 },
                    { rank: 13, name: "#5678", class: "Defender", spd: 68, str: 80, def: 96, dex: 69, frt: 90, wins: 71 },
                    { rank: 14, name: "#6789", class: "Sprinter", spd: 96, str: 73, def: 70, dex: 93, frt: 76, wins: 70 },
                    { rank: 15, name: "#7890", class: "Grinder", spd: 81, str: 83, def: 88, dex: 82, frt: 93, wins: 69 },
                    { rank: 16, name: "#8901", class: "Striker", spd: 90, str: 86, def: 78, dex: 89, frt: 79, wins: 68 },
                    { rank: 17, name: "#9012", class: "Bruiser", spd: 82, str: 92, def: 84, dex: 75, frt: 81, wins: 67 },
                    { rank: 18, name: "#0123", class: "Defender", spd: 66, str: 78, def: 95, dex: 67, frt: 88, wins: 66 },
                    { rank: 19, name: "#1234", class: "Sprinter", spd: 95, str: 71, def: 68, dex: 92, frt: 74, wins: 65 },
                    { rank: 20, name: "#2345", class: "Grinder", spd: 79, str: 81, def: 86, dex: 80, frt: 92, wins: 64 }
                ];
                
                this.schemes = [
                    { name: "TAKING A DIVE", rarity: "EPIC", effect: "+150 mXP on loss" },
                    { name: "SHADOW ARTS", rarity: "RARE", effect: "+10% Team Speed" },
                    { name: "BOUNTY HUNTER", rarity: "LEGENDARY", effect: "2x mXP vs higher rank" },
                    { name: "GLASS CANNON", rarity: "RARE", effect: "+50% STR / -50% DEF" },
                    { name: "RECYCLE BIN", rarity: "COMMON", effect: "Refund 50 Gems on loss" },
                    { name: "DATA BREACH", rarity: "EPIC", effect: "Reveal enemy stats" },
                    { name: "OVERCLOCK", rarity: "LEGENDARY", effect: "+20% All Stats" }
                ];

                this.init();
            }

            init() {
                this.renderLocker();
                this.renderChampions();
                this.initCLI();
                this.startTipRotation();
                
                document.getElementById('mode-classic').style.background = 'linear-gradient(135deg, var(--moku-purple), var(--moku-purple-light))';
                document.getElementById('mode-classic').style.color = 'white';
            }

            startTipRotation() {
                setInterval(() => this.nextTip(), 5000);
            }

            nextTip() {
                this.tipIndex = (this.tipIndex + 1) % this.tips.length;
                document.getElementById('speech-bubble').innerHTML = this.tips[this.tipIndex];
            }

            toggleLocker() {
                const content = document.getElementById('locker-content');
                this.lockerVisible = !this.lockerVisible;
                content.style.display = this.lockerVisible ? 'block' : 'none';
                document.getElementById('locker-toggle').innerHTML = 
                    `<span class="arrow">${this.lockerVisible ? '▼' : '►'}</span> ${this.lockerVisible ? 'CLOSE' : 'OPEN'}`;
            }

            toggleLeaderboard() {
                const content = document.getElementById('leaderboard-content');
                this.leaderboardVisible = !this.leaderboardVisible;
                content.style.display = this.leaderboardVisible ? 'block' : 'none';
                document.getElementById('leaderboard-toggle').innerHTML = 
                    `<span class="arrow">${this.leaderboardVisible ? '▼' : '►'}</span> ${this.leaderboardVisible ? 'CLOSE' : 'OPEN'}`;
            }

            renderLocker() {
                const container = document.getElementById('saved-mokis-container');
                if (!container) return;

                if (this.savedMokis.length === 0) {
                    container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:30px; color:#666; border:1px dashed #333; border-radius:16px;">Your locker is empty — add your Moki below ✨</div>';
                    return;
                }

                container.innerHTML = this.savedMokis.map((m, i) => `
                    <div class="moki-card">
                        <div class="flex justify-between">
                            <span style="font-weight:700; color:var(--moku-cyan);">${m.name}</span>
                            <span class="class-badge class-${this.determineClass(m).toLowerCase()}">${this.determineClass(m)}</span>
                        </div>
                        <div class="stats-grid" style="margin:8px 0;">
                            <div><span class="stat-label">SPD</span> ${m.spd}</div>
                            <div><span class="stat-label">STR</span> ${m.str}</div>
                            <div><span class="stat-label">DEF</span> ${m.def}</div>
                            <div><span class="stat-label">DEX</span> ${m.dex}</div>
                            <div><span class="stat-label">FRT</span> ${m.frt}</div>
                        </div>
                        <div style="display:flex; gap:4px;">
                            <button onclick="app.selectForBattle(${i})" class="btn-outline" style="flex:1; padding:6px;">⚔️</button>
                            <button onclick="app.selectForContest(${i})" class="btn-outline" style="flex:1; padding:6px;">🏆</button>
                            <button onclick="app.deleteMoki(${i})" class="btn-outline" style="padding:6px;">✕</button>
                        </div>
                    </div>
                `).join('');
            }

            renderChampions() {
                const container = document.getElementById('champion-grid');
                if (!container) return;
                container.innerHTML = this.champions.map(c => `
                    <div class="champion-card" onclick="app.analyzeChampionMatchup('${c.name}')">
                        <div class="champion-rank">#${c.rank}</div>
                        <div style="font-weight:700;">${c.name}</div>
                        <div class="class-badge class-${c.class.toLowerCase()}">${c.class}</div>
                    </div>
                `).join('');
            }

            determineClass(m) {
                const stats = [m.spd, m.str, m.def, m.dex, m.frt];
                const max = Math.max(...stats);
                if (m.spd === max) return 'Sprinter';
                if (m.str === max) return 'Bruiser';
                if (m.def === max) return 'Defender';
                if (m.dex === max) return 'Striker';
                if (m.frt === max) return 'Grinder';
                return 'Forward';
            }

            addMoki() {
                const name = document.getElementById('new-moki-name').value.trim().toUpperCase();
                if (!name) { this.print("> ERROR: MOKI ID required"); return; }

                const moki = {
                    name: name,
                    spd: parseInt(document.getElementById('new-moki-spd').value) || 50,
                    str: parseInt(document.getElementById('new-moki-str').value) || 50,
                    def: parseInt(document.getElementById('new-moki-def').value) || 50,
                    dex: parseInt(document.getElementById('new-moki-dex').value) || 50,
                    frt: parseInt(document.getElementById('new-moki-frt').value) || 50
                };

                this.savedMokis.push(moki);
                localStorage.setItem('mokuTerminal', JSON.stringify(this.savedMokis));
                this.renderLocker();
                this.print(`> SAVED: ${moki.name}`);

                document.getElementById('new-moki-name').value = '';
                ['spd','str','def','dex','frt'].forEach(s => 
                    document.getElementById(`new-moki-${s}`).value = 50
                );
            }

            deleteMoki(index) {
                this.savedMokis.splice(index, 1);
                localStorage.setItem('mokuTerminal', JSON.stringify(this.savedMokis));
                this.renderLocker();
                this.print("> MOKI REMOVED");
            }

            // ===== BATTLE MODE =====
            selectForBattle(index) {
                const moki = this.savedMokis[index];
                for (let i = 0; i < 3; i++) {
                    if (!this.myTeam[i]) {
                        this.myTeam[i] = moki;
                        this.updateTeamSlot(i+1, moki);
                        break;
                    }
                }
            }

            updateTeamSlot(slot, moki) {
                const slotEl = document.getElementById(`my-team-slot${slot}`);
                slotEl.innerHTML = `
                    <div style="font-weight:700;">${moki.name}</div>
                    <div style="font-size:9px;">${this.determineClass(moki)}</div>
                    <button class="cancel-btn" onclick="app.cancelTeamSlot(${slot}, event)">✕</button>
                `;
                slotEl.classList.add('filled');
            }

            cancelTeamSlot(slot, event) {
                event.stopPropagation();
                this.myTeam[slot-1] = null;
                const slotEl = document.getElementById(`my-team-slot${slot}`);
                slotEl.innerHTML = `SLOT ${slot}<button class="cancel-btn" onclick="app.cancelTeamSlot(${slot}, event)">✕</button>`;
                slotEl.classList.remove('filled');
            }

            openTeamPicker(slot) {
                this.currentPickerSlot = slot;
                const grid = document.getElementById('team-picker-grid');
                grid.innerHTML = this.savedMokis.map((m, i) => `
                    <div class="moki-card" onclick="app.selectForTeam(${i})">
                        <div style="font-weight:700;">${m.name}</div>
                        <div class="class-badge">${this.determineClass(m)}</div>
                    </div>
                `).join('');
                document.getElementById('team-picker').classList.remove('hidden');
            }

            selectForTeam(index) {
                const moki = this.savedMokis[index];
                this.myTeam[this.currentPickerSlot-1] = moki;
                this.updateTeamSlot(this.currentPickerSlot, moki);
                this.closeTeamPicker();
            }

            closeTeamPicker() {
                document.getElementById('team-picker').classList.add('hidden');
            }

            updateEnemyStat(stat, val) {
                this.enemyStats[stat] = parseInt(val);
                document.getElementById(`enemy-${stat}`).innerText = val;
            }

            run3v3Battle() {
                const filled = this.myTeam.filter(m => m).length;
                if (filled < 3) { 
                    this.print("> ERROR: Need 3 Moki in your team"); 
                    return; 
                }
                
                const resultDiv = document.getElementById('battle-result');
                resultDiv.classList.remove('hidden');
                resultDiv.innerHTML = `
                    <div style="background:#1A1A28; border-radius:16px; padding:20px; text-align:center;">
                        <div style="font-size:18px; font-weight:700; background:linear-gradient(90deg, var(--moku-purple), var(--moku-cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">⚡ CALCULATING ⚡</div>
                        <div style="display:flex; justify-content:center; gap:12px; margin-top:12px;">
                            <div style="width:12px; height:12px; background:var(--moku-purple); border-radius:50%; animation:pulse 1s infinite;"></div>
                            <div style="width:12px; height:12px; background:var(--moku-cyan); border-radius:50%; animation:pulse 1s infinite 0.2s;"></div>
                            <div style="width:12px; height:12px; background:var(--moku-pink); border-radius:50%; animation:pulse 1s infinite 0.4s;"></div>
                        </div>
                    </div>
                `;
                
                setTimeout(() => {
                    const myPower = this.myTeam.reduce((sum, m) => {
                        return sum + (m.spd * 1.5) + (m.str * 1.2) + (m.def * 1.1) + (m.dex * 0.8) + m.frt;
                    }, 0);

                    const enemyPower = 3 * (
                        (this.enemyStats.spd * 1.5) + 
                        (this.enemyStats.str * 1.2) + 
                        (this.enemyStats.def * 1.1) + 
                        (this.enemyStats.dex * 0.8) + 
                        this.enemyStats.frt
                    );

                    const total = myPower + enemyPower;
                    const myChance = (myPower / total * 100).toFixed(1);
                    const enemyChance = (enemyPower / total * 100).toFixed(1);
                    const winner = myPower > enemyPower ? 'YOUR TEAM' : 'ENEMY';
                    const winnerColor = myPower > enemyPower ? 'var(--moku-cyan)' : 'var(--moku-pink)';

                    resultDiv.innerHTML = `
                        <div style="background:#1A1A28; border-radius:16px; padding:20px; text-align:center;">
                            <div style="font-size:20px; font-weight:700; color:${winnerColor};">${winner} WINS</div>
                            <div style="display:flex; justify-content:center; gap:20px; margin-top:12px;">
                                <div><span style="color:var(--moku-cyan);">YOUR</span> ${myChance}%</div>
                                <div><span style="color:var(--moku-pink);">ENEMY</span> ${enemyChance}%</div>
                            </div>
                            <div class="progress-bar mt-2">
                                <div class="progress-fill" style="width:${myPower/total*100}%"></div>
                            </div>
                        </div>
                    `;
                    
                    this.print(`> BATTLE RESULT: ${winner} (${myPower > enemyPower ? myChance : enemyChance}%)`);
                }, 1500);
            }

            resetBattle() {
                this.myTeam = [null, null, null];
                for (let i = 1; i <= 3; i++) {
                    const slotEl = document.getElementById(`my-team-slot${i}`);
                    slotEl.innerHTML = `SLOT ${i}<button class="cancel-btn" onclick="app.cancelTeamSlot(${i}, event)">✕</button>`;
                    slotEl.classList.remove('filled');
                }
                document.getElementById('battle-result').classList.add('hidden');
                this.print("> BATTLE RESET");
            }

            // ===== CONTEST MODE =====
            selectForContest(index) {
                const moki = this.savedMokis[index];
                for (let i = 1; i <= 4; i++) {
                    if (!this.contestLineup[i]) {
                        this.contestLineup[i] = moki;
                        this.updateContestSlot(i, moki);
                        this.updateSynergy();
                        break;
                    }
                }
            }

            updateContestSlot(slot, moki) {
                const slotEl = document.getElementById(`contest-slot${slot}`);
                slotEl.innerHTML = `
                    <div style="font-weight:700;">${moki.name}</div>
                    <div style="font-size:9px;">${this.determineClass(moki)}</div>
                    <button class="cancel-btn" onclick="app.cancelContestSlot(${slot}, event)">✕</button>
                `;
                slotEl.classList.add('filled');
            }

            cancelContestSlot(slot, event) {
                event.stopPropagation();
                this.contestLineup[slot] = null;
                const slotEl = document.getElementById(`contest-slot${slot}`);
                slotEl.innerHTML = `MOKI ${slot}<button class="cancel-btn" onclick="app.cancelContestSlot(${slot}, event)">✕</button>`;
                slotEl.classList.remove('filled');
                this.updateSynergy();
            }

            cancelScheme(event) {
                event.stopPropagation();
                this.contestLineup.scheme = null;
                const slotEl = document.getElementById('contest-slot-scheme');
                slotEl.innerHTML = 'SCHEME<button class="cancel-btn" onclick="app.cancelScheme(event)">✕</button>';
                slotEl.classList.remove('filled');
                this.updateSynergy();
            }

            openContestPicker(slot) {
                this.currentPickerSlot = slot;
                const grid = document.getElementById('contest-picker-grid');
                grid.innerHTML = this.savedMokis.map((m, i) => `
                    <div class="moki-card" onclick="app.selectForContestSlot(${i})">
                        <div style="font-weight:700;">${m.name}</div>
                        <div class="class-badge">${this.determineClass(m)}</div>
                    </div>
                `).join('');
                document.getElementById('contest-picker').classList.remove('hidden');
            }

            selectForContestSlot(index) {
                const moki = this.savedMokis[index];
                this.contestLineup[this.currentPickerSlot] = moki;
                this.updateContestSlot(this.currentPickerSlot, moki);
                this.closeContestPicker();
                this.updateSynergy();
            }

            closeContestPicker() {
                document.getElementById('contest-picker').classList.add('hidden');
            }

            openSchemePicker() {
                const grid = document.getElementById('scheme-picker-grid');
                grid.innerHTML = this.schemes.map((s, i) => `
                    <div class="moki-card" onclick="app.selectScheme(${i})">
                        <div style="font-weight:700; color:var(--moku-gold);">${s.name}</div>
                        <div style="font-size:11px;">${s.effect}</div>
                    </div>
                `).join('');
                document.getElementById('scheme-picker').classList.remove('hidden');
            }

            selectScheme(index) {
                const scheme = this.schemes[index];
                this.contestLineup.scheme = scheme;
                const slotEl = document.getElementById('contest-slot-scheme');
                slotEl.innerHTML = `
                    <div style="font-weight:700; color:var(--moku-gold);">${scheme.name}</div>
                    <button class="cancel-btn" onclick="app.cancelScheme(event)">✕</button>
                `;
                slotEl.classList.add('filled');
                this.closeSchemePicker();
                this.updateSynergy();
            }

            closeSchemePicker() {
                document.getElementById('scheme-picker').classList.add('hidden');
            }

            updateSynergy() {
                const mokis = [this.contestLineup[1], this.contestLineup[2], this.contestLineup[3], this.contestLineup[4]].filter(m => m);
                
                if (mokis.length < 4) {
                    document.getElementById('synergy-value').innerText = '0%';
                    document.getElementById('synergy-bar').style.width = '0%';
                    document.getElementById('synergy-desc').innerText = `Add ${4-mokis.length} more Moki`;
                    document.getElementById('rec-scheme').innerText = '—';
                    document.getElementById('est-mxp').innerText = '0';
                    document.getElementById('est-rank').innerText = '—';
                    return;
                }

                const classes = new Set(mokis.map(m => this.determineClass(m))).size;
                const classScore = (classes / 5) * 70;
                
                const avgSpd = mokis.reduce((a, m) => a + m.spd, 0) / 4;
                const avgStr = mokis.reduce((a, m) => a + m.str, 0) / 4;
                const avgDef = mokis.reduce((a, m) => a + m.def, 0) / 4;
                const avgDex = mokis.reduce((a, m) => a + m.dex, 0) / 4;
                const avgFrt = mokis.reduce((a, m) => a + m.frt, 0) / 4;
                
                const statBalance = 30 - (Math.abs(avgSpd - 50) + Math.abs(avgStr - 50) + Math.abs(avgDef - 50) + Math.abs(avgDex - 50) + Math.abs(avgFrt - 50)) / 10;
                
                let synergy = classScore + Math.max(0, statBalance);
                synergy = Math.min(100, synergy);
                
                document.getElementById('synergy-value').innerText = Math.round(synergy) + '%';
                document.getElementById('synergy-bar').style.width = synergy + '%';
                document.getElementById('synergy-desc').innerText = synergy > 70 ? '🔥 Excellent!' : '✅ Good';
                
                const avgs = [avgSpd, avgStr, avgDef, avgDex, avgFrt];
                const maxIdx = avgs.indexOf(Math.max(...avgs));
                
                const schemeMap = {
                    0: 'SHADOW ARTS', 1: 'GLASS CANNON', 2: 'RECYCLE BIN', 
                    3: 'DATA BREACH', 4: 'OVERCLOCK'
                };
                document.getElementById('rec-scheme').innerText = schemeMap[maxIdx] || 'OVERCLOCK';
                
                const mxp = Math.round(800 + (synergy * 10));
                document.getElementById('est-mxp').innerText = mxp;
                
                if (mxp > 2000) document.getElementById('est-rank').innerText = 'TOP 10%';
                else if (mxp > 1500) document.getElementById('est-rank').innerText = 'TOP 25%';
                else if (mxp > 1000) document.getElementById('est-rank').innerText = 'TOP 50%';
                else document.getElementById('est-rank').innerText = 'BOTTOM 50%';
                
                this.analyzeMatchups();
            }

            analyzeMatchups() {
                const mokis = [this.contestLineup[1], this.contestLineup[2], this.contestLineup[3], this.contestLineup[4]].filter(m => m);
                if (mokis.length < 4) {
                    document.getElementById('matchup-analysis').innerHTML = 'Need 4 Moki to analyze';
                    return;
                }
                document.getElementById('matchup-analysis').innerHTML = '✅ Matchup analysis complete';
                this.print("> MATCHUP ANALYSIS COMPLETE");
            }

            analyzeLineup() {
                this.updateSynergy();
                this.analyzeMatchups();
                this.print("> LINEUP ANALYSIS COMPLETE");
            }

            resetContest() {
                for (let i = 1; i <= 4; i++) {
                    this.contestLineup[i] = null;
                    const slotEl = document.getElementById(`contest-slot${i}`);
                    slotEl.innerHTML = `MOKI ${i}<button class="cancel-btn" onclick="app.cancelContestSlot(${i}, event)">✕</button>`;
                    slotEl.classList.remove('filled');
                }
                this.contestLineup.scheme = null;
                const schemeSlot = document.getElementById('contest-slot-scheme');
                schemeSlot.innerHTML = 'SCHEME<button class="cancel-btn" onclick="app.cancelScheme(event)">✕</button>';
                schemeSlot.classList.remove('filled');
                this.updateSynergy();
                this.print("> CONTEST RESET");
            }

            analyzeChampionMatchup(name) {
                this.print(`> ANALYZING: ${name}`);
            }

            setMode(mode) {
                this.mode = mode;
                const classic = document.getElementById('mode-classic');
                const contest = document.getElementById('mode-contest');
                
                if (mode === 'classic') {
                    classic.style.background = 'linear-gradient(135deg, var(--moku-purple), var(--moku-purple-light))';
                    classic.style.color = 'white';
                    contest.style.background = 'transparent';
                    contest.style.color = '#888';
                    document.getElementById('classic-mode').classList.remove('hidden');
                    document.getElementById('contest-mode').classList.add('hidden');
                } else {
                    contest.style.background = 'linear-gradient(135deg, var(--moku-purple), var(--moku-purple-light))';
                    contest.style.color = 'white';
                    classic.style.background = 'transparent';
                    classic.style.color = '#888';
                    document.getElementById('contest-mode').classList.remove('hidden');
                    document.getElementById('classic-mode').classList.add('hidden');
                }
            }

            initCLI() {
                document.getElementById('cli-input').addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const cmd = e.target.value.toLowerCase().trim();
                        e.target.value = '';
                        
                        const cmds = {
                            'classic': () => this.setMode('classic'),
                            'contest': () => this.setMode('contest'),
                            'locker': () => this.toggleLocker(),
                            'leaderboard': () => this.toggleLeaderboard(),
                            'tip': () => this.nextTip(),
                            'status': () => this.print("> SEASON 1: $1M POOL"),
                            'clear': () => document.getElementById('terminal-output').innerHTML = '',
                            'help': () => {
                                this.print("> COMMANDS: classic, contest, locker, leaderboard, tip, status, clear");
                                this.print("> Add Moki → Build lineup → Analyze");
                            }
                        };
                        
                        cmds[cmd] ? cmds[cmd]() : this.print(`> UNKNOWN: ${cmd}`);
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
        }

        const app = new MokuTerminal();