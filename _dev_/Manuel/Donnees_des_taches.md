# MonFlux

## Données des tâches

### Enregistrement

Les tâches sont enregistrées dans le dossier `data/tasks/`.

Chaque tâches est un fichier `JSON` contenant les données de la tâche.

### Données de la tâche

~~~

id        Identifiant unique de la tâche, une chaine de 4 chiffres
date      AA/MM/JJ Date de création ou de travail de la tâche
content   {String} L'énoncé de la tâche, le texte affiché, au format
          markdown.
container {Integer} Le numéro du container :
            0: tâche sans échéance (colonne tout à gauche)
            1: travaux en cours (colonne du centre)
            2: historique de travail
state     {Integer} État de la tâche. Valeur binaire
            0: pas en cours
            1: en cours (donc non exécutée)
            2: accomplie
            4: supprimée
tasks     {Array} Liste des identifiants des taches de la tâches, dans
          l'ordre où elles doivent être affichées.
files     {Array} Liste des fichiers ou dossiers associés à la tâche,
          hors ceux définis dans les textes.
~~~
