<?php
/**
 * Created by PhpStorm.
 * User: eivind
 * Date: 17/09/2016
 * Time: 19:00
 */

namespace App\Http\Controllers\Auth;


use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Validator;

class EditController extends Controller {

    public function __construct() {
        $this->middleware('auth');
    }

    public function index() {
        return view('auth.edit');
    }

    public function update_profile(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users,email,'. Auth::user()->id.',id',
        ]);

        if ($validator->fails()) {
            return redirect(url('/profile/edit'))
                ->withErrors($validator)
                ->withInput();
        }

        $user = Auth::user();
        $user->name = $request->get('name');
        $user->email = $request->get('email');
        $user->save();
        return redirect(url('/home'));
    }

    public function password() {
        return view('auth.password');
    }

    public function update_password(Request $request) {
        $validator = Validator::make($request->all(), [
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return redirect(url('/profile/edit/password'))
                ->withErrors($validator)
                ->withInput();
        }

        $user = Auth::user();
        if(!Hash::check($request->get('old_password'), $user->password) && !$user->password == null) {
            return redirect(url('/profile/edit/password'))->withErrors(array('old_password' => 'Oppgitt passord stemmer ikke overens med eksisterende passord.'));
        }
        $user->password = Hash::make($request->get('password'));
        $user->save();
        return redirect('/home');
    }

    public function token() {
        return view('auth.token');
    }

    public function generate_token() {
        if(!Auth::user()->is_user())
            return redirect(url('/home'));

        Auth::user()->api_token = str_random(60);
        Auth::user()->save();

        return redirect(url('/profile/token'));
    }

}