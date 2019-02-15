# Migrations
[<-- Back to index](index.md)

Migrations are what is used to build the database structure in a Laravel app. Migrations are used both when a table is 
created, and when changes to a table is needed. Migrations define both and "up" and "down" method, which will be used 
when the changes are applied and redone, respectively. This lets us roll back changes.

Migrations are independent of individual database software, which let's us use different software in different 
environments; e.g. SQLite on local development machines, and MySQL in production. They also make updating several 
databases to support new versions of the app a cinch.

All new migrations can be applied with the command `php artisan migrate`

Learn more about migrations in the [official documentation](https://laravel.com/docs/5.3/migrations).