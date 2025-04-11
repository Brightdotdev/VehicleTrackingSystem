package com.example.DispatchService.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dispatch")
public class DispatchController {


    @GetMapping
    public String getOne() {
        return "Dispatch ooo";
    }
}
