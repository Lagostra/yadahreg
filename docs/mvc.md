# Model-View-Controller
[<-- Back to index](index.md)

Laravel uses a design pattern called Model-View-Controller (MVC). The point of this is to separate the application into 
several parts, based on their functionality. The parts are as follows:

## Model

The model is a representation of the data that is saved in the application's database, and let's us interact with 
objects of the model's type. They typically provide access to the properties of the entity, as well as provides 
convenience methods used in interaction with the entity. They also define the relationships between different entities. 
However, note that in Laravel, you still have to manually define the structure of the database. This is done with 
[migrations](migrations.md), which let's you do this independent of the database software used.

## Controller

The controller is the entity that handles requests to the website, and will typically correspond to a single/group of 
routes. The controller will normally load necessary data from the models, and then pass these data on to the view to be 
displayed to the user. This way, back-end functionality and front-end design is separated.

## View

Views are the representation of what is actually shown to the user when they load the webpage. In Laravel, the views 
are written in a templating language called Blade, which is basically normal PHP/HTML, but with some added 
functionality and syntactical sugar. More can be learnt in the 
[official documentation](https://laravel.com/docs/5.3/blade).
