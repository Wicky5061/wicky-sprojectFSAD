package com.webinarhub.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Login response DTO — sent as @ResponseBody to frontend.
 * Includes a token field for authorization on subsequent requests.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String message;
    private String token;
    private UserDto user;

    public LoginResponse(String message, UserDto user) {
        this.message = message;
        this.user = user;
        this.token = user != null ? String.valueOf(user.getId()) : null;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }
}
