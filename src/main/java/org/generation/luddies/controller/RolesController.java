package org.generation.luddies.controller;

import org.generation.luddies.model.Roles;
import org.generation.luddies.service.RolesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolesController {

    @Autowired
    private RolesService rolesService;

    @GetMapping
    public List<Roles> getAll() { return rolesService.getAll(); }

    @GetMapping("/{id}")
    public Roles getById(@PathVariable Integer id) { return rolesService.getById(id); }

    @PostMapping
    public Roles create(@RequestBody Roles roles) { return rolesService.save(roles); }

    @PutMapping("/{id}")
    public Roles update(@PathVariable Integer id, @RequestBody Roles roles) {
        return rolesService.update(id, roles);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Integer id) {
        rolesService.delete(id);
        return "Role deleted successfully";
    }
}
