package org.generation.luddies.repository;

import org.generation.luddies.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByReference(String reference);
    Optional<Payment> findByOrder_Id(Long orderId);
    java.util.List<Payment> findByStatus(Payment.Status status);
}
