package org.generation.luddies.controller;

import org.generation.luddies.model.Category;
import org.generation.luddies.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> getAll() { return categoryService.getAll(); }

    @GetMapping("/{id}")
    public Category getById(@PathVariable Integer id) { return categoryService.getById(id); }

    @PostMapping
    public Category create(@RequestBody Category category) { return categoryService.save(category); }

    @PutMapping("/{id}")
    public Category update(@PathVariable Integer id, @RequestBody Category category) {
        return categoryService.update(id, category);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        categoryService.delete(id);
        return "Category deleted successfully";
    }
}
