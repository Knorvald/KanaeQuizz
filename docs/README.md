# KanaeQuizz - Guide d'Installation et d'Utilisation

## 📋 Modification Effectuée

Le système de scoreboard a été **complètement amélioré** pour offrir une **persistance robuste** des scores :

### ✨ Nouveautés

1. **IndexedDB** - Stockage de base de données côté client pour une meilleure persistance
2. **localStorage** - Sauvegarde de secours pour compatibilité maximale
3. **Export/Import JSON** - Téléchargez et importez vos scores facilement
4. **Aucune dépendance externe** - Fonctionnement 100% client-side
5. **ScoreManager centralisé** - Gestion uniforme du stockage des scores

## ✅ Avantages de cette Solution

- ✔️ **Plus rapide** - Pas besoin de serveur
- ✔️ **Persistent** - Les scores sont sauvegardés localement
- ✔️ **Portable** - Exportez vos scores n'importe où
- ✔️ **Simple** - Ouvert directement dans le navigateur
- ✔️ **Fiable** - Double stockage (IndexedDB + localStorage)

## 🚀 Utilisation

### Méthode 1️⃣ : Directement dans le navigateur (RECOMMANDÉE)

1. Ouvrez simplement le fichier `index.html` dans votre navigateur
2. Cliquez sur "Commencer" pour jouer
3. Les scores sont sauvegardés **automatiquement** dans votre navigateur

### Méthode 2️⃣ : Avec un serveur local (Optionnel)

Si vous avez Node.js installé, vous pouvez lancer un serveur local :

1. **Ouvrir un terminal PowerShell** dans le dossier `SITE EVENT`

2. **Démarrer le serveur**:
   ```powershell
   node server.js
   ```

3. **Accéder à l'application**:
   - Ouvrez http://localhost:3000 dans votre navigateur

## 📁 Structure des Fichiers

```
SITE EVENT/
├── index.html              # Page d'accueil
├── easy.html               # Page du quiz
├── leaderboard.html        # Page du classement
├── easy.js                 # Logique du quiz
├── ScoreManager.js         # Gestionnaire des scores (IndexedDB + localStorage)
├── sw.js                   # Service Worker (cache)
├── server.js               # Serveur Node.js (optionnel)
├── package.json            # Configuration npm (optionnel)
├── scores.json             # Stockage serveur (optionnel)
└── README.md               # Ce fichier
```

## 🎯 Fonctionnalités du Stockage

### 📊 Sauvegarde Automatique
- Vos scores sont **sauvegardés automatiquement** après chaque quiz
- Données stockées dans **IndexedDB** (base de données du navigateur)
- Secours en **localStorage** pour compatibilité maximale

### 🏆 Leaderboard
- Affiche tous les scores triés du meilleur au plus faible
- Médailles pour les 3 premiers places (🥇 🥈 🥉)
- Affichage : Pseudo | Score | Questions | Difficulté | Date

### 💾 Export des Scores
- Cliquez sur "Télécharger les scores" dans le leaderboard
- Télécharge un fichier `kanae-quizz-scores-[timestamp].json`
- Format lisible et partageable

### 📂 Import des Scores
- Cliquez sur "Importer les scores" dans le leaderboard
- Sélectionnez un fichier JSON de scores
- Les scores importés s'ajoutent aux scores existants

### 🗑️ Suppression des Scores
- Cliquez sur "Effacer les scores" pour tout supprimer
- Demande une confirmation avant suppression
- Action irréversible

## 💡 Cas d'Usage

### Sauvegarde Multi-Appareils
1. **Sur l'appareil 1** : Jouez et exportez vos scores
2. **Sur l'appareil 2** : Importez le fichier de scores
3. Vos scores sont maintenant sur les deux appareils!

### Restauration Après Suppression du Navigateur
1. Si vous avez un fichier de scores exporté
2. Importez-le dans leaderboard.html
3. Vos scores sont restaurés!

## 🔧 Commandes Utiles

### Lancer avec Node.js (optionnel):
```powershell
npm start
```

### Arrêter le serveur:
- Appuyez sur `Ctrl + C` dans le terminal

## ⚠️ Troubleshooting

### Les scores ne s'affichent pas?
- Rafraîchissez la page (F5)
- Vérifiez que IndexedDB est activé dans votre navigateur
- Vérifiez la console du navigateur (F12) pour les erreurs

### Vos scores ont disparu après un nettoyage du navigateur?
- C'est normal ! IndexedDB est lié à votre navigateur
- **Solution**: Avant de nettoyer, exportez vos scores
- Réimportez-les après pour les restaurer

### Le fichier JSON importé n'est pas valide?
- Vérifiez que le fichier est un JSON valide
- Vérifiez le format avec un outil comme jsonlint.com
- Assurez-vous que le fichier contient un tableau

### Voulez-vous garder vos scores permanents?
- Utilisez le serveur Node.js (Méthode 2)
- Les scores seront sauvegardés dans `scores.json`

---

**Créé le:** 19 janvier 2026  
**Application:** KanaeQuizz avec Scoreboard Persistant  
**Technologie:** 100% Client-Side (IndexedDB + localStorage) avec Serveur Optional (Node.js)
