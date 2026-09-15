package org.generation.luddies.service;

import org.generation.luddies.model.OrderItem;
import org.generation.luddies.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    public List<OrderItem> getAll() { return orderItemRepository.findAll(); }

    public List<OrderItem> getByOrder(Long orderId) { return orderItemRepository.findByOrder_Id(orderId); }

    public OrderItem getById(Long id) { return orderItemRepository.findById(id).orElse(null); }

    public OrderItem save(OrderItem orderItem) { return orderItemRepository.save(orderItem); }

    public OrderItem update(Long id, OrderItem orderItem) {
        orderItem.setId(id);
        return orderItemRepository.save(orderItem);
    }

    public void delete(Long id) { orderItemRepository.deleteById(id); }
}
