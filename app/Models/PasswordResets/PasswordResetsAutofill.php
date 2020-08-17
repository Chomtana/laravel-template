<?php
namespace App\Models\PasswordResets;

use Illuminate\Support\Facades\Auth;
use App\Models\Chomtana\PasswordResets;

trait PasswordResetsAutofill {

  public function onRead(PasswordResets &$data) {

  }

  public static function beforeList() {

  }

  public static function afterList(&$data) {

  }

  public static function beforeCreate(array &$data) {

  }

  public function createAutofill(array &$data, PasswordResets &$currdata) {

  }

  public function afterCreate(PasswordResets &$data) {

  }

  public function beforeUpdate(array &$data, PasswordResets &$olddata) {

  }

  public function updateAutofill(array &$data, PasswordResets &$currdata) {

  }

  public function afterUpdate(PasswordResets &$data) {

  }

  public function beforeDelete(PasswordResets &$data) {

  }

  public function afterDelete($id) {

  }

}
