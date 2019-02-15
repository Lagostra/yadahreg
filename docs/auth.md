# Authentication
[<-- Back to index](index.md)

The app uses Laravel's built-in auth system. The documentation for this can be found 
[here](https://laravel.com/docs/5.3/authentication). The controllers responsible for this are located in 
Controllers/Auth, and should most of the time be left untouched. Corresponding views are found in views/auth, and these 
can be changed to style the different views relating to authentication.

To protect different parts of the app, for example a route or a controller (the latter is what is mainly used in this 
app atm), we use middleware. The auth framework provides to different middleware: "auth", which requires a logged-in 
user, and "guest", which requires no user to be logged in (useful for login page). In addition, the app uses two custom 
middleware: "admin", which requires the user to be an admin, and "user", which requires the user to be an activated 
user (or admin).

A middleware can be attached to a controller using the following line in the controller's constructor: 
`$this->middleware('<middleware-name>');`

## Google Authentication
The Google authentication uses a module named [Socialite](https://github.com/laravel/socialite). The actual 
authentication is handled via the SocialAuthController, while the SocialAccountService (located in app folder) provides 
an interface to the database. The link between users and their Google accounts are actually just a field in the users 
table, while handshaking etc. is handled by Socialite.

There are a couple of configuration fields located in config/services.php, where the callback url passed to Google 
(<app root>/callback by default), in addition to the client-id and -secret, are defined. These are the values you would 
change to tie the authentication to another Google developer account.