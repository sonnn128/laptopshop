package com.sonnguyen.laptopshop.service.impl;

import com.sonnguyen.laptopshop.model.Product;
import com.sonnguyen.laptopshop.model.User;
import com.sonnguyen.laptopshop.model.WishlistItem;
import com.sonnguyen.laptopshop.repository.ProductRepository;
import com.sonnguyen.laptopshop.repository.WishlistRepository;
import com.sonnguyen.laptopshop.service.WishlistService;
import com.sonnguyen.laptopshop.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {
    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    @Override
    public List<WishlistItem> getMyWishlist() {
        User user = SecurityUtils.getCurrentUser();
        return wishlistRepository.findAllByUser(user);
    }

    @Override
    public WishlistItem addToWishlist(Long productId) {
        User user = SecurityUtils.getCurrentUser();
        Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalStateException("Product not found"));
        // check if exists
        return wishlistRepository.findByUser_IdAndProduct_Id(user.getId(), productId)
                .orElseGet(() -> {
                    WishlistItem it = new WishlistItem();
                    it.setUser(user);
                    it.setProduct(product);
                    return wishlistRepository.save(it);
                });
    }

    @Override
    public void removeFromWishlist(Long productId) {
        User user = SecurityUtils.getCurrentUser();
    wishlistRepository.deleteByUser_IdAndProduct_Id(user.getId(), productId);
    }
}
