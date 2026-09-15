package org.generation.luddies.service;

import org.generation.luddies.model.Order;
import org.generation.luddies.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAll() { return orderRepository.findAll(); }

    public Order getById(Long id) { return orderRepository.findById(id).orElse(null); }

    public List<Order> getByUser(Long userId) { return orderRepository.findByUser_Id(userId); }

    public Order save(Order order) { return orderRepository.save(order); }

    public Order update(Long id, Order order) {
        order.setId(id);
        return orderRepository.save(order);
    }

    public void delete(Long id) { orderRepository.deleteById(id); }
}
