<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;


use App\Models\Post;

class PostController extends Controller
{
    //保存処理
    public function store(Request $request)
    {
        //Cloudinaryに音声ファイルをアップロード
        $audioFile = $request->file('audio');

        // Cloudinaryにアップロード
        $uploadedFileUrl = Cloudinary::uploadFile($audioFile->getRealPath(), [
            'folder' => 'audios',
        ])->getSecurePath();

        //投稿データを保存
        $post = Post::create([
            'user_id' => Auth::id(),
            'sound_path' => $uploadedFileUrl,
            'explanation' => $request->explanation,
            'genre_id' => $request->genre_id
        ]);

        return response()->json(['post' => $post]);

    }

    //投稿削除
    public function deletePost(Post $post)
    {
        // user_idがログインユーザーのidと一致するかチェック
        if ($post->user_id !== Auth::id()) {
            return response()->json([
                'message' => '不正なアクセスです'
            ]);
        }
        
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

    //自身の投稿取得
    public function getMyPosts()
    {
        $posts = Post::with('user')->with('genre')->where('user_id', Auth::id())->get();
        return response()->json([
            'posts' => $posts
        ]);
    }

    //投稿取得
    public function getOnePost(Post $post)
    {
        $post = Post::with('user')->with('genre')->find($post->id);
        return response()->json([
            'post' => $post
        ]);
    }

    //投稿更新
    public function updatePost(Request $request, Post $post)
    {
        // user_idがログインユーザーのidと一致するかチェック
        if ($post->user_id !== Auth::id()) {
            return response()->json([
                'message' => '不正なアクセスです'
            ]);
        }

        $post->update([
            'explanation' => $request->explanation,
            'genre_id' => $request->genre_id
        ]);

        //後で消してもいいかも
        return response()->json([
            'post' => $post
        ]);
    }

    
}
