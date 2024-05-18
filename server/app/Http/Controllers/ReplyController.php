<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

use App\Models\Reply;
use App\Models\Post;

use Illuminate\Http\Request;

class ReplyController extends Controller
{
    public function storeReply(Request $request, Post $post)
    {
        $reply = Reply::create([
            'post_id' => $post->id,
            'user_id' => Auth::id(),
            'text' => $request->text
        ]);
        //　最適化の余地あり
        $reply = Reply::where('post_id', $post->id)->with('user')->get();

        return response()->json($reply);
    }


    public function getReply(Post $post)
    {
        $replies = Reply::where('post_id', $post->id)->with('user')->get();
        return response()->json($replies);
    }

    public function deleteReply(Reply $reply)
    {
        // user_idがログインユーザーのidと一致するかチェック
        if ($reply->user_id !== Auth::id()) {
            return response()->json([
                'message' => '不正なアクセスです'
            ]);
        }

        $reply->delete();
        return response()->json($reply);
    }

    //Route::put('/replies/{reply}', [ReplyController::class, 'updateReply']);

    public function updateReply(Request $request, Reply $reply)
    {
        // user_idがログインユーザーのidと一致するかチェック
        if ($reply->user_id !== Auth::id()) {
            return response()->json([
                'message' => '不正なアクセスです'
            ]);
        }

        $reply->update([
            'text' => $request->text
        ]);
        
        $reply->save();
        return response()->json($reply);
    }
}