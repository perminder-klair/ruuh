FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Termux-compatible paths
ENV PREFIX=/data/data/com.termux/files/usr
ENV HOME=/data/data/com.termux/files/home
ENV PATH="$PREFIX/bin:$PATH"

# Create Termux directory structure
RUN mkdir -p "$PREFIX/bin" \
    "$PREFIX/var/lib/proot-distro/installed-rootfs" \
    "$HOME" \
    /sdcard

# Install base packages (what a real Termux+Ubuntu would have)
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    ca-certificates \
    git \
    build-essential \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy mock scripts
COPY test/mocks/bin/ $PREFIX/bin/
RUN chmod +x $PREFIX/bin/*

# Create symlinks for all termux-* API commands pointing to the generic mock
RUN for cmd in \
    termux-battery-status termux-brightness termux-camera-info \
    termux-camera-photo termux-clipboard-get termux-clipboard-set \
    termux-contact-list termux-dialog termux-download \
    termux-fingerprint termux-infrared-frequencies termux-infrared-transmit \
    termux-job-scheduler termux-location termux-media-player \
    termux-media-scan termux-microphone-record termux-notification \
    termux-notification-remove termux-sensor termux-share \
    termux-sms-list termux-sms-send termux-storage-get \
    termux-telephony-call termux-telephony-cellinfo \
    termux-telephony-deviceinfo termux-toast termux-torch \
    termux-tts-engines termux-tts-speak termux-usb \
    termux-vibrate termux-volume termux-wake-lock \
    termux-wake-unlock termux-wallpaper termux-wifi-connectioninfo \
    termux-wifi-enable termux-wifi-scaninfo; do \
        ln -sf "$PREFIX/bin/termux-api-mock" "$PREFIX/bin/$cmd"; \
    done

# Copy project files
COPY scripts/ /scripts/
COPY pi/ /pi-source/
COPY test/verify.sh /test/verify.sh

WORKDIR $HOME
