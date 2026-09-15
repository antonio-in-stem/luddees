package org.generation.luddies.service;

import org.generation.luddies.model.Roles;
import org.generation.luddies.repository.RolesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolesService {

    @Autowired
    private RolesRepository rolesRepository;

    public List<Roles> getAll() {
        return rolesRepository.findAll();
    }

    public Roles getById(Integer id) {
        return rolesRepository.findById(id).orElse(null);
    }

    public Roles save(Roles role) {
        return rolesRepository.save(role);
    }

    public Roles update(Integer id, Roles role) {
        role.setId(id);
        return rolesRepository.save(role);
    }

    public void delete(Integer id) {
        rolesRepository.deleteById(id);
    }
}
