const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const dataDir = path.join(__dirname, '..', 'data');
const publicDir = path.join(__dirname, '..', 'public');
const usersFile = path.join(dataDir, 'users.json');
const scoresFile = path.join(dataDir, 'scores.json');

// Initialiser les fichiers de données s'ils n'existent pas
if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify({}, null, 2));
}
if (!fs.existsSync(scoresFile)) {
    fs.writeFileSync(scoresFile, JSON.stringify([], null, 2));
}

// Fonction pour hasher les mots de passe (simple hash)
function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

// Fonction pour parser le corps de la requête
function parseBody(req, callback) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            callback(null, data);
        } catch (error) {
            callback(error);
        }
    });
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    // Activer CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Gérer les requêtes OPTIONS (CORS preflight)
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // ==================== AUTHENTIFICATION ====================
    
    // POST - Enregistrer un nouvel utilisateur
    if (method === 'POST' && pathname === '/api/auth/register') {
        parseBody(req, (error, data) => {
            if (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Données invalides' }));
                return;
            }

            const { username, email, password, discord } = data;

            // Validation
            if (!username || !email || !password || !discord) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Tous les champs sont obligatoires' }));
                return;
            }

            try {
                const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

                // Vérifier si le pseudo existe
                if (users[username]) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Ce pseudo est déjà utilisé' }));
                    return;
                }

                // Vérifier si l'email existe
                const emailExists = Object.values(users).some(user => user.email === email);
                if (emailExists) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Cet email est déjà utilisé' }));
                    return;
                }

                // Créer le nouvel utilisateur
                users[username] = {
                    email: email,
                    discord: discord,
                    password: hashPassword(password),
                    createdAt: new Date().toISOString(),
                    scores: []
                };

                fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Compte créé avec succès', username: username }));
            } catch (error) {
                console.error('Erreur:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Erreur serveur' }));
            }
        });
        return;
    }

    // POST - Connecter un utilisateur
    if (method === 'POST' && pathname === '/api/auth/login') {
        parseBody(req, (error, data) => {
            if (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Données invalides' }));
                return;
            }

            const { emailOrUsername, password } = data;

            if (!emailOrUsername || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Email/pseudo et mot de passe requis' }));
                return;
            }

            try {
                const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
                
                // Chercher l'utilisateur par pseudo ou email
                let username = null;
                let user = null;

                if (users[emailOrUsername]) {
                    username = emailOrUsername;
                    user = users[emailOrUsername];
                } else {
                    for (const [uname, udata] of Object.entries(users)) {
                        if (udata.email === emailOrUsername) {
                            username = uname;
                            user = udata;
                            break;
                        }
                    }
                }

                if (!user || user.password !== hashPassword(password)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Identifiants incorrects' }));
                    return;
                }

                // Génération d'un simple token (en production, utiliser JWT)
                const token = hashPassword(username + Date.now());

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Connexion réussie',
                    username: username,
                    token: token
                }));
            } catch (error) {
                console.error('Erreur:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Erreur serveur' }));
            }
        });
        return;
    }

    // ==================== PROFIL UTILISATEUR ====================

    // GET - Récupérer le profil utilisateur
    if (method === 'GET' && pathname === '/api/user/profile') {
        const username = parsedUrl.query.username;

        if (!username) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Pseudo requis' }));
            return;
        }

        try {
            const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
            const user = users[username];

            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Utilisateur non trouvé' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                username: username,
                email: user.email,
                discord: user.discord,
                createdAt: user.createdAt,
                scores: user.scores || []
            }));
        } catch (error) {
            console.error('Erreur:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Erreur serveur' }));
        }
        return;
    }

    // DELETE - Supprimer un compte
    if (method === 'DELETE' && pathname === '/api/user/delete') {
        parseBody(req, (error, data) => {
            if (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Données invalides' }));
                return;
            }

            const { username, password } = data;

            if (!username || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Pseudo et mot de passe requis' }));
                return;
            }

            try {
                const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
                const user = users[username];

                if (!user || user.password !== hashPassword(password)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Identifiants incorrects' }));
                    return;
                }

                delete users[username];
                fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Compte supprimé' }));
            } catch (error) {
                console.error('Erreur:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Erreur serveur' }));
            }
        });
        return;
    }

    // ==================== SCORES ====================

    // GET - Récupérer tous les scores
    if (method === 'GET' && pathname === '/api/scores') {
        try {
            const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
            const bestScores = {};

            // Parcourir tous les utilisateurs et garder le meilleur score de chacun
            Object.keys(users).forEach(username => {
                const userScores = users[username].scores || [];
                if (userScores.length > 0) {
                    // Trouver le meilleur score
                    const bestScore = userScores.reduce((best, current) => 
                        current.score > best.score ? current : best
                    );
                    bestScores[username] = {
                        username: username,
                        ...bestScore
                    };
                }
            });

            // Convertir en tableau
            const scoresArray = Object.values(bestScores);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, scores: scoresArray }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Erreur serveur' }));
        }
        return;
    }

    // GET - Récupérer les scores d'un utilisateur
    if (method === 'GET' && pathname === '/api/user/scores') {
        const username = parsedUrl.query.username;

        if (!username) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Pseudo requis' }));
            return;
        }

        try {
            const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
            const user = users[username];

            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Utilisateur non trouvé' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, scores: user.scores || [] }));
        } catch (error) {
            console.error('Erreur:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Erreur serveur' }));
        }
        return;
    }

    // POST - Ajouter un score
    if (method === 'POST' && pathname === '/api/scores') {
        parseBody(req, (error, data) => {
            if (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Données invalides' }));
                return;
            }

            const { username, score, questions, difficulty } = data;

            if (!username || score === undefined || !questions || !difficulty) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Données manquantes' }));
                return;
            }

            try {
                const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
                const user = users[username];

                if (!user) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, message: 'Utilisateur non trouvé' }));
                    return;
                }

                const newScore = {
                    score: score,
                    questions: questions,
                    difficulty: difficulty,
                    date: new Date().toISOString()
                };

                if (!user.scores) {
                    user.scores = [];
                }
                user.scores.push(newScore);

                fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

                // Aussi sauvegarder dans le fichier des scores globaux pour la compatibilité
                const allScores = JSON.parse(fs.readFileSync(scoresFile, 'utf8'));
                allScores.push({
                    username: username,
                    ...newScore
                });
                fs.writeFileSync(scoresFile, JSON.stringify(allScores, null, 2));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Score sauvegardé' }));
            } catch (error) {
                console.error('Erreur:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, message: 'Erreur serveur' }));
            }
        });
        return;
    }

    // ==================== FICHIERS STATIQUES ====================

    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    
    // Sécurité: éviter les traversées de répertoire
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('Accès refusé');
        return;
    }

    // Vérifier si le fichier existe
    fs.exists(filePath, (exists) => {
        if (!exists) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('Page non trouvée');
            return;
        }

        // Lire et servir le fichier
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('Erreur serveur');
                return;
            }

            // Déterminer le type MIME
            let contentType = 'text/html';
            if (filePath.endsWith('.js')) contentType = 'application/javascript';
            else if (filePath.endsWith('.css')) contentType = 'text/css';
            else if (filePath.endsWith('.json')) contentType = 'application/json';

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log(`\n✅ Serveur KanaeQuizz démarré sur http://localhost:${PORT}\n`);
    console.log('📁 Les scores sont stockés dans: scores.json\n');
    console.log('Appuyez sur Ctrl+C pour arrêter le serveur.\n');
});

