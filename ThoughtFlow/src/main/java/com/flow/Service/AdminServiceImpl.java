package com.flow.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.flow.Entity.UserProfile;
import com.flow.Repository.UserProfileRepo;

@Service
public class AdminServiceImpl implements AdminService{

	@Autowired
	private UserProfileRepo userProfileRepo;
	
	@Override
	public List<UserProfile> getAllUser() {
		// TODO Auto-generated method stub
		return userProfileRepo.findAll();
	}

	
	
}
