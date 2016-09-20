<?php

namespace App\Http\Controllers;

use App\Event;
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

        Lava::LineChart('attendance', $datatable);

        return view('graphs.attendance');
    }

}
