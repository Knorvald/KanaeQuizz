// ScoreManager.js - Gestion centralisée du stockage des scores

class ScoreManager {
    constructor() {
        this.storageKey = 'kanaeScores';
        this.init();
    }

    init() {
        // Initialiser IndexedDB pour un stockage plus robuste
        const dbRequest = indexedDB.open('KanaeQuizzDB', 1);

        dbRequest.onerror = () => {
            console.warn('IndexedDB non disponible, utilisant localStorage');
        };

        dbRequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('scores')) {
                db.createObjectStore('scores', { keyPath: 'id', autoIncrement: true });
            }
        };

        dbRequest.onsuccess = () => {
            this.db = dbRequest.result;
            console.log('IndexedDB initialisé avec succès');
        };
    }

    // Sauvegarder un score
    saveScore(pseudo, score, questions, difficulty = 'Facile') {
        const scoreData = {
            pseudo: pseudo,
            score: score,
            questions: questions,
            date: new Date().toLocaleString('fr-FR'),
            difficulty: difficulty,
            timestamp: Date.now()
        };

        // Essayer IndexedDB d'abord
        if (this.db) {
            try {
                const transaction = this.db.transaction(['scores'], 'readwrite');
                const objectStore = transaction.objectStore('scores');
                objectStore.add(scoreData);
                console.log('Score sauvegardé dans IndexedDB');
            } catch (error) {
                console.warn('Erreur IndexedDB, fallback localStorage:', error);
                this._saveTolocalStorage(scoreData);
            }
        } else {
            this._saveTolocalStorage(scoreData);
        }

        // Sauvegarder aussi dans localStorage comme secours
        this._saveTolocalStorage(scoreData);
    }

    _saveTolocalStorage(scoreData) {
        let scores = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        scores.push(scoreData);
        localStorage.setItem(this.storageKey, JSON.stringify(scores));
    }

    // Récupérer tous les scores
    getAllScores(callback) {
        if (this.db) {
            try {
                const transaction = this.db.transaction(['scores'], 'readonly');
                const objectStore = transaction.objectStore('scores');
                const request = objectStore.getAll();

                request.onsuccess = () => {
                    const idbScores = request.result;
                    if (idbScores.length > 0) {
                        callback(idbScores);
                    } else {
                        // Fallback localStorage
                        const localScores = JSON.parse(localStorage.getItem(this.storageKey)) || [];
                        callback(localScores);
                    }
                };

                request.onerror = () => {
                    const localScores = JSON.parse(localStorage.getItem(this.storageKey)) || [];
                    callback(localScores);
                };
            } catch (error) {
                const localScores = JSON.parse(localStorage.getItem(this.storageKey)) || [];
                callback(localScores);
            }
        } else {
            const localScores = JSON.parse(localStorage.getItem(this.storageKey)) || [];
            callback(localScores);
        }
    }

    // Supprimer tous les scores
    clearAllScores() {
        localStorage.removeItem(this.storageKey);

        if (this.db) {
            try {
                const transaction = this.db.transaction(['scores'], 'readwrite');
                const objectStore = transaction.objectStore('scores');
                objectStore.clear();
            } catch (error) {
                console.warn('Erreur lors de la suppression des scores IndexedDB');
            }
        }
    }

    // Exporter les scores en JSON
    exportScoresToJSON() {
        this.getAllScores((scores) => {
            const dataStr = JSON.stringify(scores, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `kanae-quizz-scores-${new Date().getTime()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }

    // Importer les scores depuis un fichier JSON
    importScoresFromJSON(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const scores = JSON.parse(event.target.result);
                if (Array.isArray(scores)) {
                    scores.forEach(score => {
                        this._saveTolocalStorage(score);
                    });
                    alert('Scores importés avec succès!');
                } else {
                    alert('Format de fichier invalide');
                }
            } catch (error) {
                alert('Erreur lors de la lecture du fichier: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
}

// Créer une instance globale
const scoreManager = new ScoreManager();
