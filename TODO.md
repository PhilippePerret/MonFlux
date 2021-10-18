# TODO list

* Reprendre la procédure ajax avec le formulaire (comme pour la découpe de partition)
  - il suffit de créer un formulaire caché dans lequel mettre les données à transmettre et de le soumettre

* Corriger le fichier ajax.php pour qu’il remplisse bien le rôle attendu
  * Le mettre ensuite dans le scaffold


* Diviser l'écran en trois parties :
  - une partie servira pour l'historique, c'est-à-dire les tâches accomplies dans la journée ou à accomplir dans la journée. Un simple bouton permettra de décider si la tâche a été faite ou est à faire dans la journée.
  - une partie servira à mettre les tâches sans échéance à faire
  - une partie servira à afficher les tâches en cours. Par exemple, aujourd'hui, cette partie contiendrait :
    * commenter le document de Jérôme
    * poursuivre le livre sur toutes les gammes et tous les accords
    * Développer MonFlux


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
