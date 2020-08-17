<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRevisionsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('revisions', function (Blueprint $table) {
      $table->id();
      $table->string('reference_type')->index();
$table->string('reference_id')->index();
$table->json('header');
$table->json('body');
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
    Schema::dropIfExists('revisions');
  }

}
