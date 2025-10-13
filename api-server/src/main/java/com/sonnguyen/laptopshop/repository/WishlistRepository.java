package com.sonnguyen.laptopshop.repository;

import com.sonnguyen.laptopshop.model.WishlistItem;
import com.sonnguyen.laptopshop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WishlistRepository extends JpaRepository<WishlistItem, UUID> {
    List<WishlistItem> findAllByUser(User user);
    Optional<WishlistItem> findByUser_IdAndProduct_Id(UUID userId, Long productId);
    void deleteByUser_IdAndProduct_Id(UUID userId, Long productId);
}
