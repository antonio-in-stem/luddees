package org.generation.luddies.controller;

import org.generation.luddies.model.Order;
import org.generation.luddies.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getAll() { return orderService.getAll(); }

    @GetMapping("/{id}")
    public Order getById(@PathVariable Long id) { return orderService.getById(id); }

    @GetMapping("/user/{userId}")
    public List<Order> getByUser(@PathVariable Long userId) { return orderService.getByUser(userId); }

    @PostMapping
    public Order create(@RequestBody Order order) { return orderService.save(order); }

    @PutMapping("/{id}")
    public Order update(@PathVariable Long id, @RequestBody Order order) {
        return orderService.update(id, order);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        orderService.delete(id);
        return "Order deleted successfully";
    }
}
