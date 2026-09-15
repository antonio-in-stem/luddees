package org.generation.luddies.service;

import org.generation.luddies.model.Payment;
import org.generation.luddies.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAll() { return paymentRepository.findAll(); }

    public Payment getById(Long id) { return paymentRepository.findById(id).orElse(null); }

    public Payment getByOrder(Long orderId) { return paymentRepository.findByOrder_Id(orderId).orElse(null); }

    public Payment save(Payment payment) { return paymentRepository.save(payment); }

    public Payment update(Long id, Payment payment) {
        payment.setId(id);
        return paymentRepository.save(payment);
    }

    public void delete(Long id) { paymentRepository.deleteById(id); }
}
