function getVideoThumbnail(videoUrl, seekTime = 1.0, attempt = 0) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous"; // Ensure CORS is enabled on the server
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    let timeoutId;

    video.addEventListener("loadedmetadata", () => {
      if (video.duration < seekTime) seekTime = video.duration / 2; // Seek halfway if too short
      video.currentTime = seekTime;

      timeoutId = setTimeout(() => {
        console.warn(`Seek timeout for ${videoUrl}, retrying...`);
        if (attempt < 2) {
          resolve(getVideoThumbnail(videoUrl, 0.5, attempt + 1)); // Retry at 0.5s
        } else {
          reject(`Failed to generate thumbnail for ${videoUrl}`);
        }
      }, 3000);
    });

    video.addEventListener("canplay", () => {
      clearTimeout(timeoutId);

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to Blob instead of data URL
      canvas.toBlob((blob) => {
        if (blob) {
          const blobUrl = URL.createObjectURL(blob); // Create a temporary URL
          resolve(blobUrl);
        } else {
          reject("Failed to create thumbnail blob.");
        }
      }, "image/png");
    });

    video.addEventListener("error", (err) => {
      reject(`Error loading video: ${err.message}`);
    });
  });
}
