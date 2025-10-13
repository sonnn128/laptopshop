package com.sonnguyen.laptopshop.payload.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class RefreshRequest {
    @NotEmpty
    private String refreshToken;
}
