package org.generation.luddies.repository;

import org.generation.luddies.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByUser_Id(Long userId);
    List<Order> findByStatus(Order.Status status);
}
