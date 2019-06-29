export const goToIdOnPage = (id) => { 

  let blokki = 'start'
  if (id === 'map') {
    blokki = 'center'
  }
 
  /* window.scrollTo(
    0,
    document.getElementById(id).getBoundingClientRect().y
  ); */

  // KATSO TÄSTÄ PARAMETRIT ----BLOCK: START / END
  //document.getElementById(id).scrollIntoView({ behavior: "smooth", block: blokki, inline: "nearest" })
};