package com.webinarhub.platform.service;

import com.webinarhub.platform.dto.RatingDto;
import com.webinarhub.platform.entity.Rating;
import com.webinarhub.platform.entity.User;
import com.webinarhub.platform.exception.BadRequestException;
import com.webinarhub.platform.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserService userService;
    private final WebinarService webinarService;

    @Autowired
    public RatingService(RatingRepository ratingRepository, UserService userService, WebinarService webinarService) {
        this.ratingRepository = ratingRepository;
        this.userService = userService;
        this.webinarService = webinarService;
    }

    @Transactional
    public RatingDto submitRating(RatingDto request) {
        if (request.getStars() == null || request.getStars() < 1 || request.getStars() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5 stars");
        }
        
        // Ensure user and webinar exist
        User user = userService.getUserEntityById(request.getUserId());
        webinarService.getWebinarEntityById(request.getWebinarId());

        if (ratingRepository.existsByUserIdAndWebinarId(request.getUserId(), request.getWebinarId())) {
            throw new BadRequestException("You have already rated this webinar");
        }

        Rating rating = new Rating();
        rating.setUserId(request.getUserId());
        rating.setWebinarId(request.getWebinarId());
        rating.setStars(request.getStars());
        rating.setComment(request.getComment());

        Rating saved = ratingRepository.save(rating);

        RatingDto dto = convertToDto(saved);
        dto.setUserName(user.getName());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<RatingDto> getRatingsForWebinar(Long webinarId) {
        // Just verify webinar exists
        webinarService.getWebinarEntityById(webinarId);
        
        return ratingRepository.findByWebinarIdOrderByCreatedAtDesc(webinarId).stream()
                .map(rating -> {
                    RatingDto dto = convertToDto(rating);
                    try {
                        User user = userService.getUserEntityById(rating.getUserId());
                        dto.setUserName(user.getName());
                    } catch (Exception e) {
                        dto.setUserName("Unknown User");
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private RatingDto convertToDto(Rating rating) {
        RatingDto dto = new RatingDto();
        dto.setId(rating.getId());
        dto.setUserId(rating.getUserId());
        dto.setWebinarId(rating.getWebinarId());
        dto.setStars(rating.getStars());
        dto.setComment(rating.getComment());
        dto.setCreatedAt(rating.getCreatedAt());
        return dto;
    }
}
