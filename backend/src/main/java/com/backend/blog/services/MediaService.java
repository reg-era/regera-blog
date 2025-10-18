package com.backend.blog.services;

import org.jcodec.api.FrameGrab;
import org.jcodec.common.io.NIOUtils;
import org.jcodec.common.model.Picture;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import org.jcodec.api.JCodecException;
import org.jcodec.scale.AWTUtil;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;

@Service
public class MediaService {

    public record InnerMediaService(String cover, String media) {
    }

    private static final Set<String> IMAGE_EXTS = Set.of("jpg", "jpeg", "png", "webp");
    private static final Set<String> VIDEO_EXTS = Set.of("mp4", "webm");

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final long MAX_VIDEO_SIZE = 15 * 1024 * 1024; // 15MB

    @Value("${app.media.path}")
    private String mediaLocation;

    public static final String DEFAULT_BLOG = "/media/images/default-blog.jpg";
    public static final String DEFAULT_USER = "/media/images/default-profile.jpg";

    public String getBasePath() {
        return new File(mediaLocation).getAbsolutePath();
    }

    public InnerMediaService downloadMedia(MultipartFile media) {
        if (media == null || media.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No file uploaded.");
        }

        String originalFilename = Objects.requireNonNull(media.getOriginalFilename());
        String extension = getExtension(originalFilename);

        String mediaType;
        if (IMAGE_EXTS.contains(extension)) {
            validateSize(media, MAX_IMAGE_SIZE);
            mediaType = "images";
        } else if (VIDEO_EXTS.contains(extension)) {
            validateSize(media, MAX_VIDEO_SIZE);
            mediaType = "videos";
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported file type: " + extension);
        }

        String uniqueName = UUID.randomUUID().toString() + "." + extension;

        File mediaDir = new File(this.getBasePath(), mediaType);
        if (!mediaDir.exists()) {
            mediaDir.mkdirs();
        }

        Path dest = Path.of(mediaDir.getAbsolutePath(), uniqueName);

        try {
            Files.copy(media.getInputStream(), dest);
        } catch (IOException e) {
            System.err.println("error coping file: " + e.getMessage());
            System.err.println("from dest : " + dest);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save the file");
        }

        String videoUrl = "/media/" + mediaType + "/" + uniqueName;
        String coverUrl = null;

        if ("videos".equals(mediaType)) {
            coverUrl = generateVideoCoverImage(dest.toFile(), uniqueName);
        } else {
            coverUrl = videoUrl;
        }

        return new InnerMediaService(coverUrl, videoUrl);
    }

    public boolean clearMedia(String mediaPath) {
        if (mediaPath == null || mediaPath.trim().isEmpty()) {
            System.out.println("File path is null or empty.");
            return false;
        }

        if (mediaPath.equals(DEFAULT_BLOG) || mediaPath.equals(DEFAULT_USER))
            return true;

        try {
            Path path = Paths.get(this.getBasePath(), mediaPath.replace("/media", ""));

            if (!Files.exists(path) || !Files.isWritable(path)) {
                System.out.printf("File does not exist or locked: %s\n", path);
                return false;
            }

            Files.delete(path);
            return true;

        } catch (IOException | SecurityException e) {
            System.out.printf("Failed to delete file: %s. Error: %s\n", mediaPath, e.getMessage());
            return false;
        }
    }

    private void validateSize(MultipartFile file, long maxSize) {
        if (file.getSize() > maxSize) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "File size exceeds limit: " + (maxSize / (1024 * 1024)) + "MB");
        }
    }

    private String getExtension(String filename) {
        String[] parts = filename.toLowerCase().split("\\.");
        if (parts.length < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File must have an extension.");
        }
        return parts[parts.length - 1];
    }

    private String generateVideoCoverImage(File videoFile, String originalVideoName) {
        String baseName = originalVideoName.substring(0, originalVideoName.lastIndexOf('.'));
        String thumbnailName = baseName + ".jpg";

        File imageDir = new File(this.getBasePath(), "images");
        if (!imageDir.exists()) {
            imageDir.mkdirs();
        }

        File thumbnailFile = new File(imageDir, thumbnailName);

        try {
            FrameGrab grab = FrameGrab.createFrameGrab(NIOUtils.readableChannel(videoFile));
            grab.seekToSecondPrecise(1); // 1-second

            Picture picture = grab.getNativeFrame();
            if (picture == null) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No frame found in video.");
            }

            BufferedImage bufferedImage = AWTUtil.toBufferedImage(picture);
            ImageIO.write(bufferedImage, "jpg", thumbnailFile);

            return "/media/images/" + thumbnailName;

        } catch (IOException | JCodecException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "No frame found in video.");
        }
    }

}
