<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RelationUsersTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::table('users', function (Blueprint $table) {
      
      $table->foreign('otp_id')
            ->references('id')
            ->on('otp')
            ->onDelete('CASCADE')
            ->onUpdate('CASCADE');

      //$table->index('otp_id');
            
      

            
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('users', function (Blueprint $table) {
      
      $table->dropForeign(['otp_id']);
            
      
    });
  }

}
