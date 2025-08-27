document.addEventListener("DOMContentLoaded", function () {
  const thumbnails = document.querySelectorAll(".thumbnail img");
  const thumbnailsList = Array.from(thumbnails);
  let zoomedImg = null;

  thumbnails.forEach(function (img) {
    img.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!img.classList.contains("thumb-zoomed")) {
        openZoom(img);
      } else {
        closeZoom(img);
      }
    });
  });

  document.addEventListener("keydown", function (e) {
    if (!zoomedImg) return;
    if (e.key === "Escape") {
      closeZoom(zoomedImg);
    } else if (e.key === "ArrowRight") {
      const next = nextThumbnail(zoomedImg);
      if (next) {
        closeZoom(zoomedImg);
        openZoom(next);
      }
    } else if (e.key === "ArrowLeft") {
      const prev = prevThumbnail(zoomedImg);
      if (prev) {
        closeZoom(zoomedImg);
        openZoom(prev);
      }
    }
  });

  function nextThumbnail(currentImg) {
    const idx = thumbnailsList.indexOf(currentImg);
    if (idx !== -1 && idx < thumbnailsList.length - 1) {
      return thumbnailsList[idx + 1];
    }
    return null;
  }

  function prevThumbnail(currentImg) {
    const idx = thumbnailsList.indexOf(currentImg);
    if (idx !== -1 && idx > 0) {
      return thumbnailsList[idx - 1];
    }
    return null;
  }

  function openZoom(img) {
    img.classList.add("thumb-zoomed");
    document.body.classList.add("thumb-zoomed");
    zoomedImg = img;
  }

  function closeZoom(img) {
    if (img) {
      img.classList.remove("thumb-zoomed");
      document.body.classList.remove("thumb-zoomed");
      zoomedImg = null;
    }
  }
});
