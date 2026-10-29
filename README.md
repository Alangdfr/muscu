# Muscu

Application de suivi du programme **Masse et Esthétique** (32 semaines, 4 blocs, 3 séances par semaine).
Elle fonctionne hors ligne, et toutes les données restent sur le téléphone.

## Installer sur iPhone

1. Ouvre **https://alangdfr.github.io/muscu/** dans Safari.
2. Appuie sur le bouton Partager, puis sur **Sur l'écran d'accueil**.
3. Lance l'app depuis son icône : elle s'ouvre en plein écran, même sans réseau.

Si l'ancienne icône Muscu est déjà sur ton écran d'accueil, elle ouvre la nouvelle version
(il faut parfois la lancer deux fois pour que la mise à jour s'applique).

## Ce que fait l'app

- **Coach** : la séance du jour avec la charge conseillée, les explications du bloc, les conseils de poids, et les réponses aux questions courantes.
- **Séance** : une carte par exercice, les séries pré-remplies (double progression), validation en un geste, minuteur de repos automatique (supersets compris), disques à charger par côté, échauffement calculé, remplacement d'exercice, écran maintenu allumé.
- **Programme** : les 32 semaines, bloc par bloc, avec ce qui change et pourquoi.
- **Progrès** : régularité, tonnage par séance, 1RM estimé par exercice, séries par muscle.
- **Corps** : pesée du matin, moyenne hebdo et ajustement des calories, habitudes (4 repas, protéines, créatine), mensurations.

## Données

Les données sont dans le stockage du navigateur de l'iPhone. Fais une sauvegarde de temps en temps :
Réglages, puis **Sauvegarder mes données** (fichier .json à garder dans iCloud Drive).
La même page permet de restaurer une sauvegarde ou d'exporter un CSV.

L'ancienne version 2.1 reste disponible dans [`v2/`](./v2/), avec son historique.

## Structure

- `index.html`, `css/app.css` : interface
- `js/program.js` : le programme (blocs, séances, exercices, remplacements)
- `js/store.js` : stockage, progression conseillée, statistiques
- `js/app.js` : écrans, séance en direct, minuteur
- `sw.js`, `manifest.webmanifest`, `icons/` : installation et hors ligne
