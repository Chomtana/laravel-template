<?php
namespace App\Models\Chomtana;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Otp\OtpPermission;
use App\Models\Otp\OtpAutofill;



class Otp extends Model {

  
    use OtpPermission;
    use OtpAutofill;


  protected $table = 'otp';

  

  /**
   * all columns of this table
   *
   */
  public $allColumns = ["otp_secret","otp_key","edit_histories"];

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = ["otp_secret","otp_key"];

  /**
   * The attributes that should be hidden for arrays.
   *
   * @var array
   */
  protected $hidden = [];

  /**
   * The attributes that should be cast to native types.
   *
   * @var array
   */
  protected $casts = [
    'edit_histories' => 'object',
    
  ];

  /**
   * default value of each column (only if value of that column is null)
   *
   * @var array
   */
  protected $attributes = [
    'edit_histories' => '[]'
  ];

  /**
   * The relations to eager load on every query.
   *
   * @var array
   */
  //protected $with = [];


  /**
   * The relationship counts that should be eager loaded on every query.
   *
   * @var array
   */
  protected $withCount = [];

  

  public $is_view = false;

  public function nonview() {
    return $this->hasOne('App\Models\Chomtana\Otp',"id","id");
  }

  public function view() {
    return $this->hasOne('App\Models\Chomtana\Otp',"id","id");
  }

  public function refresh() {
    return Otp::find($this->id);
  }

  
  public function revisions()
  {
    
      return $this->view->morphMany('App\Models\Chomtana\Revisions', 'otp', 'reference_type', 'reference_id');
    
  }


  public function users()
  {
    
      return $this->hasMany('App\Models\Chomtana\Users','otp_id');
    
  }



  

}
