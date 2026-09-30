# Deck build environment — pinned so local and CI PDF output are identical.
# Build from the REPO ROOT (the context must include design-system/):
#   docker build -f decks/Dockerfile -t decks-builder .
# Run a build:
#   docker run --rm -v "$PWD:/work" -w /work/decks -e DECK_VERSION=v1.0 decks-builder \
#     bash -c 'uv sync --frozen && uv run build.py'
FROM debian:12.12-slim

# LibreOffice Impress is version-pinned by the Debian 12 (bookworm) release
# together with the pinned base image tag; fontconfig provides fc-cache.
RUN apt-get update && apt-get install -y --no-install-recommends \
        libreoffice-impress fontconfig ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# uv, pinned to the version in use locally.
COPY --from=ghcr.io/astral-sh/uv:0.9.26 /uv /uvx /usr/local/bin/

# Derive the brand fonts from design-system/ (woff2 -> ttf via prepare.py) and
# install them into the system font directories, so LibreOffice renders PDFs
# with real Archivo / Archivo Black / Space Mono instead of fallbacks.
WORKDIR /opt/fontprep
COPY design-system/ design-system/
COPY decks/pyproject.toml decks/uv.lock decks/.python-version decks/prepare.py decks/
RUN cd decks && uv sync --frozen && uv run prepare.py \
    && install -d /usr/local/share/fonts/telematics-stack \
    && install -m 644 .cache/fonts/*.ttf /usr/local/share/fonts/telematics-stack/ \
    && fc-cache -f \
    && cd / && rm -rf /opt/fontprep

# Keep the container's venv outside any bind mount, so `docker run -v $PWD:/work`
# never fights with (or clobbers) a host .venv built for another platform.
ENV UV_PROJECT_ENVIRONMENT=/opt/venv

WORKDIR /work
CMD ["bash"]
