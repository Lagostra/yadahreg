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
        $start_date = $request->get('start_date');
        $end_date = $request->get('end_date');

        /*
         * Selects last 8 weeks if no dates are set, 8 weeks before end if only end is set,
         * and 8 weeks after start if only start is set.
         * Otherwise, uses provided dates.
         * */
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

        $events = Event::whereBetween('date', array($start_date, $end_date))->orderBy('date')->get();

        $counts = DB::table('event_member')
            ->select(['event_id'])
            ->addSelect([DB::raw('count(*) as count')])
            ->groupBy('event_id')->get();

        $datatable = Lava::DataTable();
        $datatable->addDateColumn('Dato')->addNumberColumn('Antall oppmøtte');

        foreach($events as $event) {
            $cur_count = 0;

            foreach($counts as $count) {
                if($count->event_id == $event->id) {
                    $cur_count = $count->count;
                    break;
                }
            }
            $datatable->addRow([date("Y-m-d", strtotime($event->date)), $cur_count]);
        }

        Lava::AreaChart('attendance', $datatable);

        return view('graphs.attendance');
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
