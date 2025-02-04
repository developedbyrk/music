// function getVideoThumbnail(videoUrl, seekTime = 1.0) {
//   return new Promise((resolve, reject) => {
//     const video = document.createElement("video");
//     video.src = videoUrl;
//     video.crossOrigin = "anonymous"; // Ensures CORS compatibility
//     video.muted = true;
//     video.playsInline = true;
//     video.preload = "metadata"; // Load metadata without playing

//     video.addEventListener("loadedmetadata", () => {
//       if (video.duration < seekTime) seekTime = 0;
//       video.currentTime = seekTime; // Seek to a specific frame
//     });

//     video.addEventListener("seeked", () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//       resolve(canvas.toDataURL("image/png")); // Convert to image
//     });

//     video.addEventListener("error", (err) => {
//       reject("Error loading video: " + err);
//     });
//   });
// }


function getVideoThumbnail(videoUrl, seekTime = 1.0, attempt = 0) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous"; // Ensures CORS compatibility
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto"; // Preload everything for better seeking

    let timeoutId;

    // Handle metadata loading
    video.addEventListener("loadedmetadata", () => {
      if (video.duration < seekTime) seekTime = video.duration / 2; // Seek halfway if too short
      video.currentTime = seekTime;

      // Timeout in case seeking gets stuck
      timeoutId = setTimeout(() => {
        console.warn(`Seek timeout for ${videoUrl}, retrying...`);
        if (attempt < 2) {
          resolve(getVideoThumbnail(videoUrl, 0.5, attempt + 1)); // Retry at 0.5s
        } else {
          reject(`Failed to generate thumbnail for ${videoUrl}`);
        }
      }, 3000); // 3 seconds max wait
    });

    // When the frame is ready
    video.addEventListener("canplay", () => {
      clearTimeout(timeoutId); // Clear timeout if we successfully get a frame

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png")); // Convert frame to image
    });

    video.addEventListener("error", (err) => {
      reject(`Error loading video: ${err.message}`);
    });
  });
}
