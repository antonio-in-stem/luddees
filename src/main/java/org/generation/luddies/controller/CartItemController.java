package org.generation.luddies.controller;

import org.generation.luddies.model.CartItem;
import org.generation.luddies.service.CartItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;

    @GetMapping
    public List<CartItem> getAll() { return cartItemService.getAll(); }

    @GetMapping("/{id}")
    public CartItem getById(@PathVariable Long id) { return cartItemService.getById(id); }

    @GetMapping("/cart/{cartId}")
    public List<CartItem> getByCart(@PathVariable Long cartId) { return cartItemService.getByCart(cartId); }

    @PostMapping
    public CartItem create(@RequestBody CartItem cartItem) { return cartItemService.save(cartItem); }

    @PutMapping("/{id}")
    public CartItem update(@PathVariable Long id, @RequestBody CartItem cartItem) {
        return cartItemService.update(id, cartItem);
    }

    @DeleteMapping("/cart/{cartId}")
    public void deleteByCart(@PathVariable Long cartId) {
        cartItemService.deleteByCart(cartId);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        cartItemService.delete(id);
        return "Cart item deleted successfully";
    }
}
