package com.webinarhub.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Login response DTO - sent as @ResponseBody to frontend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String message;
    private UserDto user;

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
