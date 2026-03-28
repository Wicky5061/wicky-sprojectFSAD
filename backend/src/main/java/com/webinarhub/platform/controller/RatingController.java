package com.webinarhub.platform.controller;

import com.webinarhub.platform.dto.RatingDto;
import com.webinarhub.platform.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    @Autowired
    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<RatingDto> submitRating(@RequestBody RatingDto ratingDto) {
        RatingDto saved = ratingService.submitRating(ratingDto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/webinar/{id}")
    public ResponseEntity<List<RatingDto>> getRatingsByWebinarId(@PathVariable Long id) {
        List<RatingDto> ratings = ratingService.getRatingsForWebinar(id);
        return ResponseEntity.ok(ratings);
    }
}
