package org.generation.luddies.repository;

import org.generation.luddies.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByUser_Id(Long userId);

    Optional<Cart> findByUser_IdAndStatus(Long userId, Cart.Status status);
}
