class AuthManager {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api';
        this.sessionKey = 'kanae_auth_token';
        this.usernameKey = 'kanae_username';
    }

    // Enregistrer un nouvel utilisateur
    async register(username, email, password, discord = '') {
        try {
            const response = await fetch(`${this.apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    discord: discord
                })
            });

            const data = await response.json();

            if (data.success) {
                // Sauvegarder localement pour la session
                localStorage.setItem(this.sessionKey, 'logged_in');
                localStorage.setItem(this.usernameKey, data.username);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erreur:', error);
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    }

    // Connecter un utilisateur
    async login(emailOrUsername, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailOrUsername: emailOrUsername,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                // Sauvegarder localement pour la session
                localStorage.setItem(this.sessionKey, data.token);
                localStorage.setItem(this.usernameKey, data.username);
                return { success: true, message: data.message };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Erreur:', error);
            return { success: false, message: 'Erreur de connexion au serveur' };
        }
    }

    // Déconnecter l'utilisateur
    logout() {
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.usernameKey);
    }

    // Vérifier si l'utilisateur est connecté
    isLoggedIn() {
        return !!localStorage.getItem(this.sessionKey);
    }

    // Obtenir l'utilisateur actuellement connecté
    getCurrentUser() {
        return localStorage.getItem(this.usernameKey);
    }

    // Obtenir les données de l'utilisateur actuel
    async getCurrentUserData() {
        const username = this.getCurrentUser();
        if (!username) return null;

        try {
            const response = await fetch(`${this.apiUrl}/user/profile?username=${encodeURIComponent(username)}`);
            const data = await response.json();

            if (data.success) {
                return {
                    username: data.username,
                    email: data.email,
                    discord: data.discord,
                    createdAt: data.createdAt,
                    scores: data.scores || []
                };
            } else {
                return null;
            }
        } catch (error) {
            console.error('Erreur:', error);
            return null;
        }
    }

    // Ajouter un score pour l'utilisateur actuel
    async addScore(score, questions, difficulty) {
        const username = this.getCurrentUser();
        if (!username) return false;

        try {
            const response = await fetch(`${this.apiUrl}/scores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    score: score,
                    questions: questions,
                    difficulty: difficulty
                })
            });

            const data = await response.json();
            return data.success;
        } catch (error) {
            console.error('Erreur:', error);
            return false;
        }
    }

    // Obtenir tous les scores de l'utilisateur actuel
    async getUserScores() {
        const username = this.getCurrentUser();
        if (!username) return [];

        try {
            const response = await fetch(`${this.apiUrl}/user/scores?username=${encodeURIComponent(username)}`);
            const data = await response.json();

            if (data.success) {
                return data.scores || [];
            } else {
                return [];
            }
        } catch (error) {
            console.error('Erreur:', error);
            return [];
        }
    }

    // Obtenir tous les scores globaux (leaderboard)
    async getAllScores() {
        try {
            const response = await fetch(`${this.apiUrl}/scores`);
            const data = await response.json();

            if (data.success) {
                return data.scores || [];
            } else {
                return [];
            }
        } catch (error) {
            console.error('Erreur:', error);
            return [];
        }
    }

    // Supprimer le compte utilisateur
    async deleteAccount(password) {
        const username = this.getCurrentUser();
        if (!username) return false;

        try {
            const response = await fetch(`${this.apiUrl}/user/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                this.logout();
            }

            return data.success;
        } catch (error) {
            console.error('Erreur:', error);
            return false;
        }
    }
}

// Créer une instance globale
const authManager = new AuthManager();
