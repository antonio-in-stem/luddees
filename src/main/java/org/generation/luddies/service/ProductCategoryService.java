package org.generation.luddies.service;

import org.generation.luddies.model.ProductCategory;
import org.generation.luddies.model.ProductCategoryId;
import org.generation.luddies.repository.CategoryRepository;
import org.generation.luddies.repository.ProductCategoryRepository;
import org.generation.luddies.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductCategoryService {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<ProductCategory> getAll() { return productCategoryRepository.findAll(); }

    public List<ProductCategory> getByProduct(Long productId) {
        return productCategoryRepository.findByProduct_Id(productId);
    }

    public List<ProductCategory> getByCategory(Integer categoryId) {
        return productCategoryRepository.findByCategoryId(categoryId);
    }

    @Transactional
    public ProductCategory save(ProductCategory productCategory) {
        if (productCategory == null || productCategory.getProduct() == null || productCategory.getCategory() == null) {
            throw new IllegalArgumentException("invalid_product_category");
        }
        Long productId = productCategory.getProduct().getId();
        Integer categoryId = productCategory.getCategory().getId();
        if (productId == null || categoryId == null) {
            throw new IllegalArgumentException("invalid_product_category");
        }
        ProductCategoryId id = new ProductCategoryId(productId, categoryId);
        ProductCategory existing = productCategoryRepository.findById(id).orElse(null);
        if (existing != null) {
            return existing;
        }
        productCategory.setProduct(productRepository.getReferenceById(productId));
        productCategory.setCategory(categoryRepository.getReferenceById(categoryId));
        productCategory.setId(id);
        return productCategoryRepository.save(productCategory);
    }

    @Transactional
    public void deleteByProductId(Long productId) {
        productCategoryRepository.deleteByProduct_Id(productId);
    }

    public void delete(ProductCategoryId id) { productCategoryRepository.deleteById(id); }
}
