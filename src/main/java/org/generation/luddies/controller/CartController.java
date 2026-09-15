package org.generation.luddies.controller;

import org.generation.luddies.model.Cart;
import org.generation.luddies.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public List<Cart> getAll() { return cartService.getAll(); }

    @GetMapping("/{id}")
    public Cart getById(@PathVariable Long id) { return cartService.getById(id); }

    @GetMapping("/user/{userId}")
    public List<Cart> getByUser(@PathVariable Long userId) { return cartService.getByUser(userId); }

    @PostMapping
    public Cart create(@RequestBody Cart cart) { return cartService.save(cart); }

    @PutMapping("/{id}")
    public Cart update(@PathVariable Long id, @RequestBody Cart cart) {
        return cartService.update(id, cart);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        cartService.delete(id);
        return "Cart deleted successfully";
    }
}
