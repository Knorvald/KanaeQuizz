# 🍃 KanaeQuizz - Système de Compte Complet

## 📋 Vue d'ensemble

KanaeQuizz est une application de quiz sur le cannabis avec un **système de compte d'utilisateur complet** permettant de :
- ✅ Créer un compte et se connecter
- ✅ Jouer au quiz et sauvegarder les scores
- ✅ Consulter son profil avec historique complet
- ✅ Voir ses statistiques détaillées
- ✅ Gérer son compte (déconnexion, suppression)

## 🎯 Flux Principal

```
┌─ Accueil (index.html)
│  ├─ [Si connecté] → Mon Profil (profile.html)
│  ├─ [Si connecté] → Statistiques (stats.html)
│  ├─ [Si pas connecté] → Connexion/Inscription (auth.html)
│  ├─ Jouer (easy.html) → Sauvegarde score
│  └─ Classement (leaderboard.html)
└─ Authentification (auth.html)
   ├─ Créer un compte
   └─ Se connecter
```

## 📁 Architecture des Fichiers

### Pages HTML
| Fichier | Description | Accès |
|---------|-------------|-------|
| `index.html` | Accueil principal | Tous |
| `auth.html` | Connexion/Inscription | Visiteurs |
| `profile.html` | Profil utilisateur | Connectés |
| `easy.html` | Quiz facile | Tous |
| `leaderboard.html` | Classement global | Tous |
| `stats.html` | Statistiques détaillées | Tous |

### Scripts JavaScript
| Fichier | Rôle |
|---------|------|
| `AuthManager.js` | Gestion des comptes utilisateurs |
| `ScoreManager.js` | Gestion des scores (ancien système) |
| `easy.js` | Logique du quiz |

## 🔑 Fonctionnalités

### 1. Système d'Authentification (`AuthManager.js`)

#### Inscription
```javascript
authManager.register(username, email, password)
// Crée un nouveau compte avec :
// - Validation de l'email unique
// - Validation du pseudo unique
// - Mot de passe minimum 6 caractères
// - Hachage du mot de passe
```

#### Connexion
```javascript
authManager.login(emailOrUsername, password)
// Se connecter avec :
// - Email ou Pseudo
// - Mot de passe
// - Stockage de la session
```

#### Gestion de Compte
```javascript
authManager.logout()                    // Déconnexion
authManager.deleteAccount(username, password)  // Suppression
authManager.isLoggedIn()               // Vérifier connexion
authManager.getCurrentUser()           // Récupérer pseudo
authManager.getCurrentUserData()       // Récupérer les données
```

### 2. Sauvegarde des Scores

#### Pour Utilisateurs Connectés
Les scores sont **liés au compte** :
```javascript
authManager.addScore(score, questions, difficulty)
// Sauvegardé dans : userData.scores[]
```

#### Pour Invités
Les scores sont **anonymes** via ScoreManager :
```javascript
scoreManager.saveScore(pseudo, score, questions, difficulty)
```

### 3. Profil Utilisateur (`profile.html`)

**Informations Affichées :**
- Pseudo, Email, Date d'inscription
- 🥇 Meilleur score
- Score moyen
- Nombre de parties jouées
- Total de questions répondues

