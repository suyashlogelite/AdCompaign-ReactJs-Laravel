<?php

use App\Http\Controllers\Api\ImageController;
use App\Models\Images;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('images', [ImageController::class, 'view']);
Route::post('images', [ImageController::class, 'store']);
Route::delete('images/{id}/delete', [ImageController::class, 'destroy']);
Route::get('images/{id}/show', [ImageController::class, 'show']);
Route::get('images/{id}/edit', [ImageController::class, 'edit']);
Route::post('images/{id}/edit', [ImageController::class, 'update']);
Route::put('banner/{id}/status', [ImageController::class, 'status']);
