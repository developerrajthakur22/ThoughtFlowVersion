package com.flow.Exceptions;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(NotFoundException.class)
	public ResponseEntity<ErrorDetails> notFoundException(NotFoundException ex, WebRequest req){
		 ErrorDetails ed = new ErrorDetails();
		 ed.setMessage(ex.getMessage());
		 ed.setDescription(req.getDescription(false));
		 ed.setTime(LocalDateTime.now());
		 
		 return new ResponseEntity<>(ed,HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(SomethingWentWrong.class)
	public ResponseEntity<ErrorDetails> somethingWentWrongException(SomethingWentWrong ex, WebRequest req){
		 ErrorDetails ed = new ErrorDetails();
		 ed.setMessage(ex.getMessage());
		 ed.setDescription(req.getDescription(false));
		 ed.setTime(LocalDateTime.now());
		 
		 return new ResponseEntity<>(ed,HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorDetails> exception(Exception ex, WebRequest req){
		 ErrorDetails ed = new ErrorDetails();
		 ed.setMessage(ex.getMessage());
		 ed.setDescription(req.getDescription(false));
		 ed.setTime(LocalDateTime.now());
		 
		 return new ResponseEntity<>(ed,HttpStatus.BAD_REQUEST);
	}
	
}
