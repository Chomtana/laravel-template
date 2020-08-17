<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFileUploadDbTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('file_upload_db', function (Blueprint $table) {
      $table->id();
      $table->string('url');
$table->string('filepath');
$table->string('type');
$table->string('extension');
$table->string('mime');
$table->string('original_name');
$table->integer('size');
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
    Schema::dropIfExists('file_upload_db');
  }

}
