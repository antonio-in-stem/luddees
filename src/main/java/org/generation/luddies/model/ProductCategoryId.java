package org.generation.luddies.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProductCategoryId implements Serializable {

    private Long productId;
    private Integer categoryId;

    public ProductCategoryId() {}

    public ProductCategoryId(Long productId, Integer categoryId) {
        this.productId = productId;
        this.categoryId = categoryId;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductCategoryId)) return false;
        ProductCategoryId that = (ProductCategoryId) o;
        return Objects.equals(productId, that.productId) &&
               Objects.equals(categoryId, that.categoryId);
    }

    @Override
    public int hashCode() { return Objects.hash(productId, categoryId); }
}
