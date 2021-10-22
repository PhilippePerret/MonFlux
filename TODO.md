# TODO list

### BUGS

* Mettre la croix rouge (de destruction de tâche) plus petite

### PROCHES FEATURES

* Traiter les liens qui doivent s'ouvrir dans une nouvelle fenêtre de navigateur
  (pour le moment, le lien ne fait que mettre la tâche en édition — peut-être, dans l'observation du content, faut-il mettre un traitement qui remplace un lien mis explicitement — <a> — en bouton ouvrant normalement
  ou le remplacer simplement par un truc entre croche et parenthèse et mettre une alerte pour dire de faire directement comme ça
  Note : c'est le protocole 'http' qui permet de savoir que c'est une URL — => traitement dans LinkOpener)
* Focusser dans le champ de texte quand on édite la tâche
* Pouvoir ajouter une tâche à une autre
  -> attention, le traitement du placement ne sera plus le même
  ? Est-ce que le container va changer ?


### Principes

* On doit pouvoir entrer les informations de façon simple, en s'inspirant de l'écriture Markdown. Par exemple, pour ouvrir un dossier ou un lien, il suffit de faire `[mon lien](path/to/mon/fichier)` et ça transforme aussitôt en bouton cliquable.
* L'élément de base du programme est la tâche : Task


### Features

* Production du fichier historique du mois en fin de mois
* Une tâche peut avoir une liste de tâche
* Pouvoir ouvrir n'importe quel fichier ou quel dossier
* Pouvoir lancer n'importe quelle application
* Pouvoir jouer un ligne de code

### Features lointaines
* On peut faire des modèles de liste de tâches, comme par exemple pour les documents Icare (mais bon, faire plus simple puisque de toutes façon je ne me sers pas de tous les détails)
* Dans l'historique produit, tenir compte des appartenances (les tâches appartenant à d'autres tâches)
