# Docker Deployment

This application can be deployed using Docker containers.

## Building the Docker Image

```bash
docker build -t find-the-impostor .
```

## Running the Container

### Basic Run

```bash
docker run -p 3000:3000 \
  -e AI_PROVIDER=openrouter \
  -e AI_API_KEY=your_api_key_here \
  -e AI_MODEL=google/gemini-2.0-flash-exp:free \
  find-the-impostor
```

### With Environment File

Create a `.env.production` file:

```env
AI_PROVIDER=openrouter
AI_API_KEY=your_api_key_here
AI_MODEL=google/gemini-2.0-flash-exp:free
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Then run:

```bash
docker run -p 3000:3000 --env-file .env.production find-the-impostor
```

## Docker Compose

Create a `docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - AI_PROVIDER=openrouter
      - AI_API_KEY=${AI_API_KEY}
      - AI_MODEL=google/gemini-2.0-flash-exp:free
      - NEXT_PUBLIC_APP_URL=https://your-domain.com
    restart: unless-stopped
```

Run with:

```bash
docker-compose up -d
```

## GitHub Container Registry

Images are automatically published to GitHub Container Registry on each release.

### Pull from Registry

```bash
docker pull ghcr.io/al6688me/find-the-impostor:latest
```

### Run from Registry

```bash
docker run -p 3000:3000 \
  -e AI_PROVIDER=openrouter \
  -e AI_API_KEY=your_api_key_here \
  -e AI_MODEL=google/gemini-2.0-flash-exp:free \
  ghcr.io/al6688me/find-the-impostor:latest
```

## Environment Variables

Required environment variables for the Docker container:

- `AI_PROVIDER`: AI provider (openrouter, openai, anthropic, gemini)
- `AI_API_KEY`: API key for the selected provider
- `AI_MODEL`: Model to use

Optional environment variables:

- `AI_BASE_URL`: Custom API endpoint
- `AI_FALLBACK_MODEL`: Fallback model if primary fails
- `NEXT_PUBLIC_APP_URL`: Public URL of your application
- `SENTRY_DSN`: Sentry DSN for error tracking
- `NEXT_PUBLIC_SENTRY_DSN`: Client-side Sentry DSN

## Multi-platform Support

The Docker image is built for both AMD64 and ARM64 architectures, so it works on:

- x86_64 servers
- Apple Silicon (M1/M2/M3)
- ARM-based cloud instances

## Image Size Optimization

The Docker image uses Next.js standalone output mode, which significantly reduces the image size by:

- Only including necessary dependencies
- Excluding dev dependencies
- Using multi-stage builds
- Leveraging Docker layer caching
