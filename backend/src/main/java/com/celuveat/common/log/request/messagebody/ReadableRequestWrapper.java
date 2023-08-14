package com.celuveat.common.log.request.messagebody;

import static java.nio.charset.StandardCharsets.UTF_8;

import io.micrometer.common.util.StringUtils;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;

public class ReadableRequestWrapper extends HttpServletRequestWrapper {

    private final Charset encoding;
    private final byte[] rawData;

    public ReadableRequestWrapper(HttpServletRequest request) {
        super(request);
        String charEncoding = request.getCharacterEncoding();
        this.encoding = getEncoding(charEncoding);
        try {
            InputStream is = request.getInputStream();
            this.rawData = is.readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Charset getEncoding(String charEncoding) {
        if (StringUtils.isBlank(charEncoding)) {
            return UTF_8;
        }
        return Charset.forName(charEncoding);
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(this.rawData);

        return new ServletInputStream() {
            @Override
            public boolean isFinished() {
                throw new UnsupportedOperationException("[ReadableRequestWrapper] isFinished() not supported");
            }

            @Override
            public boolean isReady() {
                throw new UnsupportedOperationException("[ReadableRequestWrapper] isReady() not supported");
            }

            @Override
            public void setReadListener(ReadListener listener) {
            }

            public int read() {
                return byteArrayInputStream.read();
            }
        };
    }

    @Override
    public BufferedReader getReader() {
        try {
            return new BufferedReader(new InputStreamReader(this.getInputStream(), this.encoding));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
