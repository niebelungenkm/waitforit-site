# Site WAÍT FOR IT

## Mettre le site en ligne (GitHub Pages, gratuit)

1. Créez un compte sur https://github.com si vous n'en avez pas
2. Créez un nouveau dépôt (bouton **New**), nommez-le par exemple `waitforit-site`, cochez **Public**
3. Sur la page du dépôt vide, cliquez sur **uploading an existing file** et glissez TOUS les fichiers/dossiers : `index.html`, `style.css`, `script.js`, `specs.js`, `README.md`, et le dossier `assets/` (avec `banniere.png` dedans)
4. Validez ("Commit changes")
5. Allez dans **Settings → Pages**
6. Dans "Branch", choisissez `main` et `/ (root)`, cliquez **Save**
7. Au bout d'une à deux minutes, votre site sera visible à une adresse du type :
   `https://VOTRE-PSEUDO.github.io/waitforit-site/`

## Liens déjà en place

- Formulaire de candidature : https://forms.gle/6snwo4SWF6qibQSo7
- Discord : https://discord.gg/jNheH5FGG

Si l'un de ces liens change, cherchez-le dans `index.html` (Ctrl+F) et remplacez-le.

## Mettre à jour l'état de recrutement par spécialisation

Tout se passe dans `specs.js`. Chaque spécialisation a une ligne avec un champ `status` :
- `"ouvert"` → badge vert "Ouvert"
- `"sur-demande"` → badge ambre "Sur demande"
- `"complet"` → badge rouge "Complet"

Changez juste la valeur entre guillemets, sauvegardez, et republiez le fichier sur GitHub.

## Modifier les textes (planning, attentes, ambitions, contacts)

Ces blocs sont écrits directement dans `index.html`, dans les sections `<section class="schedule">`, `<section class="expectations">`, `<section class="ambitions">` et le `<footer>`. Ouvrez le fichier, repérez le texte à changer, modifiez-le directement entre les balises.

## Comment ça marche

- `script.js` interroge l'API publique de raider.io depuis le navigateur du visiteur pour afficher la progression de raid à jour de la guilde **Waít for it**, royaume **Ysondre (EU)**
- `specs.js` gère l'affichage des icônes de spécialisation (chargées depuis wowhead/zamimg) et leur statut de recrutement, à éditer manuellement
