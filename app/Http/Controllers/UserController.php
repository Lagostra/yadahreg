<?php
/**
 * Created by PhpStorm.
 * User: eivind
 * Date: 17/09/2016
 * Time: 20:08
 */

namespace App\Http\Controllers;


use Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;

class UserController extends Controller {

    public function __construct() {
        $this->middleware('admin');
    }

    public function index() {
        $users = User::orderBy('name')->get();

        return view('users.list', ['users' => $users]);
    }

    public function edit($id) {
        $user = User::find($id);

        if(!$user) {
            return redirect(url('/users'));
        }

        return view('users.edit', ['user' => $user]);
    }

    public function save(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users,email,'. $request->get('id').',id',
            'role' => array('required', 'regex:[unactivated|user|admin]'),
        ]);

        if ($validator->fails()) {
            if($validator)
            return redirect(url('/users/edit/' . $request->get('id')))
                ->withErrors($validator)
                ->withInput();
        }

        $user = User::find($request->get('id'));
        $user->name = $request->get('name');
        $user->email = $request->get('email');
        $user->role = $request->get('role');
        $user->save();
        return redirect(url('/users'));
    }

    public function delete(Request $request) {
        $user = User::find($request->get('id'));
        $user->delete();
        return redirect(url('/users'));
    }

}