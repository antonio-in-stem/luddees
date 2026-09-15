package org.generation.luddies.repository;

import org.generation.luddies.model.ProductCategory;
import org.generation.luddies.model.ProductCategoryId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, ProductCategoryId> {

    void deleteByProduct_Id(Long productId);

    List<ProductCategory> findByProduct_Id(Long productId);
    List<ProductCategory> findByCategoryId(Integer categoryId);
}
