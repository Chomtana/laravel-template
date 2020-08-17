<?php
namespace App\Models\Users;

use Illuminate\Support\Facades\Auth;
use App\Models\Chomtana\Users;

trait UsersPermission {

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
