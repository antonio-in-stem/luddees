package org.generation.luddies.service;

import org.generation.luddies.model.CartItem;
import org.generation.luddies.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public List<CartItem> getAll() { return cartItemRepository.findAll(); }

    public List<CartItem> getByCart(Long cartId) { return cartItemRepository.findByCart_Id(cartId); }

    public CartItem getById(Long id) { return cartItemRepository.findById(id).orElse(null); }

    public CartItem save(CartItem cartItem) { return cartItemRepository.save(cartItem); }

    public CartItem update(Long id, CartItem cartItem) {
        cartItem.setId(id);
        return cartItemRepository.save(cartItem);
    }

    public void delete(Long id) { cartItemRepository.deleteById(id); }

    @Transactional
    public void deleteByCart(Long cartId) {
        cartItemRepository.deleteByCart_Id(cartId);
    }
}
