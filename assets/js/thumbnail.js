function zoom(img) {
  if (!img.classList.contains('thumb-zoomed')) {
    img.classList.add('thumb-zoomed');
    document.body.classList.add('thumb-zoomed');
    setTimeout(function() {
      document.addEventListener('click', closeModal, { once: true });
    }, 10);
  }
  function closeModal(ev) {
    img.classList.remove('thumb-zoomed');
    document.body.classList.remove('thumb-zoomed');
  }
}