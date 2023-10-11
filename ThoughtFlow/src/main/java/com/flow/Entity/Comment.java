package com.flow.Entity;

import java.util.Objects;

import jakarta.annotation.Nullable;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;

@Embeddable
public class Comment {
	
	@NotNull
	private String comment;
	
	@JoinColumn(unique = false)
	private long user;

	@Nullable
	private int commentLike;

	public Comment() {
		super();
		// TODO Auto-generated constructor stub
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public long getUser() {
		return user;
	}

	public void setUser(long user) {
		this.user = user;
	}

	public int getCommentLike() {
		return commentLike;
	}

	public void setCommentLike(int commentLike) {
		this.commentLike = commentLike;
	}

	@Override
	public int hashCode() {
		return Objects.hash(comment, commentLike);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Comment other = (Comment) obj;
		return Objects.equals(comment, other.comment) && commentLike == other.commentLike;
	}

}
