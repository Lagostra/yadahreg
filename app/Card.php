<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Card extends Model{

    public function owner() {
        return $this->belongsTo('App\Member');
    }

}
