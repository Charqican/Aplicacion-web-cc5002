//clase extraida desde https://jose.cl/tmp/ejemplo.html

// When the user clicks anywhere outside of the modal, close it

let openModal = (elemento) => {
  let modal = elemento.getElementsByClassName("modal")[0]
  let span = elemento.getElementsByClassName("close")[0]
  modal.style.display = "block";
  span.onclick = function() {
    modal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

