# Setup
[<-- Back to index](index.md)

To set up the app in a new environment, you first of all need to install Laravel, and create a new project. A detailed 
guide can be found in the [official documentation](https://laravel.com/docs/5.3/installation), but here is a short 
summary:

1.  Make sure you have PHP CLI installed
2. Install [Composer](https://getcomposer.org/), and make sure it's added to your system PATH environment variable.
3. Run the following command to get the Laravel installer: `composer global require laravel/installer`
4. Create a new project with the following command: `laravel new <project name>`
5. Clone the repository into the newly-made directory
6. Run `composer update` to download dependencies.

You will then need to change the .env-file in the root directory of the project to correspond with your environment. 
Simply copy the .env.example-file to .env, and change the needed fields. At least the app url and the database will 
probably need to be changed. (SQLite is a good, lightweight database alternative for development.) If you want to use
Google for authentication, you also need to set the Google Auth client id and secret.

To run the project, you can simply open a terminal window in the project root, and run the command `php artisan serve`. 
This launches a simple server that ships with Laravel, which should be enough for most situations encountered during 
development. To deploy it on another webserver, the public folder needs to be defined as document root. Alternatively, 
if editing of the server config is for some reason not possible, installing the app outside of the document root and 
creating a symbolic link is a possibility. More information can be found in the 
[documentation](https://laravel.com/docs/5.3).