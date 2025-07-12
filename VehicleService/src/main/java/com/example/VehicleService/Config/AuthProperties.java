package com.example.VehicleService.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "auth")
public class AuthProperties {

    private final Api api = new Api();
    private final Jwt jwt = new Jwt();


    public static class Api {

        private String internalKey;

        public String getInternalKey() {
            return internalKey;
        }

        public void setInternalKey(String internalKey) {
            this.internalKey = internalKey;
        }
    }



    public static class Jwt {
        private String secret;
        private long expiration;
        private String issuer;

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

        public long getExpiration() {
            return expiration;
        }

        public void setExpiration(long expiration) {
            this.expiration = expiration;
        }

        public String getIssuer() {
            return issuer;
        }

        public void setIssuer(String issuer) {
            this.issuer = issuer;
        }
    }


    public Api getApi() {
        return api;
    }

    public Jwt getJwt() {
        return jwt;
    }
}
