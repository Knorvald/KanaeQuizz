# Documentation - Pages de Profil et Statistiques

## 📄 Fichiers Créés

### 1. `profile.html` - Profil Utilisateur Connecté
Page personnalisée accessible **uniquement pour les utilisateurs connectés**.

**Contenu :**
- **Informations du Compte**
  - Pseudo
  - Email
  - Date d'inscription
  
- **Statistiques Générales**
  - 🥇 Meilleur Score (avec icône)
  - Score Moyen
  - Nombre de Parties Jouées
  - Nombre Total de Questions Répondues

- **Historique des Parties**
  - Tableau complet avec :
    - Date et heure exacte
    - Score obtenu
    - Nombre de questions répondues
    - Niveau de difficulté
    - Taux de performance (en %)

- **Actions Disponibles**
  - Retour à l'accueil
  - Déconnexion
  - Suppression du compte (avec confirmation et mot de passe)

### 2. `stats.html` - Statistiques Globales
Page de statistiques accessible à **tous les utilisateurs** (connectés ou invités).

**Contenu :**
- **Résumé Global**
  - Nombre total de parties jouées
  - Meilleur score
  - Score moyen
  - Nombre total de questions

- **Historique Complet**
  - Tableau de toutes les parties avec:
    - Date/heure
    - Pseudo du joueur
    - Score
    - Nombre de questions
    - Difficulté
    - Taux de réussite (%)

- **Statistiques par Difficulté**
  - Tableau récapitulatif par niveau :
    - Nombre de parties par difficulté
    - Meilleur score par difficulté
    - Score moyen par difficulté
    - Taux de réussite par difficulté

## 🔐 Authentification et Accès

### `profile.html`
```javascript
// Vérification automatique
if (!authManager.isLoggedIn()) {
    alert('Vous devez être connecté...');
    window.location.href = 'auth.html';
}
```
- Accessible UNIQUEMENT si connecté
- Redirection automatique vers l'authentification si pas connecté
- Données spécifiques au compte utilisateur

### `stats.html`
- Accessible sans connexion
- Affiche les scores du compte connecté (priorité)
- Fallback vers les scores anonymes du ScoreManager
- Données anonymisées pour les invités

## 🔗 Navigation

### Depuis `index.html`
```
Accueil
├── [Si connecté]
│   ├── 👤 Mon Profil → profile.html
│   ├── 📊 Statistiques → stats.html
│   └── 🚪 Déconnexion
└── [Si pas connecté]
    └── 🔐 Connexion/Inscription → auth.html
```

### Depuis `profile.html`
```
profile.html
├── 🏠 Accueil → index.html
├── 🚪 Déconnexion → index.html
└── 🗑️ Supprimer le compte → index.html
```

### Depuis `stats.html`
```
stats.html
└── 🏠 Accueil → index.html
```

## 📊 Données Affichées

### Historique des Parties
Chaque entrée affiche :
- **Date/Heure** : `15 jan. 10:30`
- **Score** : Nombre de bonnes réponses
- **Questions** : Total répondues
- **Difficulté** : Facile / Moyen / Difficile (avec couleur)
- **Performance** : Pourcentage (%) avec code couleur
  - 🟢 Vert (80-100%) : Excellent
  - 🔵 Bleu (60-79%) : Bon
  - 🔴 Rouge (0-59%) : À améliorer

### Statistiques par Difficulté
- Regroupement automatique par niveau
- Calculs séparés pour chaque difficulté
- Comparaison des performances

## 🎨 Styles et Design

- **Cohérent** avec le reste de l'application
- **Responsive** : Adapté mobile et desktop
- **Accessible** : Contraste de couleurs, tailles lisibles
- **Codes couleur** :
  - 🟢 Vert (#10b981) : Positif, bonne performance
  - 🔵 Bleu (#3b82f6) : Neutre, moyen
  - 🟡 Jaune (#fbbf24) : Excellent (meilleur score)
  - 🔴 Rouge (#ef4444) : Faible performance

## 🔒 Sécurité

### `profile.html`
- Vérification de la connexion
- Suppression de compte nécessite confirmation + mot de passe
- Hachage du mot de passe lors de la suppression

### `stats.html`
- Aucune donnée sensible affichée
- Pseudo visible (non modifiable depuis stats)

## ⚙️ Gestion des Données

### Source des Données
1. **Priorité** : `authManager` (compte connecté)
2. **Fallback** : `scoreManager` (ancien système, invités)

### Stockage
```javascript
// Dans AuthManager
userData = {
    username: "...",
    email: "...",
    createdAt: "ISO_DATE",
    scores: [
        {
            score: 42,
            questions: 50,
            difficulty: "Facile",
            date: "ISO_DATE"
        }
    ]
}
```

## 📝 Détails d'Implémentation

### Calculs Statistiques
```javascript
// Meilleur score
const bestScore = Math.max(...scores.map(s => s.score));

// Score moyen
const averageScore = (sum / scores.length).toFixed(1);

// Taux de réussite
const percentage = Math.round((score / questions) * 100);
```

### Tri et Formatage
```javascript
// Trier par date (plus récent en premier)
scores.sort((a, b) => new Date(b.date) - new Date(a.date));

// Format de date
new Date(score.date).toLocaleDateString('fr-FR', {...})
```

## 🚀 Améliorations Futures

- [ ] Export des statistiques en PDF
- [ ] Graphiques de progression (Chart.js)
- [ ] Comparaison avec d'autres joueurs
- [ ] Badges et achievements
- [ ] Statistiques par semaine/mois
- [ ] Temps moyen de réponse
- [ ] Mode sombre/clair
