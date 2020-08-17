<?php
namespace App\Models\Otp;

use Illuminate\Support\Facades\Auth;
use App\Models\Chomtana\Otp;

trait OtpAutofill {

  public function onRead(Otp &$data) {

  }

  public static function beforeList() {

  }

  public static function afterList(&$data) {

  }

  public static function beforeCreate(array &$data) {

  }

  public function createAutofill(array &$data, Otp &$currdata) {

  }

  public function afterCreate(Otp &$data) {

  }

  public function beforeUpdate(array &$data, Otp &$olddata) {

  }

  public function updateAutofill(array &$data, Otp &$currdata) {

  }

  public function afterUpdate(Otp &$data) {

  }

  public function beforeDelete(Otp &$data) {

  }

  public function afterDelete($id) {

  }

}
