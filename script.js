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
                    "🔍 MATCHUP SCOUT: See how your lineup stacks vs Champions and get synergy advice.",
                    "📊 SYNERGY SCORE: Higher = better contest performance.",
                    "💡 Bruisers don't pair well with other Bruisers — mix classes for better synergy!",
                    "🎯 SCHEME RECOMMENDATIONS based on your team's highest stat.",
                    "📈 mXP ESTIMATOR: Predict earnings before entering contests.",
                    "✨ Your Moki are saved in your browser, they'll be here next time!"
                ];
                
                this.myTeam = [null, null, null];
                this.enemyStats = { spd: 50, str: 50, def: 50, dex: 50, frt: 50 };
                this.contestLineup = { 1: null, 2: null, 3: null, 4: null, scheme: null };
                this.currentPickerSlot = 1;
                this.currentPickerType = null; // 'team', 'contest', 'scheme'
                
               
                this.champions = [
                    { rank: 1, name: "#1042", class: "Striker", spd: 98, str: 92, def: 88, dex: 95, frt: 85 },
                    { rank: 2, name: "#2357", class: "Bruiser", spd: 88, str: 99, def: 90, dex: 82, frt: 88 },
                    { rank: 3, name: "#3891", class: "Defender", spd: 72, str: 88, def: 99, dex: 75, frt: 94 },
                    { rank: 4, name: "#4562", class: "Sprinter", spd: 99, str: 78, def: 75, dex: 92, frt: 80 },
                    { rank: 5, name: "#5738", class: "Grinder", spd: 85, str: 88, def: 92, dex: 88, frt: 97 },
                    { rank: 6, name: "#6712", class: "Striker", spd: 94, str: 89, def: 82, dex: 91, frt: 83 },
                    { rank: 7, name: "#8902", class: "Bruiser", spd: 86, str: 96, def: 88, dex: 79, frt: 85 },
                    { rank: 8, name: "#9034", class: "Defender", spd: 70, str: 82, def: 97, dex: 71, frt: 92 },
                    { rank: 9, name: "#1123", class: "Sprinter", spd: 97, str: 75, def: 72, dex: 94, frt: 78 },
                    { rank: 10, name: "#2341", class: "Grinder", spd: 83, str: 85, def: 90, dex: 84, frt: 95 },
                    { rank: 11, name: "#3456", class: "Striker", spd: 92, str: 88, def: 80, dex: 90, frt: 81 },
                    { rank: 12, name: "#4567", class: "Bruiser", spd: 84, str: 94, def: 86, dex: 77, frt: 83 },
                    { rank: 13, name: "#5678", class: "Defender", spd: 68, str: 80, def: 96, dex: 69, frt: 90 },
                    { rank: 14, name: "#6789", class: "Sprinter", spd: 96, str: 73, def: 70, dex: 93, frt: 76 },
                    { rank: 15, name: "#7890", class: "Grinder", spd: 81, str: 83, def: 88, dex: 82, frt: 93 },
                    { rank: 16, name: "#8901", class: "Striker", spd: 90, str: 86, def: 78, dex: 89, frt: 79 },
                    { rank: 17, name: "#9012", class: "Bruiser", spd: 82, str: 92, def: 84, dex: 75, frt: 81 },
                    { rank: 18, name: "#0123", class: "Defender", spd: 66, str: 78, def: 95, dex: 67, frt: 88 },
                    { rank: 19, name: "#1234", class: "Sprinter", spd: 95, str: 71, def: 68, dex: 92, frt: 74 },
                    { rank: 20, name: "#2345", class: "Grinder", spd: 79, str: 81, def: 86, dex: 80, frt: 92 }
                ];
                
                this.schemes = [
                    { name: "TAKING A DIVE", rarity: "EPIC", effect: "+150 mXP on loss", desc: "Farm +150 mxP on loss" },
                    { name: "SHADOW ARTS", rarity: "RARE", effect: "+10% Team Speed", desc: "Best for high SPD teams" },
                    { name: "BOUNTY HUNTER", rarity: "LEGENDARY", effect: "2x mXP vs higher rank", desc: "Target stronger opponents" },
                    { name: "GLASS CANNON", rarity: "RARE", effect: "+50% STR / -50% DEF", desc: "All-in combat strategy" },
                    { name: "RECYCLE BIN", rarity: "COMMON", effect: "Refund 50 Gems on loss", desc: "Budget farming" },
                    { name: "DATA BREACH", rarity: "EPIC", effect: "Reveal enemy stats", desc: "Counter sleepers" },
                    { name: "OVERCLOCK", rarity: "LEGENDARY", effect: "+20% All Stats", desc: "Ultimate multiplier" }
                ];

                this.classAdvice = {
                    'Striker': { good: ['Defender', 'Grinder'], bad: ['Sprinter', 'Bruiser'] },
                    'Bruiser': { good: ['Sprinter', 'Striker'], bad: ['Defender', 'Grinder'] },
                    'Defender': { good: ['Bruiser', 'Striker'], bad: ['Grinder', 'Sprinter'] },
                    'Sprinter': { good: ['Grinder', 'Defender'], bad: ['Bruiser', 'Striker'] },
                    'Grinder': { good: ['Sprinter', 'Bruiser'], bad: ['Striker', 'Defender'] },
                    'Forward': { good: ['any'], bad: [] }
                };

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

            showToast(message, type = 'success', duration = 3000) {
                const container = document.getElementById('toast-container');
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.textContent = message;
                container.appendChild(toast);
                
                setTimeout(() => {
                    toast.remove();
                }, duration);
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

                container.innerHTML = this.savedMokis.map((m, i) => {
                    const mokiClass = this.determineClass(m);
                    return `
                        <div class="moki-card">
                            <div class="flex justify-between">
                                <span style="font-weight:700; color:var(--moku-cyan);">${m.name}</span>
                                <span class="class-badge class-${mokiClass.toLowerCase()}">${mokiClass}</span>
                            </div>
                            <div class="stats-grid" style="margin:8px 0;">
                                <div class="tooltip">SPD<span class="tooltip-text">Normal movement speed</span></div><div>${m.spd}</div>
                                <div class="tooltip">STR<span class="tooltip-text">Buff form speed</span></div><div>${m.str}</div>
                                <div class="tooltip">DEF<span class="tooltip-text">Wart riding speed</span></div><div>${m.def}</div>
                                <div class="tooltip">DEX<span class="tooltip-text">Gacha carry speed</span></div><div>${m.dex}</div>
                                <div class="tooltip">FRT<span class="tooltip-text">Respawn time</span></div><div>${m.frt}</div>
                            </div>
                            <div style="display:flex; gap:4px;">
                                <button onclick="app.selectForBattle(${i})" class="btn-outline" style="flex:1; padding:6px;">⚔️</button>
                                <button onclick="app.selectForContest(${i})" class="btn-outline" style="flex:1; padding:6px;">🏆</button>
                                <button onclick="app.deleteMoki(${i})" class="btn-outline" style="padding:6px;">✕</button>
                            </div>
                        </div>
                    `;
                }).join('');
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
                if (!name) {
                    this.showToast('❌ Please enter a MOKI ID', 'error');
                    return;
                }

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
                this.showToast(`✅ SAVED: ${moki.name}`, 'success');

                document.getElementById('new-moki-name').value = '';
                ['spd','str','def','dex','frt'].forEach(s => 
                    document.getElementById(`new-moki-${s}`).value = 50
                );
            }

            deleteMoki(index) {
                this.savedMokis.splice(index, 1);
                localStorage.setItem('mokuTerminal', JSON.stringify(this.savedMokis));
                this.renderLocker();
                this.showToast('🗑️ MOKI REMOVED', 'warning');
            }

            // ===== BATTLE MODE =====
            selectForBattle(index) {
                const moki = this.savedMokis[index];
                for (let i = 0; i < 3; i++) {
                    if (!this.myTeam[i]) {
                        this.myTeam[i] = moki;
                        this.updateTeamSlot(i+1, moki);
                        this.showToast(`⚔️ Added ${moki.name} to your team`, 'success');
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
                const moki = this.myTeam[slot-1];
                this.myTeam[slot-1] = null;
                const slotEl = document.getElementById(`my-team-slot${slot}`);
                slotEl.innerHTML = `SLOT ${slot}<button class="cancel-btn" onclick="app.cancelTeamSlot(${slot}, event)">✕</button>`;
                slotEl.classList.remove('filled');
                if (moki) this.showToast(`❌ Removed ${moki.name}`, 'warning');
            }

            openTeamPicker(slot) {
                this.currentPickerSlot = slot;
                this.currentPickerType = 'team';
                const grid = document.getElementById('team-picker-grid');
                grid.innerHTML = this.savedMokis.map((m, i) => `
                    <div class="moki-card" onclick="app.selectForTeam(${i})">
                        <div style="font-weight:700;">${m.name}</div>
                        <div class="class-badge">${this.determineClass(m)}</div>
                    </div>
                `).join('');
                document.getElementById('modal-backdrop').classList.add('active');
                document.getElementById('team-picker').classList.remove('hidden');
                document.getElementById('contest-picker').classList.add('hidden');
                document.getElementById('scheme-picker').classList.add('hidden');
            }

            selectForTeam(index) {
                const moki = this.savedMokis[index];
                this.myTeam[this.currentPickerSlot-1] = moki;
                this.updateTeamSlot(this.currentPickerSlot, moki);
                this.closeAllModals();
                this.showToast(`⚔️ Added ${moki.name} to your team`, 'success');
            }

            // ===== CONTEST MODE =====
            selectForContest(index) {
                const moki = this.savedMokis[index];
                for (let i = 1; i <= 4; i++) {
                    if (!this.contestLineup[i]) {
                        this.contestLineup[i] = moki;
                        this.updateContestSlot(i, moki);
                        this.updateSynergy();
                        this.showToast(`🏆 Added ${moki.name} to lineup`, 'success');
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
                const moki = this.contestLineup[slot];
                this.contestLineup[slot] = null;
                const slotEl = document.getElementById(`contest-slot${slot}`);
                slotEl.innerHTML = `MOKI ${slot}<button class="cancel-btn" onclick="app.cancelContestSlot(${slot}, event)">✕</button>`;
                slotEl.classList.remove('filled');
                this.updateSynergy();
                if (moki) this.showToast(`❌ Removed ${moki.name}`, 'warning');
            }

            cancelScheme(event) {
                event.stopPropagation();
                this.contestLineup.scheme = null;
                const slotEl = document.getElementById('contest-slot-scheme');
                slotEl.innerHTML = 'SCHEME<button class="cancel-btn" onclick="app.cancelScheme(event)">✕</button>';
                slotEl.classList.remove('filled');
                this.updateSynergy();
                this.showToast('❌ Scheme removed', 'warning');
            }

            openContestPicker(slot) {
                this.currentPickerSlot = slot;
                this.currentPickerType = 'contest';
                const grid = document.getElementById('contest-picker-grid');
                grid.innerHTML = this.savedMokis.map((m, i) => `
                    <div class="moki-card" onclick="app.selectForContestSlot(${i})">
                        <div style="font-weight:700;">${m.name}</div>
                        <div class="class-badge">${this.determineClass(m)}</div>
                    </div>
                `).join('');
                document.getElementById('modal-backdrop').classList.add('active');
                document.getElementById('contest-picker').classList.remove('hidden');
                document.getElementById('team-picker').classList.add('hidden');
                document.getElementById('scheme-picker').classList.add('hidden');
            }

            selectForContestSlot(index) {
                const moki = this.savedMokis[index];
                this.contestLineup[this.currentPickerSlot] = moki;
                this.updateContestSlot(this.currentPickerSlot, moki);
                this.closeAllModals();
                this.updateSynergy();
                this.showToast(`🏆 Added ${moki.name} to lineup`, 'success');
            }

            openSchemePicker() {
                this.currentPickerType = 'scheme';
                const grid = document.getElementById('scheme-picker-grid');
                grid.innerHTML = this.schemes.map((s, i) => `
                    <div class="moki-card" onclick="app.selectScheme(${i})">
                        <div style="font-weight:700; color:var(--moku-gold);">${s.name}</div>
                        <div style="font-size:11px;">${s.effect}</div>
                        <div style="font-size:10px; color:#888;">${s.desc}</div>
                    </div>
                `).join('');
                document.getElementById('modal-backdrop').classList.add('active');
                document.getElementById('scheme-picker').classList.remove('hidden');
                document.getElementById('team-picker').classList.add('hidden');
                document.getElementById('contest-picker').classList.add('hidden');
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
                this.closeAllModals();
                this.updateSynergy();
                this.showToast(`🎯 Selected scheme: ${scheme.name}`, 'success');
            }

            closeAllModals(event) {
                if (event && event.target.classList.contains('modal-backdrop')) {
                } else if (event) {
                    return;
                }
                document.getElementById('modal-backdrop').classList.remove('active');
                document.getElementById('team-picker').classList.add('hidden');
                document.getElementById('contest-picker').classList.add('hidden');
                document.getElementById('scheme-picker').classList.add('hidden');
            }

            updateEnemyStat(stat, val) {
                this.enemyStats[stat] = parseInt(val);
                document.getElementById(`enemy-${stat}`).innerText = val;
            }

            run3v3Battle() {
                const filled = this.myTeam.filter(m => m).length;
                if (filled < 3) { 
                    this.showToast('❌ Need 3 Moki in your team!', 'error');
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
                    
                    this.showToast(`⚔️ Battle complete! ${winner} wins`, 'success');
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
                this.showToast('⟲ Battle reset', 'warning');
                this.print("> BATTLE RESET");
            }

            downloadBattleReport() {
                const filled = this.myTeam.filter(m => m).length;
                if (filled < 3) {
                    this.showToast('❌ Simulate a battle first!', 'error');
                    return;
                }

                const teamNames = this.myTeam.map(m => m.name).join(', ');
                const date = new Date().toLocaleString();
                const content = `MOKU BATTLE REPORT\nGenerated: ${date}\n\nYOUR TEAM: ${teamNames}\n\nENEMY STATS:\nSPD: ${this.enemyStats.spd}\nSTR: ${this.enemyStats.str}\nDEF: ${this.enemyStats.def}\nDEX: ${this.enemyStats.dex}\nFRT: ${this.enemyStats.frt}\n\n-- Grand Arena Terminal --`;
                
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Moku_Battle_${Date.now()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
                this.showToast('📥 Report downloaded', 'success');
            }
            
            updateSynergy() {
                const mokis = [this.contestLineup[1], this.contestLineup[2], this.contestLineup[3], this.contestLineup[4]].filter(m => m);
                
                if (mokis.length < 4) {
                    document.getElementById('synergy-value').innerText = '0%';
                    document.getElementById('synergy-bar').style.width = '0%';
                    document.getElementById('synergy-desc').innerText = `Add ${4-mokis.length} more Moki`;
                    document.getElementById('rec-scheme').innerText = '—';
                    document.getElementById('rec-reason').innerText = '';
                    document.getElementById('est-mxp').innerText = '0';
                    document.getElementById('est-rank').innerText = '—';
                    document.getElementById('matchup-analysis').innerHTML = 'Select 4 Moki to see analysis';
                    document.getElementById('matchup-advice').innerHTML = '';
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
                    0: { name: 'SHADOW ARTS', reason: 'Your team has high SPD — use SHADOW ARTS for +10% Speed' },
                    1: { name: 'GLASS CANNON', reason: 'Your team has high STR — use GLASS CANNON for +50% Strength' },
                    2: { name: 'RECYCLE BIN', reason: 'Your team has high DEF — use RECYCLE BIN for defensive farming' },
                    3: { name: 'DATA BREACH', reason: 'Your team has high DEX — use DATA BREACH to reveal enemy stats' },
                    4: { name: 'OVERCLOCK', reason: 'Your team is balanced — use OVERCLOCK for +20% all stats' }
                };
                const rec = schemeMap[maxIdx] || { name: 'OVERCLOCK', reason: 'Your team is balanced' };
                document.getElementById('rec-scheme').innerText = rec.name;
                document.getElementById('rec-reason').innerText = rec.reason;
                
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
                    document.getElementById('matchup-advice').innerHTML = '';
                    return;
                }

                const userClasses = mokis.map(m => this.determineClass(m));
                const topChamps = this.champions.slice(0, 5);
                
                let analysisHTML = '<div style="margin-bottom:8px;"><strong>VS TOP 5 CHAMPIONS</strong></div>';
                let adviceHTML = '<strong>LINEUP ADVICE:</strong> ';
                
                const uniqueClasses = new Set(userClasses).size;
                if (uniqueClasses < 3) {
                    adviceHTML += '⚠️ Low class diversity. ';
                    if (userClasses.filter(c => c === 'Bruiser').length > 2) {
                        adviceHTML += 'Multiple Bruisers don\'t work well together — they compete for the same role. ';
                    }
                    if (userClasses.filter(c => c === 'Striker').length > 2) {
                        adviceHTML += 'Multiple Strikers reduce overall effectiveness. ';
                    }
                } else {
                    adviceHTML += '✅ Good class diversity. ';
                }
                
                if (userClasses.includes('Bruiser') && userClasses.includes('Striker')) {
                    adviceHTML += 'Bruisers and Strikers have good synergy. ';
                }
                if (userClasses.includes('Defender') && userClasses.includes('Grinder')) {
                    adviceHTML += 'Defenders pair well with Grinders. ';
                }
                if (userClasses.includes('Sprinter') && userClasses.includes('Bruiser')) {
                    adviceHTML += 'Sprinters complement Bruisers. ';
                }
                
                topChamps.forEach(champ => {
                    let goodMatchups = 0;
                    let badMatchups = 0;
                    
                    userClasses.forEach(userClass => {
                        // Class advantage logic
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
                        matchupText = '👍 STRONG';
                        matchupColor = 'var(--matchup-good)';
                    } else if (matchupScore >= 1) {
                        matchupText = '👍 GOOD';
                        matchupColor = 'var(--matchup-good)';
                    } else if (matchupScore <= -2) {
                        matchupText = '👎 WEAK';
                        matchupColor = 'var(--matchup-bad)';
                    } else if (matchupScore <= -1) {
                        matchupText = '👎 BAD';
                        matchupColor = 'var(--matchup-bad)';
                    } else {
                        matchupText = '⚖️ EVEN';
                        matchupColor = 'var(--matchup-neutral)';
                    }
                    
                    analysisHTML += `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <span>#${champ.rank} ${champ.name} <span class="class-badge class-${champ.class.toLowerCase()}" style="font-size:8px;">${champ.class}</span></span>
                            <span style="color:${matchupColor};">${matchupText}</span>
                        </div>
                    `;
                });
                
                document.getElementById('matchup-analysis').innerHTML = analysisHTML;
                document.getElementById('matchup-advice').innerHTML = adviceHTML;
                this.showToast('🔍 Matchup analysis complete', 'info');
            }

            analyzeLineup() {
                this.updateSynergy();
                this.analyzeMatchups();
                this.showToast('📊 Lineup analysis complete', 'success');
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
                this.showToast('⟲ Contest reset', 'warning');
            }

            downloadContestReport() {
                const mokis = [this.contestLineup[1], this.contestLineup[2], this.contestLineup[3], this.contestLineup[4]].filter(m => m);
                if (mokis.length < 4) {
                    this.showToast('❌ Build a full lineup first!', 'error');
                    return;
                }

                const teamNames = mokis.map(m => m.name).join(', ');
                const schemeName = this.contestLineup.scheme ? this.contestLineup.scheme.name : 'None';
                const synergy = document.getElementById('synergy-value').innerText;
                const mxp = document.getElementById('est-mxp').innerText;
                const advice = document.getElementById('matchup-advice').innerText || 'No advice';
                const date = new Date().toLocaleString();
                
                const content = `MOKU CONTEST REPORT\nGenerated: ${date}\n\nLINEUP: ${teamNames}\nSCHEME: ${schemeName}\nSYNERGY: ${synergy}\nESTIMATED mXP: ${mxp}\n\nADVICE: ${advice}\n\n-- Grand Arena Terminal --`;
                
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Moku_Contest_${Date.now()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
                this.showToast('📥 Report downloaded', 'success');
            }

            analyzeChampionMatchup(name) {
                this.showToast(`🔍 Analyzing ${name}...`, 'info');
                this.analyzeMatchups(); 
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
                this.showToast(`Switched to ${mode.toUpperCase()} mode`, 'info');
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
                            'status': () => this.showToast('SEASON 1: $1M POOL', 'info'),
                            'clear': () => document.getElementById('terminal-output').innerHTML = '',
                            'help': () => {
                                this.showToast('Commands: classic, contest, locker, leaderboard, tip, status, clear', 'info');
                                this.print("> COMMANDS: classic, contest, locker, leaderboard, tip, status, clear");
                                this.print("> Add Moki → Build lineup → Analyze");
                            }
                        };
                        
                        cmds[cmd] ? cmds[cmd]() : this.showToast(`❌ Unknown command: ${cmd}`, 'error');
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