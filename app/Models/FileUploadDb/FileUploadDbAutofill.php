<?php
namespace App\Models\FileUploadDb;

use Illuminate\Support\Facades\Auth;
use App\Models\Chomtana\FileUploadDb;

trait FileUploadDbAutofill {

  public function onRead(FileUploadDb &$data) {

  }

  public static function beforeList() {

  }

  public static function afterList(&$data) {

  }

  public static function beforeCreate(array &$data) {

  }

  public function createAutofill(array &$data, FileUploadDb &$currdata) {

  }

  public function afterCreate(FileUploadDb &$data) {

  }

  public function beforeUpdate(array &$data, FileUploadDb &$olddata) {

  }

  public function updateAutofill(array &$data, FileUploadDb &$currdata) {

  }

  public function afterUpdate(FileUploadDb &$data) {

  }

  public function beforeDelete(FileUploadDb &$data) {

  }

  public function afterDelete($id) {

  }

}
