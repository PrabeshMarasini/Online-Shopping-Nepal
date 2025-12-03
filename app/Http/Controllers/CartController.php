<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class CartController extends Controller
{
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'title' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'nullable|string',
        ]);

        $cart = Session::get('cart', []);
        $productId = $request->product_id;

        if (isset($cart[$productId])) {
            $cart[$productId]['quantity']++;
        } else {
            $cart[$productId] = [
                'id' => $productId,
                'title' => $request->title,
                'price' => $request->price,
                'image' => $request->image,
                'quantity' => 1,
            ];
        }

        Session::put('cart', $cart);

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart',
            'cart' => array_values($cart)
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'quantity' => 'required|integer|min:0',
        ]);

        $cart = Session::get('cart', []);
        $productId = $request->product_id;

        if (isset($cart[$productId])) {
            if ($request->quantity > 0) {
                $cart[$productId]['quantity'] = $request->quantity;
            } else {
                unset($cart[$productId]);
            }

            Session::put('cart', $cart);

            return response()->json([
                'success' => true,
                'message' => 'Cart updated',
                'cart' => array_values($cart)
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Product not found in cart'
        ], 404);
    }

    public function remove(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
        ]);

        $cart = Session::get('cart', []);
        $productId = $request->product_id;

        if (isset($cart[$productId])) {
            unset($cart[$productId]);
            Session::put('cart', $cart);

            return response()->json([
                'success' => true,
                'message' => 'Product removed from cart',
                'cart' => array_values($cart)
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Product not found in cart'
        ], 404);
    }

    public function clear()
    {
        Session::forget('cart');
        Session::forget('discount');

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared',
            'cart' => []
        ]);
    }

    public function get()
    {
        $cart = Session::get('cart', []);
        $discount = Session::get('discount', ['code' => '', 'percentage' => 0]);

        return response()->json([
            'success' => true,
            'cart' => array_values($cart),
            'discount' => $discount
        ]);
    }

    public function applyDiscount(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $code = trim($request->code);
        $validCodes = [
            'CODE10' => 10,
            'CODE20' => 20,
        ];

        if (array_key_exists($code, $validCodes)) {
            Session::put('discount', [
                'code' => $code,
                'percentage' => $validCodes[$code]
            ]);

            return response()->json([
                'success' => true,
                'message' => $validCodes[$code] . '% discount applied!',
                'discount' => [
                    'code' => $code,
                    'percentage' => $validCodes[$code]
                ]
            ]);
        }

        Session::forget('discount');

        return response()->json([
            'success' => false,
            'message' => 'Invalid code',
            'discount' => ['code' => '', 'percentage' => 0]
        ]);
    }
}