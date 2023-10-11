package com.flow.Configuration;

import java.io.IOException;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtTokenGeneratorFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		
		if(authentication != null) {
			SecretKey key = Keys.hmacShaKeyFor(SecurityConstants.JWT_KEY.getBytes());
			
			String jwt = Jwts.builder()
					     .setIssuer("ThoughtFlowApplication")
					     .setSubject("JWT Token")
					     .claim("username", authentication.getName())
					     .claim("authorities", populateAuthorities(authentication.getAuthorities()))
					     .setIssuedAt(new Date())
					     .setExpiration(new Date(new Date().getTime()+ 300000000))
					     .signWith(key).compact();
			
			response.setHeader(SecurityConstants.JWT_HEADER, jwt);
		}
	}
	
	private String populateAuthorities(Collection<? extends GrantedAuthority> collection) {
		
		Set<String> authoritiesSet = new HashSet<>();
		
		for(GrantedAuthority authority: collection) {
			authoritiesSet.add(authority.getAuthority());
		}
		
		return String.join(",", authoritiesSet);
	}
	
	//This will make sure that this method will execute only one time
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request){
		
		return !request.getServletPath().equals("/login");
		
	}

}
