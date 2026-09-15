package org.generation.luddies.controller;

import org.generation.luddies.model.User;
import org.generation.luddies.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAll() { return userService.getAll(); }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) { return userService.getById(id); }

    @PostMapping
    public User create(@RequestBody User user) { return userService.save(user); }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User user) {
        return userService.update(id, user);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        userService.delete(id);
        return "User deleted successfully";
    }
}
