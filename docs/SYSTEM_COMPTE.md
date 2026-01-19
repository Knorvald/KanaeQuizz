# Système de Compte et Connexion - KanaeQuizz

## Changements Implémentés

### 1. **Nouvelle Page d'Authentification** (`auth.html`)
- Page dédiée avec deux formulaires :
  - **Connexion** : Email ou Pseudo + Mot de passe
  - **Inscription** : Pseudo + Email + Mot de passe (min. 6 caractères)
- Interface conviviale avec sélection initiale de l'action
- Gestion des erreurs et messages de succès

### 2. **Gestionnaire d'Authentification** (`AuthManager.js`)
Classe `AuthManager` avec les fonctionnalités suivantes :
- **Inscription** : `register(username, email, password)`
- **Connexion** : `login(emailOrUsername, password)`
- **Déconnexion** : `logout()`
- **Gestion des comptes** : Stockage sécurisé avec hachage des mots de passe
- **Sauvegarde des scores** : Intégration des scores par utilisateur
- **Classement** : Récupération des leaderboards globaux

### 3. **Page d'Accueil Modifiée** (`index.html`)
- Bouton **"Connexion / Inscription"** pour accéder à l'authentification
- Affichage du profil utilisateur si connecté
- Boutons de déconnexion et accès au profil
- Option de jouer sans compte (invité)
- Affichage dynamique du pseudo connecté

### 4. **Intégration dans le Quiz** (`easy.js`)
- Support du système de compte pour la sauvegarde des scores
- Les scores sont liés au compte utilisateur connecté
- Fallback automatique sur le système invité si non connecté

### 5. **Classement Intégré** (`leaderboard.html`)
- Affichage des scores des utilisateurs connectés
- Compatibilité avec l'ancien système de scores
- Tri automatique des meilleurs scores
- Médailles pour les 3 premiers

## Architecture du Stockage

### LocalStorage (AuthManager)
```
kanae_users: {
  "username": {
    email: "email@example.com",
    password: "hash_crypté",
    createdAt: "ISO_DATE",
    scores: [
      {
        score: 42,
        questions: 20,
        difficulty: "Facile",
        date: "ISO_DATE"
      }
    ]
  }
}
kanae_current_user: "username"  // Utilisateur actuellement connecté
```

### LocalStorage (ScoreManager - Ancien Système)
Conservé pour compatibilité avec les anciens scores

## Flux d'Utilisation

### Nouvel Utilisateur :
1. Accueil (`index.html`)
2. Clic sur "Connexion / Inscription"
3. Page d'authentification (`auth.html`)
4. Créer un compte ou se connecter
5. Redirection vers l'accueil (connecté)
6. Jouer et scores sauvegardés automatiquement

### Utilisateur Existant :
1. Accueil (`index.html`)
2. Clic sur "Connexion / Inscription"
3. Page d'authentification (`auth.html`)
4. Se connecter avec email/pseudo et mot de passe
5. Redirection vers l'accueil (connecté)

### Invité :
1. Accueil (`index.html`)
2. Jouez directement sans créer de compte
3. Scores sauvegardés de manière anonyme

## Fichiers Créés/Modifiés

✅ **Créés :**
- `auth.html` - Page d'authentification
- `AuthManager.js` - Gestionnaire de comptes

✅ **Modifiés :**
- `index.html` - Intégration du système de compte
- `easy.html` - Ajout de AuthManager.js
- `easy.js` - Utilisation du système de compte pour les scores
- `leaderboard.html` - Intégration des données de compte

## Notes Importantes

1. **Sécurité** : Les mots de passe sont hachés avant stockage (utilisation d'un hachage JS simple pour démo)
2. **Stockage Local** : Les données sont stockées dans le localStorage du navigateur
3. **Compatibilité** : L'ancien système de scores reste compatible
4. **Responsive** : Tous les formulaires sont optimisés mobile

## Fonctionnalités Futures Possibles

- [ ] Export/Import de comptes
- [ ] Récupération de mot de passe oublié
- [ ] Statistiques détaillées par utilisateur
- [ ] Avatar utilisateur
- [ ] Achievements/Badges
- [ ] Synchronisation cloud (backend)
