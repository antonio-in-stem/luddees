package org.generation.luddies.service;

import org.generation.luddies.model.Category;
import org.generation.luddies.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAll() { return categoryRepository.findAll(); }

    public List<Category> getActive() { return categoryRepository.findByIsActiveTrue(); }

    public Category getById(Integer id) { return categoryRepository.findById(id).orElse(null); }

    public Category save(Category category) { return categoryRepository.save(category); }

    public Category update(Integer id, Category category) {
        category.setId(id);
        return categoryRepository.save(category);
    }

    public void delete(Integer id) { categoryRepository.deleteById(id); }
}
