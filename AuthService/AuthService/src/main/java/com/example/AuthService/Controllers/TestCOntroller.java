package com.example.AuthService.Controllers;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/")
public class TestCOntroller {

@GetMapping
    public String bomboclat(){
    return "Bomoboclet";
}


    @GetMapping("/user")
    public Principal user(Principal user){
        return user;
    }


}
