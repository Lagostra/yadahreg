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

Route::post('/events/delete', 'EventController@delete');
Route::get('/events/add', 'EventController@add');
Route::post('/events/add', 'EventController@do_add');
Route::post('/events/edit', 'EventController@do_edit');
Route::get('/events/edit/{id}', 'EventController@edit');
Route::post('/events/addtoday', 'EventController@add_today');

Route::post('/registration', 'RegistrationController@set_present');
Route::get('/registration/{event_id?}', 'RegistrationController@index');

Route::get('/members/add', 'MemberController@add');
Route::post('/members/add', 'MemberController@do_add');
Route::get('/members/edit/{id}', 'MemberController@edit');
Route::post('/members/edit', 'MemberController@do_edit');
Route::post('/members/delete', 'MemberController@delete');
Route::get('/members/{active_only?}', 'MemberController@index');

Route::post('/semesters/delete', 'SemesterController@delete');
Route::get('/semesters/add', 'SemesterController@add');
Route::post('/semesters/add', 'SemesterController@do_add');
Route::post('/semesters/edit', 'SemesterController@do_edit');
Route::get('/semesters/edit/{id}', 'SemesterController@edit');

Route::post('/payment', 'PaymentController@set_paid');
Route::get('/payment/{id?}/{show_inactive?}', 'PaymentController@index');

Route::get('/overview/attendance', 'OverviewController@list_events');
Route::get('/overview/payment', 'OverviewController@payment');
Route::get('/overview/mailing-list', 'OverviewController@mail_list');
Route::get('/overview/allergies', 'OverviewController@allergies');

Route::get('/graphs/attendance', 'GraphController@attendance');
Route::get('/graphs/attendance-by-gender', 'GraphController@attendance_by_gender');
Route::get('/graphs/attendance-by-voice', 'GraphController@attendance_by_voice');
Route::get('/graphs/gender', 'GraphController@gender');
Route::get('/graphs/voice', 'GraphController@voice');

// Google Auth
Route::get('/redirect', 'SocialAuthController@redirect');
Route::get('/callback', 'SocialAuthController@callback');
