<?php

use App\Models\Chomtana\Otp;
use App\User;

Route::group(['as' => 'auth.'], function () {

  Route::post('login', 'AuthController@login');
  Route::post('/register', 'AuthController@register');
  Route::middleware('auth:api')->get('/me', 'AuthController@me');

});
