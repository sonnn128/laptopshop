package com.sonnguyen.laptopshop.controller;

import com.sonnguyen.laptopshop.model.WishlistItem;
import com.sonnguyen.laptopshop.payload.response.ApiResponse;
import com.sonnguyen.laptopshop.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<ApiResponse> myWishlist() {
        List<WishlistItem> items = wishlistService.getMyWishlist();
        return ResponseEntity.ok(ApiResponse.<List<WishlistItem>>builder().success(true).data(items).build());
    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse> add(@PathVariable Long productId) {
        WishlistItem item = wishlistService.addToWishlist(productId);
        return ResponseEntity.ok(ApiResponse.<WishlistItem>builder().success(true).data(item).build());
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse> remove(@PathVariable Long productId) {
        wishlistService.removeFromWishlist(productId);
        return ResponseEntity.ok(ApiResponse.<String>builder().success(true).data("Removed").build());
    }
}
