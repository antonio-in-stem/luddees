package org.generation.luddies.controller;

import org.generation.luddies.model.Payment;
import org.generation.luddies.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public List<Payment> getAll() { return paymentService.getAll(); }

    @GetMapping("/{id}")
    public Payment getById(@PathVariable Long id) { return paymentService.getById(id); }

    @GetMapping("/order/{orderId}")
    public Payment getByOrder(@PathVariable Long orderId) { return paymentService.getByOrder(orderId); }

    @PostMapping
    public Payment create(@RequestBody Payment payment) { return paymentService.save(payment); }

    @PutMapping("/{id}")
    public Payment update(@PathVariable Long id, @RequestBody Payment payment) {
        return paymentService.update(id, payment);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        paymentService.delete(id);
        return "Payment deleted successfully";
    }
}
