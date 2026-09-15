package org.generation.luddies.controller;

import org.generation.luddies.model.OrderItem;
import org.generation.luddies.service.OrderItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    @Autowired
    private OrderItemService orderItemService;

    @GetMapping
    public List<OrderItem> getAll() { return orderItemService.getAll(); }

    @GetMapping("/{id}")
    public OrderItem getById(@PathVariable Long id) { return orderItemService.getById(id); }

    @GetMapping("/order/{orderId}")
    public List<OrderItem> getByOrder(@PathVariable Long orderId) { return orderItemService.getByOrder(orderId); }

    @PostMapping
    public OrderItem create(@RequestBody OrderItem orderItem) { return orderItemService.save(orderItem); }

    @PutMapping("/{id}")
    public OrderItem update(@PathVariable Long id, @RequestBody OrderItem orderItem) {
        return orderItemService.update(id, orderItem);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        orderItemService.delete(id);
        return "Order item deleted successfully";
    }
}
