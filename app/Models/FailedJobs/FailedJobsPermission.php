<?php
namespace App\Models\FailedJobs;

use Illuminate\Support\Facades\Auth;
use App\Models\Chomtana\FailedJobs;

trait FailedJobsPermission {

  public static function canCreate(array &$data) {
    //if (Auth::user() && Auth::user()->is_admin) return true;

    return true;
  }

  public function canRead() {
    //if (Auth::user() && Auth::user()->is_admin) return true;

    return true;
  }

  public function canUpdate(array &$data) {
    //if (Auth::user() && Auth::user()->is_admin) return true;

    return true;
  }

  public function canDelete() {
    //if (Auth::user() && Auth::user()->is_admin) return true;

    return true;
  }

  public static function filterRecordRules($query) {
    return $query;
  }

}
