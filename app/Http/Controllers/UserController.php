<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller{
    public function token(Request $request)
    {
        $name = $request->post('username', '');
        $users = $this->users();
        if (! array_key_exists($name, $users)) {
            return $this->error('错误的用户');
        }
        return $this->success(['token'=> $users[$name], 'isManager'=>$this->isManager($name) ? 1: 0]);
    }
}