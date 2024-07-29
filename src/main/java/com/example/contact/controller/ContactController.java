package com.example.contact.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.contact.model.Contact;
import com.example.contact.repo.ContactRepo;

@CrossOrigin
@RestController
public class ContactController {

	@Autowired
	private ContactRepo contactRepo;
	
	@GetMapping("/getAllContacts")
	public ResponseEntity<List<Contact>> getAllContacts() {
		try {
			List<Contact> contactList = new ArrayList<>();
			contactRepo.findAll().forEach(contactList::add);
			
			if(contactList.isEmpty()) return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			return new ResponseEntity<>(contactList , HttpStatus.OK);
		} catch (Exception ex){
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@GetMapping("/getContactById/{id}")
	public ResponseEntity<Contact> getContactById(@PathVariable Long id) {
		Optional<Contact> contactData = contactRepo.findById(id);
		
		if(contactData.isPresent()) return new ResponseEntity<>(contactData.get() , HttpStatus.OK);
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@PostMapping("/addContact")
	public ResponseEntity<Contact> addContact(@RequestBody Contact contact) {
		Contact contactObj = contactRepo.save(contact);
		return new ResponseEntity<>(contactObj , HttpStatus.OK);
	}
	
	@PostMapping("/updateContactById/{id}")
	public ResponseEntity<Contact> updateContactById(@PathVariable Long id , @RequestBody Contact newContactData) {
		Optional<Contact> oldcontactData = contactRepo.findById(id);
		
		if(oldcontactData.isPresent()) {
			Contact  updatedContactData = oldcontactData.get();
			updatedContactData.setName(newContactData.getName());
			updatedContactData.setNumber(newContactData.getNumber());
			
			Contact contactObj = contactRepo.save(updatedContactData);
			return new ResponseEntity<>(contactObj , HttpStatus.OK);
		}
		
		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@DeleteMapping("/deleteContactById/{id}")
	public ResponseEntity<HttpStatus> deleteContactById(@PathVariable Long id) {
		contactRepo.deleteById(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}
}
