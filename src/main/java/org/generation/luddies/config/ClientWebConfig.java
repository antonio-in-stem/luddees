package org.generation.luddies.config;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ClientWebConfig implements WebMvcConfigurer {

    private static boolean hasClientWebAssets(Path clientDir) {
        return Files.isDirectory(clientDir.resolve("images"));
    }

    static Optional<Path> findClientDirectory() {
        Path cwd = Path.of("").toAbsolutePath().normalize();
        Path[] directCandidates = new Path[] {
            cwd.resolve("client"),
            cwd.resolve("server").resolve("luddies").resolve("client"),
        };
        for (Path candidate : directCandidates) {
            if (hasClientWebAssets(candidate)) {
                return Optional.of(candidate.normalize());
            }
        }
        Path walk = cwd;
        for (int i = 0; i < 12 && walk != null; i++) {
            Path candidate = walk.resolve("client");
            if (hasClientWebAssets(candidate)) {
                return Optional.of(candidate.normalize());
            }
            walk = walk.getParent();
        }
        return Optional.empty();
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        Path clientDir = findClientDirectory().orElse(null);
        if (clientDir == null) {
            return;
        }
        String baseUri = clientDir.toUri().toString();
        if (!baseUri.endsWith("/")) {
            baseUri = baseUri + "/";
        }
        registry.addResourceHandler("/js/**").addResourceLocations(baseUri + "js/");
        registry.addResourceHandler("/html/**").addResourceLocations(baseUri + "html/");
        registry.addResourceHandler("/style/**").addResourceLocations(baseUri + "style/");
        registry.addResourceHandler("/images/**").addResourceLocations(baseUri + "images/");
    }
}
