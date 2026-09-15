package org.generation.luddies.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title_es", nullable = false, length = 500)
    private String titleEs;

    @Column(name = "title_en", nullable = false, length = 500)
    private String titleEn;

    @Column(name = "meta_es", length = 255)
    private String metaEs;

    @Column(name = "meta_en", length = 255)
    private String metaEn;

    @Column(name = "description_es", nullable = false, columnDefinition = "TEXT")
    private String descriptionEs;

    @Column(name = "description_en", nullable = false, columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "price_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal priceAmount;

    @Column(nullable = false, columnDefinition = "CHAR(3)")
    private String currency = "MXN";

    @Column(name = "price_display_es", nullable = false, length = 80)
    private String priceDisplayEs;

    @Column(name = "price_display_en", nullable = false, length = 80)
    private String priceDisplayEn;

    @Column(name = "image_url", nullable = false, length = 1024)
    private String imageUrl;

    @Column(nullable = false)
    private boolean purchasable = true;

    @Column(name = "is_custom", nullable = false)
    private boolean isCustom = false;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitleEs() { return titleEs; }
    public void setTitleEs(String titleEs) { this.titleEs = titleEs; }

    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }

    public String getMetaEs() { return metaEs; }
    public void setMetaEs(String metaEs) { this.metaEs = metaEs; }

    public String getMetaEn() { return metaEn; }
    public void setMetaEn(String metaEn) { this.metaEn = metaEn; }

    public String getDescriptionEs() { return descriptionEs; }
    public void setDescriptionEs(String descriptionEs) { this.descriptionEs = descriptionEs; }

    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }

    public BigDecimal getPriceAmount() { return priceAmount; }
    public void setPriceAmount(BigDecimal priceAmount) { this.priceAmount = priceAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getPriceDisplayEs() { return priceDisplayEs; }
    public void setPriceDisplayEs(String priceDisplayEs) { this.priceDisplayEs = priceDisplayEs; }

    public String getPriceDisplayEn() { return priceDisplayEn; }
    public void setPriceDisplayEn(String priceDisplayEn) { this.priceDisplayEn = priceDisplayEn; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public boolean isPurchasable() { return purchasable; }
    public void setPurchasable(boolean purchasable) { this.purchasable = purchasable; }

    public boolean isCustom() { return isCustom; }
    public void setCustom(boolean custom) { isCustom = custom; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
