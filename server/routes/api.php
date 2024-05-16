<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\PostController;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\GenreController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    // ***********🌚投稿関係ここから******************************************************************
    //　自身が作成したものを取得
    //Route::get('/posts/home', [PostController::class, 'getMyPosts']);

    //IDを指定して取得
    Route::get('/posts/{post}', [PostController::class, 'getOnePost']);

    // すべて取得
    Route::get('/posts/', [PostController::class, 'getPosts']);

    //　作成
    Route::post('/posts', [PostController::class, 'store']);

    //　更新

    //　削除
    Route::delete('/posts/{post}', [PostController::class, 'deletePost']);


    // *********** 🙆reply関係ここから******************************************************************
    //  作成
    Route::post('/replies/{post}', [ReplyController::class, 'storeReply']);
    //　取得
    Route::get('/replies/{post}', [ReplyController::class, 'getReply']);
    //  削除
    Route::delete('/replies/{reply}', [ReplyController::class, 'deleteReply']);


    // ***********⏺genre関係ここから******************************************************************
    Route::get('/genres', [GenreController::class, 'index']);

});