# 🎯 Guide Rapide KanaeQuizz

## Démarrage Rapide

### 1️⃣ Première Visite
```
index.html → Créer un compte (auth.html) → Jouer (easy.html) → Voir Profil
```

### 2️⃣ Jouer au Quiz
```
Cliquer "▶ Mode Facile" → Répondre aux questions → Terminer → Score sauvegardé
```

### 3️⃣ Consulter Résultats
```
"👤 Mon Profil" → Voir historique complet + stats
OU
"📊 Statistiques" → Voir stats globales + par difficulté
```

## 📱 Pages Principales

| Page | URL | Fonction | Accès |
|------|-----|----------|-------|
| **Accueil** | `index.html` | Hub central | 🌍 Tous |
| **Quiz Facile** | `easy.html` | Jouer | 🌍 Tous |
| **Classement** | `leaderboard.html` | Voir top 3 | 🌍 Tous |
| **Authentification** | `auth.html` | Login/Signup | 🌍 Visiteurs |
| **Mon Profil** | `profile.html` | Stats perso | 🔒 Connectés |
| **Statistiques** | `stats.html` | Données globales | 🌍 Tous |

## 🔐 Compte Utilisateur

### Créer un Compte
```
Pseudo:    xxxxxxxx (max 20 caractères)
Email:     email@example.com
Password:  xxxxxxxx (min 6 caractères)
Confirmer: xxxxxxxx
```

### Se Connecter
```
Email/Pseudo: xxxxx
Password:     xxxxx
```

### Mon Profil
Affiche :
- 📌 Informations (pseudo, email, date)
- 📊 Stats (meilleur score, moyen, nb parties)
- 📜 Historique complet avec dates

## 🎮 Jouer et Scores

### Comment ça Marche
1. **Répondre** aux 20 questions aléatoires
2. **Score calculé** automatiquement
3. **Sauvegardé** dans le compte
4. **Historique** mis à jour

### Votre Score
```
Score = Nombre de bonnes réponses
Exemple: 42/50 = 42 points
```

### Performance (%)
```
Calcul: (Score / Questions) × 100
Exemple: (42 / 50) × 100 = 84%
```

## 📊 Statistiques

### Au Profil (`profile.html`)
```
Meilleur Score    : 42
Score Moyen       : 38
Parties Jouées    : 5
Questions au Total: 250

Historique:
Date        | Score | % | Difficulté | Perf
2026-01-19  | 42    | 84% | Facile    | 🟢
2026-01-18  | 35    | 70% | Moyen     | 🔵
...
```

### Aux Statistiques (`stats.html`)
```
Mêmes infos + statistiques par difficulté
├─ Facile: 2 parties, meilleur 42, moyen 40
├─ Moyen:  2 parties, meilleur 35, moyen 32
└─ Difficile: 1 partie, meilleur 28, moyen 28
```

## 🏆 Classement

Affiche les meilleurs scores globalement :
```
🥇 1. Player1   42
🥈 2. Player2   38
🥉 3. Player3   35
```

## 🎨 Interprétation des Couleurs

| Couleur | Signification | % |
|---------|--------------|---|
| 🟢 Vert | Excellent | 80-100% |
| 🔵 Bleu | Bon | 60-79% |
| 🔴 Rouge | À améliorer | 0-59% |

## 🚪 Gestion du Compte

### Déconnexion
```
Index → Bouton "🚪 Déconnexion" → Retour accueil
```

### Supprimer le Compte
```
Profil → Bouton "🗑️ Supprimer" → Confirmer mot de passe
⚠️ IRRÉVERSIBLE - Tous les scores sont perdus
```

## ❓ Questions Fréquentes

**Q: Je peux jouer sans compte?**
A: Oui! Jouez comme invité. Les scores seront anonymes.

**Q: Où sont sauvegardés mes scores?**
A: Dans localStorage de votre navigateur.

**Q: Je peux récupérer mon mot de passe?**
A: Non (pas encore). Créez un nouveau compte.

**Q: Mes scores apparaissent où?**
A: → Profil (données personnelles)
   → Classement (global)
   → Stats (détaillées)

**Q: Les scores sont visibles à tous?**
A: Oui, dans le Classement (pseudo + score seulement)

**Q: Je peux exporter mes stats?**
A: Pas encore. À venir 🎯

## 🔧 Configuration

Aucune configuration requise. Tout fonctionne automatiquement! ✅

## 🆘 Problèmes Courants

| Problème | Solution |
|----------|----------|
| "Connectez-vous d'abord" | Allez sur auth.html puis créez/connectez-vous |
| "Compte déjà existant" | Choisissez un autre pseudo ou email |
| "Mot de passe trop court" | Minimum 6 caractères requis |
| Scores ne s'affichent pas | Rechargez la page ou videz le cache |
| Page blanche | Ouvrez la console (F12) pour voir les erreurs |

## 🎯 Conseils

✅ **À faire:**
- Créez un compte pour sauvegarder
- Jouez plusieurs fois pour voir progression
- Consultez votre profil régulièrement
- Essayez différentes difficultés

❌ **À ne pas faire:**
- Effacer les cookies/localStorage
- Fermer l'onglet avant la fin du quiz
- Utiliser le même compte pour plusieurs appareils

## 📞 Besoin d'Aide?

1. Consultez `README_COMPTE.md` pour détails
2. Vérifiez la console (F12) pour erreurs
3. Rechargez la page si problème
4. Videz le cache si rien ne fonctionne

---

**Amusez-vous bien au KanaeQuizz! 🍃**

*Version 2.0 - Système de Compte Complet*
