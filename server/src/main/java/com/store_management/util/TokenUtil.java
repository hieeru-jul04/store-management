package com.store_management.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public final class TokenUtil {

    private TokenUtil() {
    }

    public static Long getUserIdFromAuthorization(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Thiếu hoặc sai định dạng token");
        }
        String token = authorization.substring(7).trim();
        try {
            String decoded = new String(Base64.getDecoder().decode(token), StandardCharsets.UTF_8);
            String userIdPart = decoded.split(":")[0];
            return Long.parseLong(userIdPart);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Token không hợp lệ");
        }
    }
}
