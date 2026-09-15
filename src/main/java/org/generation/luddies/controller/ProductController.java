package org.generation.luddies.controller;

import org.generation.luddies.model.Product;
import org.generation.luddies.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAll() { return productService.getAll(); }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) { return productService.getById(id); }

    @PostMapping
    public Product create(@RequestBody Product product) { return productService.save(product); }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        return productService.update(id, product);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        productService.delete(id);
        return "Product deleted successfully";
    }
}
