<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function users()
    {
        $users = config('user.user');
        $users_sha1 = [];
        foreach($users as $user) {
            $users_sha1[$user] = sha1($user);
        }
        return $users_sha1;
    }

    public function isManager($user)
    {
        $manager = config('user.manager');
        if (array_search($user, $manager) !== false){
            return true;
        }
        return false;
    }

    public function isToken($request)
    {
        $token = $request->get('token', '');
        return array_search($token, $this->users()) === false ? false: true;
    }

    public function success($data = [])
    {
        return response()->json([
            'status' => true,
            'data' => $data
        ]);
    }

    public function error($msg = 'Error')
    {
        return response()->json([
            'status' => false,
            'data' => [],
            'msg' => $msg
        ]);

    }
}
