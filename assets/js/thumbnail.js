document.addEventListener("DOMContentLoaded", function () {
  const thumbnails = document.querySelectorAll(".thumbnail");
  const thumbnailsList = Array.from(thumbnails);
  let zoomedThumb = null;

  thumbnails.forEach(function (thumb) {
    thumb.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!thumb.classList.contains("thumb-zoomed")) {
        openZoom(thumb);
      } else {
        closeZoom(thumb);
      }
    });
    thumb.querySelector('.arrow-left')?.addEventListener('click', function(e) {
      e.stopPropagation();
      const prev = prevThumbnail(thumb);
      if (prev) {
        closeZoom(thumb);
        openZoom(prev);
      }
    });
    thumb.querySelector('.arrow-right')?.addEventListener('click', function(e) {
      e.stopPropagation();
      const next = nextThumbnail(thumb);
      if (next) {
        closeZoom(thumb);
        openZoom(next);
      }
    });
  });

  document.body.addEventListener("click", function (e) {
    if (zoomedThumb && !e.target.closest('.thumbnail')) {
      closeZoom(zoomedThumb);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!zoomedThumb) return;
    if (e.key === "Escape") {
      closeZoom(zoomedThumb);
    } else if (e.key === "ArrowRight") {
      const next = nextThumbnail(zoomedThumb);
      if (next) {
        closeZoom(zoomedThumb);
        openZoom(next);
      }
    } else if (e.key === "ArrowLeft") {
      const prev = prevThumbnail(zoomedThumb);
      if (prev) {
        closeZoom(zoomedThumb);
        openZoom(prev);
      }
    }
  });

  function nextThumbnail(currentThumb) {
    const idx = thumbnailsList.indexOf(currentThumb);
    if (idx !== -1 && idx < thumbnailsList.length - 1) {
      return thumbnailsList[idx + 1];
    }
    return null;
  }

  function prevThumbnail(currentThumb) {
    const idx = thumbnailsList.indexOf(currentThumb);
    if (idx !== -1 && idx > 0) {
      return thumbnailsList[idx - 1];
    }
    return null;
  }

  function openZoom(thumb) {
    thumb.classList.add("thumb-zoomed");
    document.body.classList.add("thumb-zoomed");
    zoomedThumb = thumb;
  }

  function closeZoom(thumb) {
    if (thumb) {
      thumb.classList.remove("thumb-zoomed");
      document.body.classList.remove("thumb-zoomed");
      zoomedThumb = thumb;
    }
  }
});
