<?php

namespace App\Http\Controllers;

use App\Event;
use App\Member;
use Illuminate\Http\Request;

use App\Http\Requests;
use Illuminate\Support\Facades\DB;
use Lava;

class GraphController extends Controller {

    public function __construct() {
        $this->middleware('user');
    }

    public function attendance(Request $request) {
        $dates = $this->attendance_dates($request->get('start_date'), $request->get('end_date'));

        $events = Event::whereBetween('date', $dates)->orderBy('date')->get();

        $datatable = Lava::DataTable();
        $datatable->addDateColumn('Dato')->addNumberColumn('Antall oppmøtte');

        foreach($events as $event) {
            $datatable->addRow([date("Y-m-d", strtotime($event->date)), $event->participants->count()]);
        }

        Lava::AreaChart('attendance', $datatable);

        return view('graphs.attendance', $dates);
    }

    public function attendance_by_gender(Request $request){
        $dates = $this->attendance_dates($request->get('start_date'), $request->get('end_date'));

        $events = Event::whereBetween('date', $dates)->orderBy('date')->get();

        $datatable = Lava::DataTable();
        $datatable  ->addDateColumn('Dato')
                    ->addNumberColumn('Kvinner')
                    ->addNumberColumn('Menn')
                    ->addNumberColumn('Udefinert');

        foreach($events as $event) {
            $men = 0;
            $women = 0;
            $undef = 0;

            foreach ($event->participants as $member) {
                if ($member->gender == 'mann') {
                    $men++;
                } else if ($member->gender == 'kvinne') {
                    $women++;
                } else {
                    $undef++;
                }
            }

            $datatable->addRow([date("Y-m-d", strtotime($event->date)), $women, $men, $undef]);
        }

        Lava::LineChart('attendance', $datatable);
        return view('graphs.attendance-gender', $dates);
    }

    public function attendance_by_voice(Request $request){
        $dates = $this->attendance_dates($request->get('start_date'), $request->get('end_date'));

        $events = Event::whereBetween('date', $dates)->orderBy('date')->get();

        $datatable = Lava::DataTable();
        $datatable  ->addDateColumn('Dato')
            ->addNumberColumn('Sopran')
            ->addNumberColumn('Alt')
            ->addNumberColumn('Tenor')
            ->addNumberColumn('Bass')
            ->addNumberColumn('Udefinert');

        foreach($events as $event) {
            $soprano = 0;
            $alto = 0;
            $tenor = 0;
            $basso = 0;
            $undef = 0;

            foreach ($event->participants as $member) {
                if ($member->preferred_voice == 'sopran') {
                    $soprano++;
                } else if ($member->preferred_voice == 'alt') {
                    $alto++;
                } else if ($member->preferred_voice == 'tenor') {
                    $tenor++;
                } else if ($member->preferred_voice == 'bass') {
                    $basso++;
                }  else {
                    $undef++;
                }
            }

            $datatable->addRow([date("Y-m-d", strtotime($event->date)), $soprano, $alto, $tenor, $basso, $undef]);
        }

        Lava::LineChart('attendance', $datatable);
        return view('graphs.attendance-voice', $dates);
    }

    /*
         * Selects last 8 weeks if no dates are set, 8 weeks before end if only end is set,
         * and 8 weeks after start if only start is set.
         * Otherwise, uses provided dates.
         * */
    private function attendance_dates($start_date, $end_date) {
        if($start_date == "" && $end_date == "") {
            $end_date = date("Y-m-d");
            $start_date = date("Y-m-d", strtotime("-" . 8 * 7 . "days")); // Date 8 weeks before today
        } else if($start_date == "") {
            $start_date = date("Y-m-d", strtotime($end_date . " -" . 8 * 7 . "days")); // Date 8 weeks before end
            $end_date = date("Y-m-d", strtotime($end_date));
        } else if($end_date == "") {
            $end_date = date("Y-m-d", strtotime($start_date . " +" . 8 * 7 . "days")); // Date 8 weeks after start
            $start_date = date("Y-m-d", strtotime($start_date));
        } else {
            $end_date = date("Y-m-d", strtotime($end_date));
            $start_date = date("Y-m-d", strtotime($start_date));
        }

        return array('start_date' => $start_date, 'end_date' => $end_date);
    }

    public function gender(Request $request) {
        if($request->get('include_inactive')) {
            $members = Member::get();
        } else {
            $members = Member::where('active', true)->get();
        }

        $male = 0;
        $female = 0;
        $undef = 0;

        foreach($members as $member) {
            if($member->gender == 'mann') {
                $male++;
            } else if($member->gender == 'kvinne') {
                $female++;
            } else {
                $undef++;
            }
        }

        $datatable = Lava::DataTable();
        $datatable  ->addStringColumn('Gruppe')
                    ->addNumberColumn('Antall')
                    ->addRow(['Menn',$male])
                    ->addRow(['Kvinner', $female])
                    ->addRow(['Udefinert', $undef]);

        Lava::ColumnChart('gender', $datatable, [
                'legend' => 'none',
            ]);

        return view('graphs.gender');
    }

    public function voice(Request $request) {
        if($request->get('include_inactive')) {
            $members = Member::get();
        } else {
            $members = Member::where('active', true)->get();
        }

        $soprano = 0;
        $alto = 0;
        $tenor = 0;
        $basso = 0;
        $undef = 0;

        foreach($members as $member) {
            if($member->preferred_voice == 'sopran') {
                $soprano++;
            } else if($member->preferred_voice == 'alt') {
                $alto++;
            } else if($member->preferred_voice == 'tenor') {
                $tenor++;
            } else if($member->preferred_voice == 'bass') {
                $basso++;
            } else {
                $undef++;
            }
        }

        $datatable = Lava::DataTable();
        $datatable  ->addStringColumn('Gruppe')
            ->addNumberColumn('Antall')
            ->addRow(['Sopran',$soprano])
            ->addRow(['Alt', $alto])
            ->addRow(['Tenor', $tenor])
            ->addRow(['Bass', $basso])
            ->addRow(['Udefinert', $undef]);

        Lava::ColumnChart('voice', $datatable, [
            'legend' => 'none',
        ]);

        return view('graphs.voice');
    }

}
