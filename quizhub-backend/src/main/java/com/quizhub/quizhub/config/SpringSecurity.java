package com.quizhub.quizhub.config;//package com.quizhub.quizhub.config;

import com.quizhub.quizhub.Filter.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SpringSecurity {
    @Autowired
    JwtFilter jwtFilter;

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        return http
//                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ Fix: Define corsConfigurationSource() method
//                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for stateless JWT authentication
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/**","/swagger-ui/**", "/swagger-ui/index.html", "/swagger-resources/**", "/v3/api-docs/**", "/public/**","/swagger-ui.html").permitAll()
//                        .requestMatchers("/questions/**", "/user/**").authenticated()
//                        .requestMatchers("/admin/**").hasRole("ADMIN")
//                        .anyRequest().authenticated()
//                )
//                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // JWT is stateless
//                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) // Add JWT filter before authentication
//                .build();
//    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth

                        // Public (no authentication required)
                        .requestMatchers(
                                "/public/login",
                                "/public/create-user",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/swagger-resources/**",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Admin-only access
                        .requestMatchers(
                                "/admin/create-new-admin",
                                "/admin/all-users",
                                "/admin/delete-user/**"
                        ).hasRole("ADMIN")

                        // Authenticated users only (regardless of role)
                        .requestMatchers(
                                HttpMethod.PUT, "/users"
                        ).authenticated()
                        .requestMatchers(
                                HttpMethod.DELETE, "/users"
                        ).authenticated()

                        // QuizAttemptController
                        .requestMatchers(
                                HttpMethod.POST, "/attempts/submit", "/attempts/start"
                        ).authenticated()
                        .requestMatchers(
                                HttpMethod.GET, "/attempts/**"
                        ).authenticated()
                        .requestMatchers(
                                HttpMethod.DELETE, "/attempts/**"
                        ).hasRole("STUDENT")

                        // QuestionController
                        .requestMatchers(
                                HttpMethod.GET, "/questions/**"
                        ).authenticated()
                        .requestMatchers(
                                HttpMethod.POST, "/questions/create"
                        ).hasRole("EDUCATOR")
                        .requestMatchers(
                                HttpMethod.PUT, "/questions/update-question/**"
                        ).hasRole("EDUCATOR")
                        .requestMatchers(
                                HttpMethod.DELETE, "/questions/delete-question/**"
                        ).hasRole("EDUCATOR")

                        // TopicController
                        .requestMatchers(
                                HttpMethod.GET, "/topics/gettopic/**", "/topics/getall-topics"
                        ).authenticated()
                        .requestMatchers(
                                HttpMethod.POST, "/topics/create-topic"
                        ).hasRole("EDUCATOR")

                            // QuizController

                            // GET requests – all authenticated users
                            .requestMatchers(
                                    HttpMethod.GET,
                                    "/quizzes/public",
                                    "/quizzes/public/**",
                                    "/quizzes/private",
                                    "/quizzes/private/**",
                                    "/quizzes/filtered/**",
                                    "/quizzes/details/**"
                            ).authenticated()

                           // POST /quizzes/create – only Educator
                            .requestMatchers(
                                    HttpMethod.POST,
                                    "/quizzes/create"
                            ).hasRole("EDUCATOR")

                            // POST /quizzes/filtered – only Student ✅
                            .requestMatchers(
                                    HttpMethod.POST,
                                    "/quizzes/filtered"
                            ).hasRole("STUDENT")

                            // DELETE /quizzes/** – only Educator
                            .requestMatchers(
                                    HttpMethod.DELETE,
                                    "/quizzes/**"
                            ).hasRole("EDUCATOR")


                        // Fallback for any other endpoints
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Define CORS Configuration Source
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:5173")); // Allow frontend requests
        config.setAllowedHeaders(List.of("*")); // Allow all headers
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allow necessary methods

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
