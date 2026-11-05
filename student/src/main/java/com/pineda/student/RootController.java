package com.pineda.student;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")
    @ResponseBody
    public String root() {
        return "Student CRUD API is running. Base path: /pineda/students";
    }
}