<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOtpTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('otp', function (Blueprint $table) {
      $table->id();
      $table->string('otp_secret')->nullable();
$table->string('otp_key');
$table->json('edit_histories')->nullable();
      $table->timestamps();

      
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('otp');
  }

}
