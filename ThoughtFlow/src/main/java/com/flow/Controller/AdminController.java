package com.flow.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flow.Entity.UserProfile;
import com.flow.Service.AdminService;
import com.flow.Service.UserService;

@RestController
public class AdminController {

	@Autowired 
	private AdminService adminService;
	
	@Autowired
	private UserService userService;
	
	
	@GetMapping("/allUser")
	public ResponseEntity<List<UserProfile>> getAllUsers(){
		
		List<UserProfile> users = adminService.getAllUser();
		return new ResponseEntity<>(users, HttpStatus.OK);
		
	}
	
}
