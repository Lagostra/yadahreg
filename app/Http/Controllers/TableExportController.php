<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use App\Member;
use App\Event;
use App\Semester;

class TableExportController extends Controller {

    public function __construct(){
        $this->middleware('user');
    }

    public function attendance(Request $request) {
        $show_inactive = $request->get('show_inactive');
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

        $filename = "Yadah_Oppmøte_" . $start_date . "_to_" . $end_date . ".csv";

        if($show_inactive)
            $members = Member::orderBy('first_name')->get();
        else
            $members = Member::where('active', true)->orderBy('first_name')->get();

        $events = Event::whereBetween('date', array($start_date, $end_date))->orderBy('date')->get();

        $result = array();
        foreach($members as $member) {
            $row = array("Navn" => $member->first_name . " " . $member->last_name);
            foreach($events as $event) {
                $unpresent = $member->not_present_events->contains($event);
                $present = $member->events->contains($event);
                $row[$event->date] = $unpresent ? 'N' : ($present ? 'Y' : '');
            }
            array_push($result, $row);
        }

        return $this->array_to_csv($result, $filename);
    }

    public function payment(Request $request) {
        $show_inactive = $request->get('show_inactive');
        $start_date = $request->get('start_date');
        $end_date = $request->get('end_date');

        if($start_date == "" && $end_date == "") {
            $end_date = date("Y-m-d", strtotime("+" . 6 . "months"));
            $start_date = date("Y-m-d", strtotime("-" . 2 . "years"));
        } else if($start_date == "") {
            $start_date = date("Y-m-d", strtotime($end_date . " -" . 2 . "years"));
            $end_date = date("Y-m-d", strtotime($end_date));
        } else if($end_date == "") {
            $end_date = date("Y-m-d", strtotime($start_date . " +" . 2 . "years"));
            $start_date = date("Y-m-d", strtotime($start_date));
        } else {
            $end_date = date("Y-m-d", strtotime($end_date));
            $start_date = date("Y-m-d", strtotime($start_date));
        }

        $filename = "Yadah_Betaling_" . $start_date . "_to_" . $end_date . ".csv";

        if($show_inactive)
            $members = Member::orderBy('first_name')->get();
        else
            $members = Member::where('active', true)->orderBy('first_name')->get();

        $semesters = Semester::whereBetween('end_date', array($start_date, $end_date))->orderBy('end_date')->get();

        $result = array();
        foreach($members as $member) {
            $row = array("Navn" => $member->first_name . " " . $member->last_name);
            foreach($semesters as $semester) {
                $paid = $member->paid_semesters->contains($semester);
                $row[$semester->title] = $paid ? 'Y' : '';
            }
            array_push($result, $row);
        }

        $this->array_to_csv($result, $filename);
    }

    public function contact_list(Request $request) {
        $filename = "Yadah_Kontaktliste_" . date('Ymd') . ".csv";
        if($request->get('include_inactive')) {
            $members = Member::orderBy('first_name')->get();
        } else {
            $members = Member::where('active', true)->orderBy('first_name')->get();
        }
        $result = array();
        foreach($members as $member) {
            array_push($result, array('Fornavn' => $member->first_name, 'Etternavn' => $member->last_name,
                                        'Telefon' => $member->phone, 'E-post' => $member->email));
        }
        return $this->array_to_csv($result, $filename);
    }

    public function allergies(Request $request) {
        $filename = "Yadah_Allergier_" . date('Ymd') . ".csv";
        if($request->get('include_inactive')) {
            $members = Member::where('allergies', '!=', '')->orderBy('first_name')->get();
        } else {
            $members = Member::where('allergies', '!=', '')->where('active', true)->orderBy('first_name')->get();
        }

        $result = array();
        foreach($members as $member) {
            array_push($result, array('Navn' => $member->first_name . " " . $member->last_name,
                                        'Allergier' => $member->allergies));
        }

        return $this->array_to_csv($result, $filename);
    }

    // Original PHP code by Chirp Internet: www.chirp.com.au
    // Please acknowledge use of this code by including this header.
    private function cleanData(&$str) {
        if($str == 't') $str = 'TRUE';
        if($str == 'f') $str = 'FALSE';
        if(preg_match("/^0/", $str) || preg_match("/^\+?\d{8,}$/", $str) || preg_match("/^\d{4}.\d{1,2}.\d{1,2}/", $str)) {
            $str = "'$str";
        }
        if(strstr($str, '"')) $str = '"' . str_replace('"', '""', $str) . '"';
    }

    private function array_to_csv($array, $filename) {
        header("Content-Disposition: attachment; filename=\"$filename\"");
        header("Content-Type: text/csv");

        $flag = false;
        foreach($array as $row) {
            if(!$flag) {
                // display field/column names as first row
                echo implode(",", array_keys($row)) . "\r\n";
                $flag = true;
            }
            array_walk($row, array($this, 'cleanData'));
            echo '"'.implode('","', array_values($row)) . "\"\r\n";
        }
    }
}
