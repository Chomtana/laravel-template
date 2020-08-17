<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chomtana\Otp;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
  public function login(Request $request) {
    $credentials = $request->only('username', 'email', 'mobile_number', 'password');
    if (Auth::attempt($credentials)) {
      return response()->json([
        'user_id' => Auth::id(),
        'token' => Auth::user()->api_token
      ]);
    }

    return response()->json([
      'message' => 'อีเมล หรือ รหัสผ่าน ไม่ถูกต้อง'
    ], 403);
  }

  public function register(Request $request) {
    $otp = Otp::create([
      'otp_secret' => Str::random(32),
      'otp_key' => mt_rand(100000, 999999)
    ]);

    $user = new User([
      'username' => $request['username'],
      'email' => $request['email'],
      'mobile_number' => $request['mobile_number'],
      'password' => Hash::make($request['password']),
      'otp_id' => $otp->id,
      'api_token' => Str::random(32),
    ]);

    $user->api_token = Str::random(32);

    $user->save();

    return response()->json($user);
  }

  public function me(Request $request) {
    return $request->user();
  }
}
