<?php
use App\Models\Chombrain\Users;
use App\Models\Chombrain\PasswordResets;
use App\Models\Chombrain\FileUploadDb;
use App\Models\Chombrain\Test;
use App\Models\Chombrain\Users\UsersEventObserver;
use App\Models\Chombrain\PasswordResets\PasswordResetsEventObserver;
use App\Models\Chombrain\FileUploadDb\FileUploadDbEventObserver;
use App\Models\Chombrain\Test\TestEventObserver;

if (! function_exists('___registerModelObserver')) {
  function ___registerModelObserver() {
    
      Users::observe(UsersEventObserver::class);
    
      PasswordResets::observe(PasswordResetsEventObserver::class);
    
      FileUploadDb::observe(FileUploadDbEventObserver::class);
    
      Test::observe(TestEventObserver::class);
    
  }
}
