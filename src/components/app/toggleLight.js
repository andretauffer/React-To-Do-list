function backgroundGradFx(initial, final) {
    const background = document.querySelector('body');
    const card = document.querySelectorAll('.toggle-light');
    let counter = initial;
  
    const interval = setInterval(() => {
      background.style.backgroundColor = `rgba(57, 53, 53, ${counter / 20} )`;
      for (let i = 0; i < card.length; i++) {
        card[i].style.backgroundColor = `rgba(225, 212, 212, ${counter / 20} )`;
        card[i].style.boxShadow = `3px 4px 18px 2px rgba(8, 7, 8, ${counter * 0.02 + 0.4})`;
      }
      if (counter === final) {
        return clearInterval(interval);
      }
      if (initial === 1) {
        counter += 1;
      } else if (initial === 17) {
        counter -= 1;
      }
    }, 50);
  }
  
  export default backgroundGradFx;