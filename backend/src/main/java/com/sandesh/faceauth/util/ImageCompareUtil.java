package com.sandesh.faceauth.util;

import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import java.io.File;
import java.io.IOException;

public class ImageCompareUtil {

    public static double compareImages(File img1, File img2) throws IOException {

        BufferedImage image1 = ImageIO.read(img1);
        BufferedImage image2 = ImageIO.read(img2);

        int width = Math.min(image1.getWidth(), image2.getWidth());
        int height = Math.min(image1.getHeight(), image2.getHeight());

        long diff = 0;

        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                diff += Math.abs(image1.getRGB(x, y) - image2.getRGB(x, y));
            }
        }

        double maxDiff = (double) width * height * Integer.MAX_VALUE;
        return 100.0 - (diff * 100.0 / maxDiff);
    }
}
