// Admin Panel JavaScript

// Vérifier l'authentification
window.addEventListener('load', () => {
    const adminToken = localStorage.getItem('admin_token');
    const adminUsername = localStorage.getItem('admin_username');
    
    if (!adminToken) {
        window.location.href = 'admin.html';
        return;
    }
    
    // Charger les données initiales
    loadDashboardStats();
    loadAccounts();
    loadScores();
    
    // Mettre à jour la date
    const today = new Date();
    document.getElementById('current-date').textContent = today.toLocaleDateString('fr-FR');
});

function switchTab(tabName) {
    // Masquer tous les onglets
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Désactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activer l'onglet sélectionné
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Recharger les données
    if (tabName === 'dashboard') {
        loadDashboardStats();
    } else if (tabName === 'accounts') {
        loadAccounts();
    } else if (tabName === 'scores') {
        loadScores();
    } else if (tabName === 'bugs') {
        loadBugs();
    }
}

// ==================== DASHBOARD ====================

async function loadDashboardStats() {
    try {
        const response = await fetch('/api/admin/stats', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('total-users').textContent = data.totalUsers;
            document.getElementById('total-scores').textContent = data.totalScores;
            document.getElementById('avg-score').textContent = Math.round(data.avgScore);
            document.getElementById('best-score').textContent = data.bestScore;
            
            // Charger les activités
            loadRecentActivity(data.recentActivity);
        } else {
            showMessage('stats-message', 'Erreur lors du chargement des statistiques', 'error');
        }
    } catch (error) {
        showMessage('stats-message', 'Erreur de connexion au serveur', 'error');
        console.error('Erreur:', error);
    }
}

