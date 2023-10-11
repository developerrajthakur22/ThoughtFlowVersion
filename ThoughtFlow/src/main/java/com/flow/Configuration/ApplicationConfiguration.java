package com.flow.Configuration;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
public class ApplicationConfiguration {
	
	@Bean
    public SecurityFilterChain allowURLs(HttpSecurity http) throws Exception {
		
		http.sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
		.cors(cors -> {
		     cors.configurationSource(new CorsConfigurationSource() {
		    	
		    	 @Override
		    	 public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
		    		 CorsConfiguration configuration = new CorsConfiguration();
		    		 configuration.setAllowedOriginPatterns(Collections.singletonList("*"));   //set domain name "http://railways/""
		    		 configuration.setAllowedMethods(Collections.singletonList("*")); //set methods which Http method you want to allow eg: "GET","POST
		    		 configuration.setAllowCredentials(true);
		    		 configuration.setAllowedHeaders(Collections.singletonList("*"));
		    		 configuration.setExposedHeaders(Arrays.asList("Authorization")); //to send authorization, jwt, csrf token we need mention here 
		    		 return configuration;
		    	 }
		     });	
		})
		.authorizeHttpRequests(auth-> 
		 auth.requestMatchers(HttpMethod.POST, "/addUser").permitAll()
		.anyRequest().authenticated())
		.csrf(csrf -> csrf.disable())
		.addFilterAfter(new JwtTokenGeneratorFilter(), BasicAuthenticationFilter.class)
		.addFilterBefore(new JwtTokenValidatorFilter(), BasicAuthenticationFilter.class)
		.httpBasic(Customizer.withDefaults());
		
		return http.build();
	}

	@Bean
    public PasswordEncoder getEncoder() {
    	return new BCryptPasswordEncoder();
    }
    
}
