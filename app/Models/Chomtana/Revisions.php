<?php
namespace App\Models\Chomtana;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Revisions\RevisionsPermission;
use App\Models\Revisions\RevisionsAutofill;



class Revisions extends Model {

  
    use RevisionsPermission;
    use RevisionsAutofill;


  protected $table = 'revisions';

  

  /**
   * all columns of this table
   *
   */
  public $allColumns = ["reference_type","reference_id","header","body"];

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [];

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
    'header' => 'object',
'body' => 'object',
    
  ];

  /**
   * default value of each column (only if value of that column is null)
   *
   * @var array
   */
  protected $attributes = [
    'header' => '{}',
'body' => '{}'
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
    return $this->hasOne('App\Models\Chomtana\Revisions',"id","id");
  }

  public function view() {
    return $this->hasOne('App\Models\Chomtana\Revisions',"id","id");
  }

  public function refresh() {
    return Revisions::find($this->id);
  }

  

  
        public function users___()
        {
          return $this->belongsTo('App\Models\Chomtana\Users','reference_id');
        }
      
          public function getUsersAttribute() {
            if($this->reference_type == 'App\Models\Chomtana\Users') return $this->users___;
            return null;
          }
        
        public function reference() {
          return $this->morphTo();
        }
      

        public function password_resets___()
        {
          return $this->belongsTo('App\Models\Chomtana\PasswordResets','reference_id');
        }
      
          public function getPasswordResetsAttribute() {
            if($this->reference_type == 'App\Models\Chomtana\PasswordResets') return $this->password_resets___;
            return null;
          }
        

        public function failed_jobs___()
        {
          return $this->belongsTo('App\Models\Chomtana\FailedJobs','reference_id');
        }
      
          public function getFailedJobsAttribute() {
            if($this->reference_type == 'App\Models\Chomtana\FailedJobs') return $this->failed_jobs___;
            return null;
          }
        

        public function file_upload_db___()
        {
          return $this->belongsTo('App\Models\Chomtana\FileUploadDb','reference_id');
        }
      
          public function getFileUpload_dbAttribute() {
            if($this->reference_type == 'App\Models\Chomtana\FileUploadDb') return $this->file_upload_db___;
            return null;
          }
        

        public function otp___()
        {
          return $this->belongsTo('App\Models\Chomtana\Otp','reference_id');
        }
      
          public function getOtpAttribute() {
            if($this->reference_type == 'App\Models\Chomtana\Otp') return $this->otp___;
            return null;
          }
        


}
