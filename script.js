class MokuTerminal {
            constructor() {
                this.mode = 'classic';
                this.lockerVisible = true;
                this.leaderboardVisible = true;
                this.savedMokis = JSON.parse(localStorage.getItem('mokuTerminal')) || this.getDefaultMokis();
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
                    "✨ Mock data labeled in pink — API-ready!"
                ];
                
                // Battle mode
                this.myTeam = [null, null, null];
                this.enemyStats = { spd: 50, str: 50, def: 50, dex: 50, frt: 50 };
                
                // Contest mode
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
                    { name: "TAKING A DIVE", rarity: "EPIC", effect: "+150 mXP on loss", desc: "Farm mXP when win rate <30%" },
                    { name: "SHADOW ARTS", rarity: "RARE", effect: "+10% Team Speed", desc: "Best for high SPD teams" },
                    { name: "BOUNTY HUNTER", rarity: "LEGENDARY", effect: "2x mXP vs higher rank", desc: "Target stronger opponents" },
                    { name: "GLASS CANNON", rarity: "RARE", effect: "+50% STR / -50% DEF", desc: "All-in combat strategy" },
                    { name: "RECYCLE BIN", rarity: "COMMON", effect: "Refund 50 Gems on loss", desc: "Budget farming" },
                    { name: "DATA BREACH", rarity: "EPIC", effect: "Reveal enemy stats", desc: "Counter sleepers" },
                    { name: "OVERCLOCK", rarity: "LEGENDARY", effect: "+20% All Stats", desc: "Ultimate multiplier" }
                ];

                this.init();
            }

            getDefaultMokis() {
                return [
                    { name: "#1042", spd: 95, str: 88, def: 70, dex: 65, frt: 80 },
                    { name: "#2357", spd: 88, str: 60, def: 75, dex: 90, frt: 70 },
                    { name: "#3891", spd: 40, str: 90, def: 85, dex: 45, frt: 95 },
                    { name: "#4562", spd: 92, str: 75, def: 80, dex: 70, frt: 60 },
                    { name: "#5738", spd: 85, str: 98, def: 50, dex: 95, frt: 88 }
                ];
            }

            init() {
                this.renderLocker();
                this.renderChampions();
                this.initCLI();
                this.startTipRotation();
                this.print("> MOKU TERMINAL");
                this.print("> TYPE 'help' FOR COMMANDS");
                this.print("> Click the tanuki for helpful tips!");
                
                document.getElementById('mode-classic').style.background = 'linear-gradient(135deg, var(--moku-purple), var(--moku-purple-light))';
                document.getElementById('mode-classic').style.color = 'white';
            }

            startTipRotation() {
                setInterval(() => {
                    this.nextTip();
                }, 5000);
            }

            nextTip() {
                this.tipIndex = (this.tipIndex + 1) % this.tips.length;
                document.getElementById('speech-bubble').innerHTML = this.tips[this.tipIndex];
                
                const bubble = document.getElementById('speech-bubble');
                bubble.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    bubble.style.transform = 'scale(1)';
                }, 200);
            }

            toggleLocker() {
                const content = document.getElementById('locker-content');
                const btn = document.getElementById('locker-toggle');
                
                this.lockerVisible = !this.lockerVisible;
                
                if (this.lockerVisible) {
                    content.classList.remove('collapsed');
                    btn.innerHTML = '<span class="arrow">▼</span> CLOSE LOCKER';
                } else {
                    content.classList.add('collapsed');
                    btn.innerHTML = '<span class="arrow">►</span> OPEN LOCKER';
                }
            }

            toggleLeaderboard() {
                const content = document.getElementById('leaderboard-content');
                const btn = document.getElementById('leaderboard-toggle');
                
                this.leaderboardVisible = !this.leaderboardVisible;
                
                if (this.leaderboardVisible) {
                    content.classList.remove('collapsed');
                    btn.innerHTML = '<span class="arrow">▼</span> CLOSE LEADERBOARD';
                } else {
                    content.classList.add('collapsed');
                    btn.innerHTML = '<span class="arrow">►</span> OPEN LEADERBOARD';
                }
            }

            renderLocker() {
                const container = document.getElementById('saved-mokis-container');
                if (!container) return;

                if (this.savedMokis.length === 0) {
                    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666; border: 1px dashed #333; border-radius: 20px;">Add your Moki below</div>';
                    return;
                }

                container.innerHTML = this.savedMokis.map((m, i) => {
                    const mokiClass = this.determineClass(m);
                    return `
                        <div class="moki-card glow-hover">
                            <div style="display: flex; justify-content: space-between; align-items: start;">
                                <span style="font-size: 20px; font-weight: 700; color: var(--moku-cyan);">${m.name}</span>
                                <span class="class-badge class-${mokiClass.toLowerCase()}">${mokiClass}</span>
                            </div>
                            <div class="stats-grid" style="margin: 16px 0 12px;">
                                <div class="stat-item"><div class="stat-label">SPD</div><div class="stat-value">${m.spd}</div></div>
                                <div class="stat-item"><div class="stat-label">STR</div><div class="stat-value">${m.str}</div></div>
                                <div class="stat-item"><div class="stat-label">DEF</div><div class="stat-value">${m.def}</div></div>
                                <div class="stat-item"><div class="stat-label">DEX</div><div class="stat-value">${m.dex}</div></div>
                                <div class="stat-item"><div class="stat-label">FRT</div><div class="stat-value">${m.frt}</div></div>
                            </div>
                            <div style="display: flex; gap: 8px; margin-top: 12px;">
                                <button onclick="app.selectForBattle(${i})" class="btn-outline" style="flex:1; padding: 10px; font-size: 13px;">⚔️ BATTLE</button>
                                <button onclick="app.selectForContest(${i})" class="btn-outline" style="flex:1; padding: 10px; font-size: 13px;">🏆 CONTEST</button>
                                <button onclick="app.deleteMoki(${i})" class="btn-outline" style="padding: 10px; font-size: 13px; color: #F44336;">✕</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            renderChampions() {
                const container = document.getElementById('champion-grid');
                if (!container) return;

                container.innerHTML = this.champions.slice(0, 20).map(c => {
                    const winRate = c.wins;
                    const trend = winRate > 75 ? 'up' : winRate > 65 ? 'stable' : 'down';
                    return `
                        <div class="champion-card" onclick="app.analyzeChampionMatchup('${c.name}')">
                            <div style="display: flex; justify-content: space-between;">
                                <span class="champion-rank">#${c.rank}</span>
                                <span style="color: ${trend === 'up' ? '#4CAF50' : trend === 'down' ? '#F44336' : '#FFD700'};">
                                    ${trend === 'up' ? '▲' : trend === 'down' ? '▼' : '◆'}
                                </span>
                            </div>
                            <div style="font-size: 18px; font-weight: 700; margin: 8px 0;">${c.name}</div>
                            <div class="class-badge class-${c.class.toLowerCase()}">${c.class}</div>
                            <div style="margin-top: 12px; font-size: 12px; color: #888;">
                                <div>SPD ${c.spd} | STR ${c.str}</div>
                                <div>DEF ${c.def} | DEX ${c.dex} | FRT ${c.frt}</div>
                            </div>
                        </div>
                    `;
                }).join('');
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

            selectForBattle(index) {
                const moki = this.savedMokis[index];
                for (let i = 0; i < 3; i++) {
                    if (!this.myTeam[i]) {
                        this.myTeam[i] = moki;
                        this.updateTeamSlot(i+1);
                        break;
                    }
                }
            }

            updateTeamSlot(slot) {
                const moki = this.myTeam[slot-1];
                const slotEl = document.getElementById(`my-team-slot${slot}`);
                const contentDiv = slotEl.querySelector('.slot-content');
                
                if (moki) {
                    contentDiv.innerHTML = `
                        <div style="font-weight: 700; color: var(--moku-cyan);">${moki.name}</div>
                        <div style="font-size: 12px; color: #888; margin-top: 4px;">${this.determineClass(moki)}</div>
                    `;
                    slotEl.classList.add('filled');
                } else {
                    contentDiv.innerHTML = `SLOT ${slot}`;
                    slotEl.classList.remove('filled');
                }
                this.updateTeamPower();
            }

            cancelTeamSlot(slot, event) {
                event.stopPropagation();
                this.myTeam[slot-1] = null;
                this.updateTeamSlot(slot);
                this.print(`> SLOT ${slot} cleared`);
            }

            openTeamPicker(slot) {
                this.currentPickerSlot = slot;
                const grid = document.getElementById('team-picker-grid');
                grid.innerHTML = this.savedMokis.map((m, i) => `
                    <div class="moki-card" onclick="app.selectForTeam(${i})">
                        <div style="font-weight: 700; color: var(--moku-cyan);">${m.name}</div>
                        <div class="class-badge class-${this.determineClass(m).toLowerCase()}" style="margin-top: 8px;">${this.determineClass(m)}</div>
                    </div>
                `).join('');
                document.getElementById('team-picker').classList.remove('hidden');
            }

            selectForTeam(index) {
                const moki = this.savedMokis[index];
                this.myTeam[this.currentPickerSlot - 1] = moki;
                this.updateTeamSlot(this.currentPickerSlot);
                this.closeTeamPicker();
            }

            closeTeamPicker() {
                document.getElementById('team-picker').classList.add('hidden');
            }

            updateEnemyStat(stat, val) {
                this.enemyStats[stat] = parseInt(val);
                document.getElementById(`enemy-${stat}`).innerText = val;
            }

            updateTeamPower() {
                const filled = this.myTeam.filter(m => m).length;
                const powerEl = document.getElementById('my-team-power');
                if (filled === 3) {
                    const power = this.myTeam.reduce((sum, m) => {
                        return sum + (m.spd * 1.5) + (m.str * 1.2) + (m.def * 1.1) + (m.dex * 0.8) + m.frt;
                    }, 0);
                    powerEl.innerHTML = `✅ TEAM POWER: <span style="color: var(--moku-cyan); font-weight: 700;">${Math.round(power)}</span>`;
                } else {
                    powerEl.innerHTML = `⏳ Select ${3-filled} more Moki`;
                }
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
                    <div style="background: #1A1A28; border-radius: 24px; padding: 40px; text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; background: linear-gradient(90deg, var(--moku-purple), var(--moku-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px;">⚡ CALCULATING BATTLE ⚡</div>
                        <div style="display: flex; justify-content: center; gap: 20px;">
                            <div style="width: 16px; height: 16px; background: var(--moku-purple); border-radius: 50%; animation: pulse 1s infinite;"></div>
                            <div style="width: 16px; height: 16px; background: var(--moku-cyan); border-radius: 50%; animation: pulse 1s infinite 0.2s;"></div>
                            <div style="width: 16px; height: 16px; background: var(--moku-pink); border-radius: 50%; animation: pulse 1s infinite 0.4s;"></div>
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
                    const winner = myPower > enemyPower ? 'YOUR TEAM' : 'ENEMY TEAM';
                    const winnerColor = myPower > enemyPower ? 'var(--moku-cyan)' : 'var(--moku-pink)';

                    resultDiv.innerHTML = `
                        <div style="background: #1A1A28; border-radius: 24px; padding: 32px;">
                            <div style="font-size: 28px; font-weight: 800; text-align: center; margin-bottom: 24px; color: ${winnerColor};">${winner} WINS</div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; text-align: center; margin-bottom: 24px;">
                                <div>
                                    <div style="font-size: 16px; color: #888;">YOUR TEAM</div>
                                    <div style="font-size: 42px; font-weight: 800; color: var(--moku-cyan);">${myChance}%</div>
                                </div>
                                <div>
                                    <div style="font-size: 16px; color: #888;">ENEMY</div>
                                    <div style="font-size: 42px; font-weight: 800; color: var(--moku-pink);">${enemyChance}%</div>
                                </div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${myPower/(myPower+enemyPower)*100}%"></div>
                            </div>
                        </div>
                    `;

                    this.print(`> BATTLE RESULT: ${winner} (${myPower > enemyPower ? myChance : enemyChance}%)`);
                }, 2000);
            }

            resetBattle() {
                this.myTeam = [null, null, null];
                for (let i = 1; i <= 3; i++) this.updateTeamSlot(i);
                document.getElementById('battle-result').classList.add('hidden');
                this.print("> BATTLE RESET");
            }

            // CONTEST MODE 
            selectForContest(index) {
                const moki = this.savedMokis[index];
                for (let i = 1; i <= 4; i++) {
                    if (!this.contestLineup[i]) {
                        this.contestLineup[i] = moki;
                        this.updateContestSlot(i);
                        this.updateSynergy();
                        break;
                    }
                }
            }

            updateContestSlot(slot) {
                const moki = this.contestLineup[slot];
                const slotEl = document.getElementById(`contest-slot${slot}`);
                const contentDiv = slotEl.querySelector('.slot-content');
                
                if (moki) {
                    contentDiv.innerHTML = `
                        <div style="font-weight: 700; color: var(--moku-cyan);">${moki.name}</div>
                        <div style="font-size: 12px; color: #888; margin-top: 4px;">${this.determineClass(moki)}</div>
                    `;
                    slotEl.classList.add('filled');
                } else {
                    contentDiv.innerHTML = `MOKI ${slot}`;
                    slotEl.classList.remove('filled');
                }
            }

            cancelContestSlot(slot, event) {
                event.stopPropagation();
                this.contestLineup[slot] = null;
                this.updateContestSlot(slot);
                this.updateSynergy();
                this.print(`> SLOT ${slot} cleared`);
            }

            cancelScheme(event) {
                event.stopPropagation();
                this.contestLineup.scheme = null;
                const slotEl = document.getElementById('contest-slot-scheme');
                slotEl.querySelector('.slot-content').innerHTML = 'SCHEME';
                slotEl.classList.remove('filled');
                this.updateSynergy();
                this.print("> SCHEME CLEARED");
            }

            openContestPicker(slot) {
                this.currentPickerSlot = slot;
                const grid = document.getElementById('contest-picker-grid');
                grid.innerHTML = this.savedMokis.map((m, i) => `
                    <div class="moki-card" onclick="app.selectForContestSlot(${i})">
                        <div style="font-weight: 700; color: var(--moku-cyan);">${m.name}</div>
                        <div class="class-badge class-${this.determineClass(m).toLowerCase()}" style="margin-top: 8px;">${this.determineClass(m)}</div>
                    </div>
                `).join('');
                document.getElementById('contest-picker').classList.remove('hidden');
            }

            selectForContestSlot(index) {
                const moki = this.savedMokis[index];
                this.contestLineup[this.currentPickerSlot] = moki;
                this.updateContestSlot(this.currentPickerSlot);
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
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-weight: 700; color: var(--moku-gold);">${s.name}</span>
                            <span style="font-size: 12px; color: var(--moku-pink);">${s.rarity}</span>
                        </div>
                        <div style="font-size: 13px; color: #888; margin-top: 8px;">${s.effect}</div>
                    </div>
                `).join('');
                document.getElementById('scheme-picker').classList.remove('hidden');
            }

            selectScheme(index) {
                const scheme = this.schemes[index];
                this.contestLineup.scheme = scheme;
                const slotEl = document.getElementById('contest-slot-scheme');
                slotEl.querySelector('.slot-content').innerHTML = `
                    <div style="font-weight: 700; color: var(--moku-gold);">${scheme.name}</div>
                    <div style="font-size: 12px; color: #888; margin-top: 4px;">${scheme.rarity}</div>
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
                    document.getElementById('synergy-desc').innerText = `Add ${4 - mokis.length} more Moki to see synergy`;
                    document.getElementById('rec-scheme').innerText = '—';
                    document.getElementById('rec-reason').innerText = '';
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
                
                if (synergy > 80) document.getElementById('synergy-desc').innerText = '🔥 EXCELLENT! Your team has perfect class balance';
                else if (synergy > 60) document.getElementById('synergy-desc').innerText = '✅ GOOD synergy. Consider more class variety.';
                else document.getElementById('synergy-desc').innerText = '⚠️ LOW synergy. Try mixing different Moki classes.';
                
                const avgs = [avgSpd, avgStr, avgDef, avgDex, avgFrt];
                const maxAvg = Math.max(...avgs);
                const maxIdx = avgs.indexOf(maxAvg);
                
                const schemeMap = {
                    0: { name: 'SHADOW ARTS', reason: 'Your team has high SPD. Use SHADOW ARTS for +10% Speed.' },
                    1: { name: 'GLASS CANNON', reason: 'Your team has high STR. Use GLASS CANNON for +50% Strength.' },
                    2: { name: 'RECYCLE BIN', reason: 'Your team has high DEF. Use RECYCLE BIN for defensive farming.' },
                    3: { name: 'DATA BREACH', reason: 'Your team has high DEX. Use DATA BREACH to reveal enemy stats.' },
                    4: { name: 'OVERCLOCK', reason: 'Your team is balanced. Use OVERCLOCK for +20% all stats.' }
                };
                
                const rec = schemeMap[maxIdx];
                document.getElementById('rec-scheme').innerText = rec.name;
                document.getElementById('rec-reason').innerText = rec.reason;
                
                const mxp = Math.round(800 + (synergy * 10) + (avgSpd * 3));
                document.getElementById('est-mxp').innerText = mxp;
                
                if (mxp > 2000) document.getElementById('est-rank').innerText = 'TOP 10%';
                else if (mxp > 1500) document.getElementById('est-rank').innerText = 'TOP 25%';
                else if (mxp > 1000) document.getElementById('est-rank').innerText = 'TOP 50%';
                else document.getElementById('est-rank').innerText = 'BOTTOM 50%';
                
                this.analyzeMatchups();
            }

            analyzeLineup() {
                const mokis = [this.contestLineup[1], this.contestLineup[2], this.contestLineup[3], this.contestLineup[4]].filter(m => m);
                if (mokis.length < 4) {
                    this.print("> ERROR: Need 4 Moki to analyze");
                    return;
                }
                this.updateSynergy();
                this.print("> LINEUP ANALYSIS COMPLETE (synergy + matchups updated)");
                
                
                this.tipIndex = 6; // Matchup tip
                document.getElementById('speech-bubble').innerHTML = this.tips[6];
            }

            resetContest() {
                for (let i = 1; i <= 4; i++) {
                    this.contestLineup[i] = null;
                    this.updateContestSlot(i);
                }
                this.contestLineup.scheme = null;
                const schemeSlot = document.getElementById('contest-slot-scheme');
                schemeSlot.querySelector('.slot-content').innerHTML = 'SCHEME';
                schemeSlot.classList.remove('filled');
                this.updateSynergy();
                document.getElementById('matchup-analysis').innerHTML = '<div style="color: #888; text-align: center; padding: 20px;">Select 4 Moki to see how your FULL lineup matches up against Top Champions</div>';
                this.print("> CONTEST RESET");
            }

            analyzeMatchups() {
                const mokis = [this.contestLineup[1], this.contestLineup[2], this.contestLineup[3], this.contestLineup[4]].filter(m => m);
                
                if (mokis.length < 4) {
                    document.getElementById('matchup-analysis').innerHTML = '<div style="color: #888; text-align: center; padding: 20px;">Select 4 Moki to see how your FULL lineup matches up against Top Champions</div>';
                    return;
                }

                const userClasses = mokis.map(m => this.determineClass(m));
                const topChamps = this.champions.slice(0, 5);
                
                let analysisHTML = '<div style="margin-bottom: 16px;"><span style="font-weight: 700; font-size: 16px;">YOUR FULL LINEUP VS TOP 5 CHAMPIONS</span></div>';
                analysisHTML += '<div style="font-size: 13px; color: #AAA; margin-bottom: 16px;">Comparing ALL 4 of your Moki against each Champion:</div>';
                
                topChamps.forEach(champ => {
                    let goodMatchups = 0;
                    let badMatchups = 0;
                    
                    userClasses.forEach(userClass => {
                        if (
                            (champ.class === 'Striker' && userClass === 'Defender') ||
                            (champ.class === 'Defender' && userClass === 'Bruiser') ||
                            (champ.class === 'Bruiser' && userClass === 'Sprinter') ||
                            (champ.class === 'Sprinter' && userClass === 'Grinder') ||
                            (champ.class === 'Grinder' && userClass === 'Striker')
                        ) {
                            goodMatchups++;
                        } else if (
                            (champ.class === 'Striker' && userClass === 'Sprinter') ||
                            (champ.class === 'Defender' && userClass === 'Grinder') ||
                            (champ.class === 'Bruiser' && userClass === 'Striker') ||
                            (champ.class === 'Sprinter' && userClass === 'Defender') ||
                            (champ.class === 'Grinder' && userClass === 'Bruiser')
                        ) {
                            badMatchups++;
                        }
                    });
                    
                    const matchupScore = goodMatchups - badMatchups;
                    let matchupText, matchupColor;
                    
                    if (matchupScore >= 2) {
                        matchupText = '👍 STRONG ADVANTAGE';
                        matchupColor = '#4CAF50';
                    } else if (matchupScore >= 1) {
                        matchupText = '👍 SLIGHT ADVANTAGE';
                        matchupColor = '#8BC34A';
                    } else if (matchupScore <= -2) {
                        matchupText = '👎 STRONG DISADVANTAGE';
                        matchupColor = '#F44336';
                    } else if (matchupScore <= -1) {
                        matchupText = '👎 SLIGHT DISADVANTAGE';
                        matchupColor = '#FF9800';
                    } else {
                        matchupText = '⚖️ EVEN';
                        matchupColor = '#FFD700';
                    }
                    
                    analysisHTML += `
                        <div style="background: #1A1A28; border-radius: 20px; padding: 20px; margin-bottom: 16px; border-left: 4px solid ${matchupColor};">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <div>
                                    <span style="font-weight: 700; font-size: 18px;">#${champ.rank} ${champ.name}</span>
                                    <span class="class-badge class-${champ.class.toLowerCase()}" style="margin-left: 12px;">${champ.class}</span>
                                </div>
                                <span style="font-weight: 600; color: ${matchupColor};">${matchupText}</span>
                            </div>
                            <div style="display: flex; gap: 16px; font-size: 14px; color: #AAA;">
                                <span>✅ ${goodMatchups} of your Moki counter this Champion</span>
                                <span>❌ ${badMatchups} of your Moki are countered</span>
                            </div>
                            <div style="margin-top: 8px; font-size: 13px; color: #888;">
                                ${goodMatchups > badMatchups ? 
                                    'Your lineup has class advantage overall.' : 
                                    badMatchups > goodMatchups ? 
                                    'This Champion counters multiple Moki in your lineup.' : 
                                    'Balanced matchup.'}
                            </div>
                        </div>
                    `;
                });
                
                analysisHTML += `
                    <div style="margin-top: 16px; font-size: 13px; color: #666; font-style: italic;">
                        💡 Green = your FULL lineup has class advantage. Red = this Champion counters multiple Moki in your lineup.
                    </div>
                `;
                
                document.getElementById('matchup-analysis').innerHTML = analysisHTML;
                this.print("> MATCHUP ANALYSIS COMPLETE (based on all 4 Moki)");
            }

            analyzeChampionMatchup(championName) {
                const mokis = [this.contestLineup[1], this.contestLineup[2], this.contestLineup[3], this.contestLineup[4]].filter(m => m);
                
                if (mokis.length < 4) {
                    this.print(`> Select 4 Moki first to analyze vs ${championName}`);
                    return;
                }
                
                this.print(`> ANALYZING: ${championName} vs your FULL lineup`);
                document.getElementById('matchup-analysis').scrollIntoView({ behavior: 'smooth' });
                
                this.analyzeMatchups();
            }

            setMode(mode) {
                this.mode = mode;
                
                const classicBtn = document.getElementById('mode-classic');
                const contestBtn = document.getElementById('mode-contest');
                
                if (mode === 'classic') {
                    classicBtn.style.background = 'linear-gradient(135deg, var(--moku-purple), var(--moku-purple-light))';
                    classicBtn.style.color = 'white';
                    contestBtn.style.background = 'transparent';
                    contestBtn.style.color = '#888';
                    document.getElementById('classic-mode').classList.remove('hidden');
                    document.getElementById('contest-mode').classList.add('hidden');
                    
                    this.tipIndex = 2;
                    document.getElementById('speech-bubble').innerHTML = this.tips[2];
                } else {
                    contestBtn.style.background = 'linear-gradient(135deg, var(--moku-purple), var(--moku-purple-light))';
                    contestBtn.style.color = 'white';
                    classicBtn.style.background = 'transparent';
                    classicBtn.style.color = '#888';
                    document.getElementById('contest-mode').classList.remove('hidden');
                    document.getElementById('classic-mode').classList.add('hidden');
                    
                    this.tipIndex = 3;
                    document.getElementById('speech-bubble').innerHTML = this.tips[3];
                }
                
                this.print(`> MODE: ${mode.toUpperCase()}`);
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
                                this.print("> FEATURES: Add Moki → Build lineup → Analyze matchups");
                                this.print("> MOCK DATA: Leaderboard and mXP, are placeholders");
                                this.print("> Click the tanuki for tips!");
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