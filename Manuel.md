# MonFlux<br />Manuel d'utilisation


## Création d'une nouvelle tâche

### Contenu de la tâche

#### Insertion de liens

Les liens permettent :

* d'ouvrir un fichier dans son application,
* d'ouvrir un dossier dans le finder,
* de lancer un script quelconque,
* d'ouvrir une page internet,
* d'ouvrir un dossier dans l'éditeur de code (Sublime Text en ce moment)

Forme de chaque lien :

##### Un fichier ou un script quelconque

~~~
[mon fichier](/path/absolu/to/fichier.ext)
~~~

##### Un dossier

~~~
ouvrir [mon dossier](/path/absolu/to/mondossier) en cliquant sur le lien
~~~

##### Une URL (http)

~~~
ouvrir [cette url](https://www.atelier-icare.net) pour y aller
~~~

##### Un dossier de code (ide)

~~~
Ouvrir [ce dossier](ide:/path/absolu/to/dossier/code) pour modifier le code
~~~

### Définition de la catégorie (groupe)

Si la catégorie de la nouvelle tâche existe déjà, il suffit de la choisir dans le premier menu sous le champ de texte.

Si elle n'existe pas, il suffit de la définir en début de message, seule. Notez que cette catégorie doit être un mot unique (remplacer les espaces par des “\_” au besoin). De cette manière :

~~~
MON_NOUVEAU_GROUPE
Le texte de la tâche est ici, sur la seconde ligne.
~~~

De cette manière, le texte de la tâche sera bien “Le texte de la tâche est ici, sur la seconde ligne” et cette tâche sera placée dans la nouvelle catégorie “MON_NOUVEAU_GROUPE”.