**Historique** :
- Tableau chronologique (récent d'abord)
- Date/heure de chaque partie
- Score, nombre de questions
- Difficulté, taux de réussite (%)

**Actions** :
- Retour à l'accueil
- Déconnexion
- Suppression du compte (avec confirmation)

### 4. Statistiques Globales (`stats.html`)

**Données Affichées :**
- Résumé des 4 principales statistiques
- Historique complet de toutes les parties
- Statistiques détaillées par difficulté
- Taux de réussite par niveau

**Calculs Automatiques :**
- Meilleur score
- Score moyen
- Taux de réussite global
- Comparaison par difficulté

## 💾 Stockage des Données

### LocalStorage - `kanae_users`
```json
{
  "username": {
    "email": "email@example.com",
    "password": "hash_crypté",
    "createdAt": "2026-01-19T10:30:00.000Z",
    "scores": [
      {
        "score": 42,
        "questions": 50,
        "difficulty": "Facile",
        "date": "2026-01-19T10:30:00.000Z"
      }
    ]
  }
}
```

### LocalStorage - `kanae_current_user`
```
"username"
```
(Utilisateur actuellement connecté)

## 🎮 Flux de Jeu

### Pour Utilisateur Connecté
1. **Accueil** → Se connecte déjà
2. **Joue** → Score sauvegardé **dans son compte**
3. **Termine** → Peut voir le score immédiatement
4. **Profil** → Historique mis à jour automatiquement

### Pour Invité
1. **Accueil** → Entre un pseudo temporaire
2. **Joue** → Score sauvegardé anonymement
3. **Termine** → Score visible dans le classement
4. **Historique** → Via `stats.html`

## 🔒 Sécurité

### Mots de Passe
- Hachés avant stockage (hachage JS simple pour démo)
- En production : utiliser bcrypt/argon2
- Vérification lors de connexion et suppression

### Données Sensibles
- Email unique par compte
- Pseudo unique
- Mots de passe jamais affichés

### Authentification
- Vérification au chargement des pages protégées
- Redirection automatique si pas connecté
- Session stockée dans localStorage

## 📊 Exemple de Statistiques Calculées

### Utilisateur avec 3 parties
```
Partie 1: 42/50 (84%) - Facile - 19/01/2026
Partie 2: 35/50 (70%) - Moyen  - 18/01/2026
Partie 3: 28/40 (70%) - Difficile - 17/01/2026

Résultats :
├─ Meilleur Score: 42
├─ Score Moyen: 35
├─ Total Parties: 3
├─ Total Questions: 140
└─ Par Difficulté:
   ├─ Facile: 1 partie, meilleur 42, moyen 42, réussite 84%
   ├─ Moyen: 1 partie, meilleur 35, moyen 35, réussite 70%
   └─ Difficile: 1 partie, meilleur 28, moyen 28, réussite 70%
```

## 🚀 Utilisation

### Pour Créer un Compte
1. Aller sur `index.html`
2. Cliquer sur "🔐 Connexion / Inscription"
3. Cliquer sur "✍️ Créer un compte"
4. Remplir le formulaire
5. Cliquer sur "Créer mon compte"

### Pour Se Connecter
1. Aller sur `index.html`
2. Cliquer sur "🔐 Connexion / Inscription"
3. Cliquer sur "🔓 Se connecter"
4. Entrer email/pseudo et mot de passe
5. Cliquer sur "Se connecter"

### Pour Jouer
1. (Optionnel) Se connecter
2. Cliquer sur "▶ Mode Facile"
3. Répondre aux questions
4. Terminer et voir le score
5. Score sauvegardé automatiquement

### Pour Voir Profil/Stats
1. (Si connecté) Cliquer sur "👤 Mon Profil" (profil complet)
2. (Pour tous) Cliquer sur "📊 Statistiques" (stats globales)

## 🎨 Design et UX

### Couleurs
- **Vert (#10b981)** : Positif, valeurs principales
- **Bleu (#3b82f6)** : Informatif, actions secondaires
- **Orange (#f59e0b)** : Actions dangereuses
- **Rouge (#ef4444)** : Erreurs, suppression

### Responsive
- **Desktop** : 1000px max-width
- **Tablette** : Grille 2 colonnes
- **Mobile** : Grille 1 colonne, full width

### Accessibilité
- Contraste de couleurs suffisant
- Textes lisibles (16px minimum)
- Icônes + texte pour clarté
- Navigation au clavier complète

## ⚙️ Configuration

### Paramètres Modifiables

#### Dans `AuthManager.js`
```javascript
this.storageKey = 'kanae_users';      // Clé localStorage pour les comptes
this.sessionKey = 'kanae_current_user'; // Clé localStorage pour la session
```

#### Dans `easy.js`
```javascript
// Initialiser avec le système de compte
initializePlayer();  // Récupère le pseudo connecté

// Sauvegarder le score
authManager.addScore(score, questions, 'Facile');
```

## 🐛 Dépannage

### Problème : "Vous devez être connecté"
**Solution** : La page `profile.html` est réservée aux utilisateurs connectés. Connectez-vous d'abord.

### Problème : "Mot de passe incorrect"
**Solution** : Assurez-vous que le Caps Lock est désactivé. Les mots de passe sont sensibles à la casse.

### Problème : Scores ne s'affichent pas
**Solution** : 
1. Assurez-vous d'avoir joué au moins une partie
2. Vérifiez que localStorage n'est pas vide (F12 → Application → Storage)
3. Rechargez la page

### Problème : Compte supprimé par erreur
**Solution** : 😢 La suppression est irréversible. Créez un nouveau compte.

## 📈 Améliorations Futures

- [ ] Backend/Base de données (au lieu de localStorage)
- [ ] Authentification OAuth (Google, Facebook)
- [ ] Récupération de mot de passe oublié
- [ ] Graphiques de progression
- [ ] Badges et achievements
- [ ] Compétitions entre amis
- [ ] Synchronisation multi-appareils
- [ ] Export statistiques en PDF
- [ ] Mode sombre/clair
- [ ] Notifications de mise à jour des scores

## 📞 Support

Pour toute question ou problème :
1. Vérifiez ce document
2. Consultez les fichiers de documentation spécifiques
3. Vérifiez la console JavaScript (F12) pour les erreurs

## 📄 Fichiers Documentation

- `SYSTEM_COMPTE.md` : Détails du système de compte
- `PROFILE_STATS_DOCS.md` : Documentation des pages de profil et stats
- `README.md` : Cet fichier

---

**Dernière mise à jour** : 19 janvier 2026
**Version** : 2.0 (Système de Compte Complet)
