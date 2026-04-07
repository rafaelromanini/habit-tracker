package com.habittracker.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.*;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger configuration.
 * Accessible at /swagger-ui.html
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Habit Tracker API",
        version = "1.0.0",
        description = "REST API for the Habit Tracker application",
        contact = @Contact(
            name = "Habit Tracker",
            url = "https://github.com/yourusername/habit-tracker"
        ),
        license = @License(
            name = "MIT License",
            url = "https://opensource.org/licenses/MIT"
        )
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Local Development"),
        @Server(url = "https://your-api.railway.app", description = "Production")
    }
)
@SecurityScheme(
    name = "bearerAuth",
    description = "JWT Bearer token",
    scheme = "bearer",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {}
