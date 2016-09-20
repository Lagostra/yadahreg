<?php

namespace App\Http\Controllers;

use App\Semester;
use App\Member;
use Illuminate\Http\Request;

use App\Http\Requests;
use Validator;

class PaymentController extends Controller {
    public function __construct() {
        $this->middleware('user');
    }

    public function index($semester_id = -1) {
        $members = Member::where('active', true)->orderBy('first_name', 'ASC')->get();
        $semesters = Semester::orderBy('end_date', 'desc')->get();

        $chosen_semester = Semester::find($semester_id);

        if($chosen_semester == null) {
            $chosen_semester = $semesters->first();
        }

        foreach($members as $member) {
            foreach($member->paid_semesters as $semester) {
                if($semester->id == $chosen_semester->id) {
                    $member->paid = true;
                    break;
                }
            }
        }

        return view('payment.index', array('members' => $members, 'chosen_semester' => $chosen_semester, 'semesters' => $semesters));
    }

    public function set_paid(Request $request) {
        $validator = Validator::make($request->all(), [
            'member_id' => 'numeric|required',
            'semester_id' => 'numeric|required',
            'status' => 'boolean|required',
        ]);

        if ($validator->fails()) {
            if($validator)
                echo "Validation error:";
            foreach ($validator->errors()->all() as $error) {
                echo $error;
            }
            return;
        }

        $member = Member::find($request->get('member_id'));
        $semester = Semester::find($request->get('semester_id'));
        if($request->get('status')) {
            $member->paid_semesters()->attach($semester);
        } else {
            $member->paid_semesters()->detach($semester);
        }
    }
}
