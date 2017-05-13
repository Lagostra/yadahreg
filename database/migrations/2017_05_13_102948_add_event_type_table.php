<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddEventTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('event_types', function (Blueprint $table) {
            $table->string('name');
            $table->primary('name');
        });

        DB::table('event_types')->insert([
            ['name' => 'Øvelse'],
            ['name' => 'Opptreden'],
            ['name' => 'Tur'],
            ['name' => 'Annet']
        ]);

        Schema::table('members', function(Blueprint $table) {
            $table->string('type')->default('Øvelse');
            $table  ->foreign('type')
                    ->references('event_types')->on('name')
                    ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('event_types');
        Schema::table('members', function($table) {
            $table->dropColumn('type');
        });
    }
}