function loadRecentActivity(activities) {
    const container = document.getElementById('recent-activity');
    
    if (!activities || activities.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>Aucune activité à afficher</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="table-responsive"><table>';
    html += '<thead><tr><th>Type</th><th>Utilisateur</th><th>Date</th></tr></thead><tbody>';
    
    activities.forEach(activity => {
        html += `
            <tr>
                <td>${activity.type}</td>
                <td>${activity.username}</td>
                <td>${new Date(activity.date).toLocaleDateString('fr-FR')}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// ==================== ACCOUNTS ====================

async function loadAccounts() {
    try {
        const response = await fetch('/api/admin/accounts', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayAccounts(data.accounts);
        } else {
            showMessage('accounts-message', 'Erreur lors du chargement des comptes', 'error');
        }
    } catch (error) {
        showMessage('accounts-message', 'Erreur de connexion au serveur', 'error');
        console.error('Erreur:', error);
    }
}

function displayAccounts(accounts) {
    const tbody = document.getElementById('accounts-tbody');
    
    if (!accounts || accounts.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div class="empty-state-icon">👥</div>
                    <p>Aucun compte trouvé</p>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    accounts.forEach(account => {
        const createdDate = new Date(account.createdAt).toLocaleDateString('fr-FR');
        const scoreCount = account.scores ? account.scores.length : 0;
        
        html += `
            <tr>
                <td><strong>${account.username}</strong></td>
                <td>${account.email}</td>
                <td>${account.discord || '-'}</td>
                <td>${scoreCount}</td>
                <td>${createdDate}</td>
                <td>
                    <button class="btn-small btn-view" onclick="viewAccountDetails('${account.username}')">👁️ Voir</button>
                    <button class="btn-small btn-delete" onclick="deleteAccount('${account.username}')">🗑️ Supprimer</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function searchAccounts() {
    const searchTerm = document.getElementById('search-accounts').value.toLowerCase();
    const tbody = document.getElementById('accounts-tbody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

async function viewAccountDetails(username) {
    try {
        const response = await fetch(`/api/admin/account/${username}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const account = data.account;
            let html = `
                <div class="form-group">
                    <label>Pseudo</label>
                    <p style="padding: 10px; background: #f3f4f6; border-radius: 6px;">
                        ${account.username}
                    </p>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <p style="padding: 10px; background: #f3f4f6; border-radius: 6px;">
                        ${account.email}
                    </p>
                </div>
                <div class="form-group">
                    <label>Discord</label>
                    <p style="padding: 10px; background: #f3f4f6; border-radius: 6px;">
                        ${account.discord || '-'}
                    </p>
                </div>
                <div class="form-group">
                    <label>Créé le</label>
                    <p style="padding: 10px; background: #f3f4f6; border-radius: 6px;">
                        ${new Date(account.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                </div>
                <div class="form-group">
                    <label>Nombre de Scores</label>
                    <p style="padding: 10px; background: #f3f4f6; border-radius: 6px;">
                        ${account.scores ? account.scores.length : 0}
                    </p>
                </div>
            `;
            
            if (account.scores && account.scores.length > 0) {
                html += '<div class="form-group"><label>Scores</label><table style="width: 100%; font-size: 12px;"><thead><tr><th>Score</th><th>Questions</th><th>Difficulté</th><th>Date</th></tr></thead><tbody>';
                
                account.scores.forEach(score => {
                    html += `
                        <tr>
                            <td>${score.score}</td>
                            <td>${score.questions}</td>
                            <td>${score.difficulty}</td>
                            <td>${new Date(score.date).toLocaleDateString('fr-FR')}</td>
                        </tr>
                    `;
                });
                
                html += '</tbody></table></div>';
            }
            
            document.getElementById('account-details').innerHTML = html;
            document.getElementById('account-modal').classList.add('show');
        }
    } catch (error) {
        showMessage('accounts-message', 'Erreur lors du chargement des détails', 'error');
        console.error('Erreur:', error);
    }
}

async function deleteAccount(username) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le compte "${username}" ? Cette action est irréversible.`)) {
        return;
    }
    
    try {
        const response = await fetch('/api/admin/account/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            },
            body: JSON.stringify({ username: username })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('accounts-message', `Compte "${username}" supprimé avec succès`, 'success');
            setTimeout(() => loadAccounts(), 1500);
        } else {
            showMessage('accounts-message', data.message || 'Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        showMessage('accounts-message', 'Erreur de connexion au serveur', 'error');
        console.error('Erreur:', error);
    }
}

// ==================== SCORES ====================

async function loadScores() {
    try {
        const response = await fetch('/api/admin/scores', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayScores(data.scores);
        } else {
            showMessage('scores-message', 'Erreur lors du chargement des scores', 'error');
        }
    } catch (error) {
        showMessage('scores-message', 'Erreur de connexion au serveur', 'error');
        console.error('Erreur:', error);
    }
}

function displayScores(scores) {
    const tbody = document.getElementById('scores-tbody');
    
    if (!scores || scores.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <div class="empty-state-icon">🏆</div>
                    <p>Aucun score trouvé</p>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    scores.forEach((score, index) => {
        const date = new Date(score.date).toLocaleDateString('fr-FR');
        
        html += `
            <tr>
                <td><strong>${score.username || '-'}</strong></td>
                <td>${score.score}</td>
                <td>${score.questions}</td>
                <td>${score.difficulty}</td>
                <td>${date}</td>
                <td>
                    <button class="btn-small btn-delete" onclick="deleteScore('${score.username}', ${index})">🗑️ Supprimer</button>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function searchScores() {
    const searchTerm = document.getElementById('search-scores').value.toLowerCase();
    const tbody = document.getElementById('scores-tbody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

async function deleteScore(username, scoreIndex) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ce score ?`)) {
        return;
    }
    
    try {
        const response = await fetch('/api/admin/score/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            },
            body: JSON.stringify({ username: username, scoreIndex: scoreIndex })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('scores-message', 'Score supprimé avec succès', 'success');
            setTimeout(() => loadScores(), 1500);
        } else {
            showMessage('scores-message', data.message || 'Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        showMessage('scores-message', 'Erreur de connexion au serveur', 'error');
        console.error('Erreur:', error);
    }
}

// ==================== SETTINGS ====================

async function exportAllData() {
    try {
        const response = await fetch('/api/admin/export', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const dataStr = JSON.stringify(data.data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `kanae-quizz-backup-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showMessage('settings-message', 'Données exportées avec succès', 'success');
        } else {
            showMessage('settings-message', 'Erreur lors de l\'export', 'error');
        }
    } catch (error) {
        showMessage('settings-message', 'Erreur de connexion au serveur', 'error');
        console.error('Erreur:', error);
    }
}

function confirmClearAllData() {
    if (!confirm('⚠️ ATTENTION: Cela va SUPPRIMER TOUS les scores de la base de données. Cette action est IRRÉVERSIBLE. Êtes-vous vraiment sûr?')) {
        return;
    }
    
    if (!confirm('Confirmez-vous une deuxième fois?')) {
        return;
    }
    
    clearAllData();
}

async function clearAllData() {
    try {
        const response = await fetch('/api/admin/clear-scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('settings-message', 'Tous les scores ont été supprimés', 'success');
            loadDashboardStats();
            loadScores();
        } else {
            showMessage('settings-message', data.message || 'Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        showMessage('settings-message', 'Erreur de connexion au serveur', 'error');
        console.error('Erreur:', error);
    }
}

// ==================== BUGS ====================

async function loadBugs() {
    try {
        const response = await fetch('/api/admin/bugs', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token')
            }
        });
        
        const bugs = await response.json();
        displayBugs(bugs);
    } catch (error) {
        showMessage('bugs-message', 'Erreur lors du chargement des bugs', 'error');
        console.error('Erreur:', error);
    }
}

function displayBugs(bugs) {
    const container = document.getElementById('bugs-list');
    
    if (!bugs || bugs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <p>Aucun bug reporté</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    bugs.forEach(bug => {
        html += `
            <div class="bug-card">
                <div class="bug-card-header">
                    <div>
                        <div class="bug-card-user">👤 ${bug.username}</div>
                        <div class="bug-card-date">📅 ${bug.date}</div>
                    </div>
                    <button class="btn-small btn-delete" onclick="deleteBug(${bug.id})">Supprimer</button>
                </div>
                <div class="bug-card-description">
                    <strong>Description:</strong><br>${bug.description}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

async function deleteBug(bugId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bug?')) {
        return;
    }
    
    try {
        const response = await fetch('/api/admin/bug/delete', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('admin_token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bugId: bugId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('bugs-message', 'Bug supprimé avec succès', 'success');
            loadBugs();
        } else {
            showMessage('bugs-message', data.message || 'Erreur lors de la suppression', 'error');
        }
    } catch (error) {
        showMessage('bugs-message', 'Erreur de connexion au serveur', 'error');
        console.error('Erreur:', error);
    }
}

function searchBugs() {
    const searchTerm = document.getElementById('bugSearch').value.toLowerCase();
    const bugCards = document.querySelectorAll('.bug-card');
    
    bugCards.forEach(card => {
        const username = card.querySelector('.bug-card-user').textContent.toLowerCase();
        if (username.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ==================== UTILITIES ====================

function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `message ${type} show`;
    
    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function logoutAdmin() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_username');
        window.location.href = 'admin.html';
    }
}

// Fermer la modal en cliquant en dehors
window.addEventListener('click', (event) => {
    const modal = document.getElementById('account-modal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
});
