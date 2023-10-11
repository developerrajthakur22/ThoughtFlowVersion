package com.flow.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.flow.Entity.Post;

public interface PostRepository extends JpaRepository<Post,Long>{

	 @Query("SELECT p FROM Post p WHERE p.title LIKE %:keyword% OR p.tweet LIKE %:keyword%")
	 List<Post> findByTitleOrTweetContaining(String keyword);
	
}
