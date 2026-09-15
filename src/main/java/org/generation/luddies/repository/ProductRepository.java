package org.generation.luddies.repository;

import org.generation.luddies.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByIsActiveTrue();

    List<Product> findByPurchasableTrue();

    List<Product> findByTitleEsContainingIgnoreCase(String keyword);
}
