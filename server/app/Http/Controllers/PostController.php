<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Models\Post;

class PostController extends Controller
{
    //
    public function store(Request $request)
    {
        $post = Post::create([
            'user_id' => Auth::id(),
            'sound_path' => $request->sound_path,
            'explanation' => $request->explanation,
            'genre_id' => $request->genre_id
        ]);
        
        return response()->json([
            'post' => $post
        ]);
    }
}
