package com.sonnguyen.laptopshop.service;

import com.sonnguyen.laptopshop.model.WishlistItem;

import java.util.List;

public interface WishlistService {
    List<WishlistItem> getMyWishlist();
    WishlistItem addToWishlist(Long productId);
    void removeFromWishlist(Long productId);
}
