package com.flow.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.flow.Entity.User;

public interface UserRepository extends JpaRepository<User, Long>{

	Optional<User> findByUsername(String username);
	
}
