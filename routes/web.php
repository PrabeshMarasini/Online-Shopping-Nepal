<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;

// API route
Route::prefix('api')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/cart/add', [CartController::class, 'add']);
    Route::post('/cart/update', [CartController::class, 'update']);
    Route::post('/cart/remove', [CartController::class, 'remove']);
    Route::post('/cart/clear', [CartController::class, 'clear']);
    Route::get('/cart', [CartController::class, 'get']);
    Route::post('/cart/apply-discount', [CartController::class, 'applyDiscount']);
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');