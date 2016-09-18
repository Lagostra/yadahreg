<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Auth::routes();

Route::get('/', function () {
    return redirect()->to('/login');
});

Route::get('/home', 'HomeController@index');

Route::get('/profile/edit', 'Auth\EditController@index');
Route::post('/profile/edit', 'Auth\EditController@update_profile');
Route::get('/profile/edit/password', 'Auth\EditController@password');
Route::post('/profile/edit/password', 'Auth\EditController@update_password');

Route::get('/users', 'UserController@index');
Route::get('/users/edit/{id}', 'UserController@edit');
Route::post('/users/edit', 'UserController@save');
Route::post('/users/delete', 'UserController@delete');

Route::post('/registration/today', 'RegistrationController@add_today');
Route::post('/registration', 'RegistrationController@set_present');
Route::get('/registration/{event_id?}', 'RegistrationController@index');

Route::get('/members/add', 'MemberController@add');
Route::post('/members/add', 'MemberController@do_add');
Route::get('/members/edit/{id}', 'MemberController@edit');
Route::post('/members/edit', 'MemberController@do_edit');
Route::post('/members/delete', 'MemberController@delete');
Route::get('/members/{active_only?}', 'MemberController@index');

// Google Auth
Route::get('/redirect', 'SocialAuthController@redirect');
Route::get('/callback', 'SocialAuthController@callback');
