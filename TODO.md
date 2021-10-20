# TODO list


* FAIRE FONCTIONNER LE CLASSEMENT DES TÂCHES par date (ça ne doit pourtant pas être compliqué mais je me noie dans un verre d'eau…………………)

Réflexion sur le fonctionnement
-------------------------------
Le jour porte la date <xxxxx>12:00:00
Une tâche du jour sera toujours inférieure (donc en dessous)
  Pour le moment, elle est mise à 00:00:00, mais il faut tenir compte de son groupe
Une tâche peut appartenir à un groupe (comme "ICARE" ou "CAMI", etc.)
  Les groupes sont placés toutes les 10 minutes dans le jour, ça signifie
  qu'on peut en avoir 12 x 6 = 72 groupes
  => Il faut donc mémoriser les groupes dans les jours


* Les tâches qui n'ont pas été faites sont automatiquement reporter au lendemain.

### Principes

* On doit pouvoir entrer les informations de façon simple, en s'inspirant de l'écriture Markdown. Par exemple, pour ouvrir un dossier ou un lien, il suffit de faire `[mon lien](path/to/mon/fichier)` et ça transforme aussitôt en bouton cliquable.
* L'élément de base du programme est la tâche : Task


### Features

* Une tâche peut avoir une liste de tâche
* Pouvoir ouvrir n'importe quel fichier ou quel dossier
* Pouvoir lancer n'importe quelle application
* Pouvoir jouer un ligne de code

### Features lointaines
* On peut faire des modèles de liste de tâches, comme par exemple pour les documents Icare (mais bon, faire plus simple puisque de toutes façon je ne me sers pas de tous les détails)
