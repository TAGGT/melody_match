<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Models\Post;

class PostController extends Controller
{
    //保存処理
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

    //投稿削除
    public function deletePost(Post $post)
    {
        $post->delete();
    }

    //投稿一覧取得
    public function getPosts()
    {
        $posts = Post::with('user')->with('genre')->get();
        return response()->json([
            'posts' => $posts
        ]);
    }

    //投稿取得
    public function getPost(Post $post)
    {
        $post = Post::with('user')->with('genre')->with('replies')->find($post->id);
        return response()->json([
            'post' => $post
        ]);
    }

    //投稿更新
    public function updatePost(Request $request, Post $post)
    {
        $post->update([
            'sound_path' => $request->sound_path,
            'explanation' => $request->explanation,
            'genre_id' => $request->genre_id
        ]);

        //後で消してもいいかも
        return response()->json([
            'post' => $post
        ]);
    }

    
}
