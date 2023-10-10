package com.flow.Entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotNull;

@Embeddable
public class PostLike {
	
	@JoinColumn(unique = false)
	private long user;
	
	private String status;

	public PostLike() {
		super();
		// TODO Auto-generated constructor stub
	}

	public long getUser() {
		return user;
	}

	public void setUser(long user) {
		this.user = user;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
}
