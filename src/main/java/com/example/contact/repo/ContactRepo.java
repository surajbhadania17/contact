package com.example.contact.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.contact.model.Contact;

@Repository
public interface ContactRepo extends JpaRepository<Contact , Long>{
	
}
