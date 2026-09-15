package org.generation.luddies.service;

import org.generation.luddies.model.Cart;
import org.generation.luddies.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public List<Cart> getAll() { return cartRepository.findAll(); }

    public Cart getById(Long id) { return cartRepository.findById(id).orElse(null); }

    public List<Cart> getByUser(Long userId) { return cartRepository.findByUser_Id(userId); }

    public Cart save(Cart cart) { return cartRepository.save(cart); }

    public Cart update(Long id, Cart cart) {
        cart.setId(id);
        return cartRepository.save(cart);
    }

    public void delete(Long id) { cartRepository.deleteById(id); }
}
