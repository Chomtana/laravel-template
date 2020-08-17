<?php
namespace App\Models\FailedJobs;

use Illuminate\Support\Facades\Auth;
use App\Models\Chomtana\FailedJobs;

trait FailedJobsAutofill {

  public function onRead(FailedJobs &$data) {

  }

  public static function beforeList() {

  }

  public static function afterList(&$data) {

  }

  public static function beforeCreate(array &$data) {

  }

  public function createAutofill(array &$data, FailedJobs &$currdata) {

  }

  public function afterCreate(FailedJobs &$data) {

  }

  public function beforeUpdate(array &$data, FailedJobs &$olddata) {

  }

  public function updateAutofill(array &$data, FailedJobs &$currdata) {

  }

  public function afterUpdate(FailedJobs &$data) {

  }

  public function beforeDelete(FailedJobs &$data) {

  }

  public function afterDelete($id) {

  }

}
