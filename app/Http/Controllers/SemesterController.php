<?php

namespace App\Http\Controllers;

use App\Semester;
use Illuminate\Http\Request;

use App\Http\Requests;
use Validator;

class SemesterController extends Controller {

    public function __construct() {
        $this->middleware('user');
    }

    public function add() {
        return view('semesters.add');
    }

    public function do_add(Request $request) {
        $validator = Validator::make($request->all(), [
            'start_date' => 'date|required',
            'end_date' => 'date|required',
            'title' => 'string|max:50|required',
        ]);

        if ($validator->fails()) {
            if($validator)
                echo "Validation error:";
            foreach ($validator->errors()->all() as $error) {
                echo $error;
            }
            return;
        }

        $semester = new Semester();
        $semester->start_date = date("Y-m-d", strtotime($request->get('start_date')));
        $semester->end_date = date("Y-m-d", strtotime($request->get('end_date')));
        $semester->title = $request->get('title');
        $semester->save();

        return redirect(url('/payment/'.$semester->id));
    }

    public function edit($id) {
        $semester = Semester::find($id);

        if($semester == null)
            return redirect(url('/payment'));

        return view('semesters.edit', array('semester' => $semester));
    }

    public function do_edit(Request $request) {
        $validator = Validator::make($request->all(), [
            'start_date' => 'date|required',
            'end_date' => 'date|required',
            'title' => 'string|max:50|required',
        ]);

        if ($validator->fails()) {
            if($validator)
                echo "Validation error:";
            foreach ($validator->errors()->all() as $error) {
                echo $error;
            }
            return;
        }

        $semester = Semester::find($request->get('id'));
        $semester->start_date = date("Y-m-d", strtotime($request->get('start_date')));
        $semester->end_date = date("Y-m-d", strtotime($request->get('end_date')));
        $semester->title = $request->get('title');
        $semester->save();

        return redirect(url('/payment/'.$semester->id));
    }

    public function delete(Request $request) {
        $semester = Semester::find($request->get('id'));
        $semester->delete();

        return redirect(url('/payment'));
    }

}
